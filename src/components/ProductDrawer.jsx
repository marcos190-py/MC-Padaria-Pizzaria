import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageSquare } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../data/menuData';

/*
  COMPONENTE AUXILIAR: InputWrapper
  Encapsula a lógica de "input rígido" em um único lugar.

  Por que flex-none + overflow-hidden resolvem a distorção:
  - flex-none: define flex-grow:0; flex-shrink:0; flex-basis:auto.
    O wrapper NÃO cresce, NÃO encolhe, e ignora align-items:stretch do pai.
  - w-4 h-4 explícitos: fixam as dimensões sem depender de herança.
  - overflow-hidden: isola qualquer vazamento interno do input nativo.
  - O <input> recebe w-4 h-4 fixos (não w-full h-full, que herdaria o tamanho
    distorcido se o wrapper fosse esticado antes do overflow-hidden agir).
  - block no input remove o display:inline padrão, que pode causar sub-pixel
    de descida vertical em alguns motores (especialmente WebKit/Blink mobile).
*/
const InputWrapper = ({ children }) => (
  <div className="flex-none w-4 h-4 overflow-hidden flex items-center justify-center">
    {children}
  </div>
);

export const ProductDrawer = ({ isOpen, onClose, product, category }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedBorda, setSelectedBorda] = useState(null);
  const [selectedAdicionais, setSelectedAdicionais] = useState([]);
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedBorda(null);
      setSelectedAdicionais([]);
      setObservacao('');
      setSelectedSize(null);
    }
  }, [isOpen]);

  if (!product || !category) return null;

  const isPizza = !!category.precos_base;
  const listaBordas = category.opcionais_bordas || [];
  const listaAdicionais = category.adicionais_hamburguer || category.adicionais_pizza || [];

  const isSizeValid = !isPizza || selectedSize !== null;
  const isBordaValid = listaBordas.length === 0 || selectedBorda !== null;
  const canAdd = isSizeValid && isBordaValid;

  const handleAdicionalToggle = (addon) => {
    setSelectedAdicionais((prev) => {
      const exists = prev.find((a) => a.nome === addon.nome);
      if (exists) return prev.filter((a) => a.nome !== addon.nome);
      return [...prev, addon];
    });
  };

  const getBasePrice = () =>
    isPizza && selectedSize ? category.precos_base[selectedSize] : product.preco || 0;

  const getAddonsTotal = () => {
    let total = selectedAdicionais.reduce((acc, addon) => acc + addon.preco, 0);
    if (selectedBorda) total += selectedBorda.preco;
    return total;
  };

  const unitPrice = getBasePrice() + getAddonsTotal();
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!canAdd) return;
    const finalAddons = [...selectedAdicionais];
    if (selectedBorda && selectedBorda.preco > 0) {
      finalAddons.push({ nome: selectedBorda.nome, preco: selectedBorda.preco, tipo: 'borda' });
    }

    addToCart({
      productName: product.nome,
      categoryName: category.titulo,
      size: selectedSize,
      addons: finalAddons,
      observacao: observacao.trim(),
      quantity,
      unitPrice,
      totalPrice,
    });
    onClose();
  };

  /*
    PADRÃO DE ROW DEFENSIVO usado em todas as linhas de opção (tamanho/borda/adicional):

    <label> (flex justify-between)
      ├── <div> (flex items-center gap-3 flex-1 min-w-0)  ← CONTÉM O INPUT + TEXTO
      │     ├── <InputWrapper>                             ← RÍGIDO: flex-none w-4 h-4
      │     │     └── <input w-4 h-4 block>               ← FIXO: sem w-full h-full
      │     └── <span truncate min-w-0>                   ← TEXTO: trunca ao invés de vazar
      └── <span flex-none>                                ← PREÇO: nunca encolhe

    O par flex-1 min-w-0 + InputWrapper(flex-none) é o núcleo da solução:
    - flex-1 min-w-0 no div interno permite que ele encolha, passando espaço para o InputWrapper
    - flex-none no InputWrapper garante que o input NUNCA seja esticado pelo flex pai
  */

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            // FIX: overflow-x-hidden no drawer inteiro — barreira final contra vazamentos
            className="fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900 rounded-t-3xl z-50 flex flex-col max-h-[92vh] shadow-2xl overflow-x-hidden"
          >
            <div className="w-full flex justify-center pt-3 pb-3 flex-none">
              <div className="w-10 h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full" />
            </div>

            {/* FIX: overflow-x-hidden reforça a contenção na área scrollável */}
            <div className="px-4 md:px-6 pb-6 overflow-y-auto flex-1 overscroll-contain hide-scrollbar w-full overflow-x-hidden">

              {/* Cabeçalho do produto */}
              <div className="mb-5 min-w-0 w-full overflow-hidden">
                {/*
                  FIX: break-words no título do produto.
                  Nomes como "Estrogonofe/Carne de Sol (c/ Batata Palha)" têm
                  segmentos longos sem espaço. break-words os quebra na borda.
                */}
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight break-words overflow-hidden">
                  {product.nome}
                </h2>
                {product.ingredientes && (
                  /*
                    FIX: break-words + whitespace-normal + overflow-hidden.
                    Ingredientes são listas separadas por vírgula que podem ser longas.
                    line-clamp-3 colapsa o excesso visualmente.
                  */
                  <p className="text-[12px] md:text-sm text-slate-500 dark:text-zinc-400 mt-1.5 leading-snug line-clamp-3 break-words whitespace-normal overflow-hidden">
                    {product.ingredientes}
                  </p>
                )}
              </div>

              {/* ─── TAMANHO DA PIZZA ─── */}
              {isPizza && (
                <div className="mb-6 w-full">
                  <div className="flex items-center justify-between mb-2 bg-slate-100 dark:bg-zinc-800 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-[13px] md:text-sm">
                      Tamanho da Pizza
                    </h4>
                    {/* FIX: flex-none no badge — nunca encolhe ou estica */}
                    <span className="text-[9px] uppercase font-bold tracking-wider bg-red-100 text-[#E30613] dark:bg-red-900/30 px-2 py-1 rounded flex-none">
                      Obrigatório
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {Object.entries(category.precos_base).map(([size, price]) => (
                      <label
                        key={size}
                        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all w-full overflow-hidden ${
                          selectedSize === size
                            ? 'border-[#E30613] bg-red-50/50 dark:bg-red-900/10'
                            : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {/*
                          FIX: flex-1 min-w-0 neste div interno é o que permite que
                          o texto ao lado do input quebre/trunca em vez de empurrar o layout.
                          Sem min-w-0, o flex item assume min-width:auto e força largura mínima
                          igual ao conteúdo de texto, rompendo o container pai.
                        */}
                        <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                          {/*
                            FIX CENTRAL DO INPUT:
                            - InputWrapper usa flex-none w-4 h-4 overflow-hidden
                            - O <input> tem w-4 h-4 block fixos (não w-full h-full)
                            - Isso cria um "bloco rígido" que o flex pai não consegue distorcer
                          */}
                          <InputWrapper>
                            <input
                              type="radio"
                              name="p_size"
                              className="block w-4 h-4 m-0 p-0 cursor-pointer accent-[#E30613]"
                              checked={selectedSize === size}
                              onChange={() => setSelectedSize(size)}
                            />
                          </InputWrapper>
                          {/*
                            FIX: min-w-0 no span do texto + truncate.
                            O span é um flex item do div acima (flex items-center).
                            Sem min-w-0, o span não pode ser menor que seu conteúdo,
                            então truncate nunca dispara.
                          */}
                          <span className="text-[13px] md:text-sm text-slate-800 dark:text-zinc-200 font-semibold truncate min-w-0">
                            {size === '6ft' ? 'Pequena (6 Fatias)' : 'Grande (8 Fatias)'}
                          </span>
                        </div>
                        {/* FIX: flex-none no preço — não encolhe, não cresce, não distorce */}
                        <span className="text-[13px] md:text-sm text-slate-600 dark:text-zinc-400 font-medium flex-none ml-2">
                          {formatPrice(price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── BORDAS ─── */}
              {listaBordas.length > 0 && (
                <div className="mb-6 w-full">
                  <div className="flex items-center justify-between mb-2 bg-slate-100 dark:bg-zinc-800 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-[13px] md:text-sm">
                      Borda Recheada
                    </h4>
                    <span className="text-[9px] uppercase font-bold tracking-wider bg-red-100 text-[#E30613] dark:bg-red-900/30 px-2 py-1 rounded flex-none">
                      Obrigatório
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {listaBordas.map((borda) => (
                      <label
                        key={borda.nome}
                        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all w-full overflow-hidden ${
                          selectedBorda?.nome === borda.nome
                            ? 'border-[#E30613] bg-red-50/50 dark:bg-red-900/10'
                            : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                          <InputWrapper>
                            <input
                              type="radio"
                              name="p_borda"
                              className="block w-4 h-4 m-0 p-0 cursor-pointer accent-[#E30613]"
                              checked={selectedBorda?.nome === borda.nome}
                              onChange={() => setSelectedBorda(borda)}
                            />
                          </InputWrapper>
                          <span className="text-[13px] md:text-sm text-slate-800 dark:text-zinc-200 font-semibold truncate min-w-0">
                            {borda.nome}
                          </span>
                        </div>
                        <span className="text-[13px] md:text-sm text-slate-600 dark:text-zinc-400 font-medium flex-none ml-2">
                          {borda.preco > 0 ? `+ ${formatPrice(borda.preco)}` : 'Grátis'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── ADICIONAIS ─── */}
              {listaAdicionais.length > 0 && (
                <div className="mb-6 w-full">
                  <div className="flex items-center justify-between mb-2 bg-slate-100 dark:bg-zinc-800 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-[13px] md:text-sm">
                      Adicionais?
                    </h4>
                    <span className="text-[9px] uppercase font-bold tracking-wider bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-zinc-300 px-2 py-1 rounded flex-none">
                      Opcional
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {listaAdicionais.map((addon) => (
                      <label
                        key={addon.nome}
                        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all w-full overflow-hidden ${
                          selectedAdicionais.some((a) => a.nome === addon.nome)
                            ? 'border-[#E30613] bg-red-50/50 dark:bg-red-900/10'
                            : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                          {/*
                            FIX CHECKBOX: mesmo padrão do radio.
                            Checkboxes nativos têm comportamento de redimensionamento
                            ainda mais agressivo em alguns motores WebKit mobile.
                            O InputWrapper + w-4 h-4 fixos no input isolam completamente.
                          */}
                          <InputWrapper>
                            <input
                              type="checkbox"
                              className="block w-4 h-4 rounded m-0 p-0 cursor-pointer accent-[#E30613]"
                              checked={selectedAdicionais.some((a) => a.nome === addon.nome)}
                              onChange={() => handleAdicionalToggle(addon)}
                            />
                          </InputWrapper>
                          <span className="text-[13px] md:text-sm text-slate-800 dark:text-zinc-200 font-semibold truncate min-w-0">
                            {addon.nome}
                          </span>
                        </div>
                        <span className="text-[13px] md:text-sm text-slate-600 dark:text-zinc-400 font-medium flex-none ml-2">
                          + {formatPrice(addon.preco)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── OBSERVAÇÃO ─── */}
              <div className="mb-2 w-full">
                <div className="flex items-center gap-2 mb-2">
                  {/* FIX: flex-none no ícone de observação */}
                  <MessageSquare size={16} className="text-slate-400 dark:text-zinc-500 flex-none" />
                  <label className="text-[13px] md:text-sm font-bold text-slate-800 dark:text-zinc-200 min-w-0">
                    Alguma observação?
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    maxLength={20}
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    placeholder="Ex: tirar cebola"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl outline-none focus:border-[#E30613] text-[13px] md:text-sm dark:text-white transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-zinc-500">
                    {observacao.length}/20
                  </span>
                </div>
              </div>
            </div>

            {/* ─── FOOTER: QUANTIDADE + BOTÃO ADICIONAR ─── */}
            <div className="w-full bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 p-3 md:p-4 pb-5 flex-none flex items-center justify-between gap-3 overflow-hidden">
              {/* FIX: flex-none no controle de quantidade — bloco rígido, nunca estica */}
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-800 rounded-full px-1.5 py-1 border border-slate-200 dark:border-zinc-700 flex-none">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex items-center justify-center text-[#E30613] dark:text-[#FFC700] hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-full transition-colors w-8 h-8 md:w-10 md:h-10 flex-none"
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold text-[15px] md:text-lg text-slate-900 dark:text-white w-4 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex items-center justify-center text-[#E30613] dark:text-[#FFC700] hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-full transition-colors w-8 h-8 md:w-10 md:h-10 flex-none"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/*
                FIX: flex-1 min-w-0 no botão de adicionar + overflow-hidden.
                O botão ocupa o espaço restante sem ultrapassar o container.
                truncate no <span> interno garante que o preço longo não vaze.
              */}
              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className={`flex-1 min-w-0 py-3 px-4 rounded-full font-bold text-[13px] md:text-base flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden ${
                  canAdd
                    ? 'bg-[#E30613] hover:bg-red-700 text-white shadow-md shadow-red-500/20 active:scale-[0.98]'
                    : 'bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed'
                }`}
              >
                {canAdd ? (
                  <span className="truncate">Adicionar · {formatPrice(totalPrice)}</span>
                ) : (
                  <span className="text-[12px] md:text-sm truncate">Selecione opções</span>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};