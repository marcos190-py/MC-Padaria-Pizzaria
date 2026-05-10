import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { formatPrice, getIconForCategory } from '../data/menuData';

export const ProductCard = ({ product, category, onClick }) => {
  let displayPrice = product.preco;
  let isFromPrice = false;

  if (!displayPrice && category.precos_base) {
    displayPrice = category.precos_base['6ft'];
    isFromPrice = true;
  }

  const imageSource = product.imagem || category.fotoPadrao;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(product, category)}
      // FIX: overflow-hidden no card é a última barreira — nenhum filho vaza para fora
      className="bg-white dark:bg-zinc-800 rounded-2xl p-3 md:p-4 flex gap-3 md:gap-4 shadow-sm border border-slate-100 dark:border-zinc-700/50 cursor-pointer transition-colors overflow-hidden w-full"
    >
      {/*
        FIX: flex-none no container da imagem.
        - flex-none = flex-grow:0 + flex-shrink:0 + flex-basis:auto
        - Substitui shrink-0, que só prevenia encolhimento mas não crescimento nem
          esticamento no eixo cruzado (align-items:stretch do flex pai).
        - Dimensões explícitas w-20 h-20 tornam o bloco verdadeiramente rígido.
      */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-slate-50 dark:bg-zinc-900 flex items-center justify-center flex-none border border-slate-100 dark:border-zinc-800 overflow-hidden relative">
        {imageSource ? (
          <img
            src={imageSource}
            alt={product.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-slate-400 dark:text-zinc-500">
            {getIconForCategory(category.id, 'w-8 h-8 md:w-10 md:h-10 stroke-1')}
          </div>
        )}
      </div>

      {/*
        FIX: flex-1 min-w-0 neste container de texto é o par inseparável do flex-none acima.
        - flex-1: o container ocupa todo o espaço restante
        - min-w-0: SOBRESCREVE o min-width:auto padrão do flex item, permitindo que
          o container encolha abaixo do tamanho do seu conteúdo de texto.
          Sem isso, textos longos empurram este div para fora do card.
        - overflow-hidden: barreira de contenção interna do bloco de texto
      */}
      <div className="flex flex-col justify-center flex-1 min-w-0 overflow-hidden">
        {/*
          FIX: truncate funciona aqui porque o pai tem min-w-0 + overflow-hidden.
          A cadeia completa é: motion.div (overflow-hidden) → este div (flex-1 min-w-0) → h3 (truncate)
        */}
        <h3 className="text-[15px] md:text-base font-bold text-slate-900 dark:text-zinc-100 leading-tight truncate">
          {product.nome}
        </h3>

        {product.ingredientes && (
          /*
            FIX: break-words garante que palavras longas sem espaço (ex: "frango/catupiry/mussarela")
            quebrem dentro do container em vez de empurrar o layout.
            whitespace-normal é explícito para anular qualquer herança de whitespace-nowrap.
            overflow-hidden é redundante mas defensivo.
          */
          <p className="text-[11px] md:text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 break-words whitespace-normal overflow-hidden">
            {product.ingredientes}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-2 overflow-hidden">
          {/*
            FIX: min-w-0 no span do preço permite que ele encolha se necessário,
            cedendo espaço para o botão + ao lado. overflow-hidden contém o texto.
          */}
          <span className="font-bold text-[14px] md:text-base text-[#E30613] dark:text-[#FFC700] min-w-0 overflow-hidden">
            {isFromPrice && (
              <span className="text-[10px] md:text-xs font-normal text-slate-500 dark:text-zinc-400 mr-1">
                A partir de
              </span>
            )}
            {formatPrice(displayPrice)}
          </span>

          {/*
            FIX: flex-none no botão + garante que ele NUNCA seja esticado ou encolhido
            pelo flex pai, mesmo que o texto do preço ao lado seja longo.
            Dimensões explícitas w-7 h-7 tornam o círculo imune a distorções.
          */}
          <div className="w-7 h-7 md:w-8 md:h-8 flex-none rounded-full bg-slate-50 dark:bg-zinc-700 flex items-center justify-center text-[#E30613] dark:text-[#FFC700]">
            <Plus size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};