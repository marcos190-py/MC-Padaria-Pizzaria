import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Trash2, Info, Bike, Store, CreditCard, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice, MENU_DATA } from '../data/menuData';

export const CartFAB = () => {
  const { itemCount, cartTotal, setIsCartOpen } = useCart();
  
  if (itemCount === 0) return null;
  
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1, scale: [1, 1.05, 1] }} 
      transition={{ type: 'spring', stiffness: 300, damping: 20 }} 
      className="fixed bottom-6 left-0 w-full px-4 z-30"
    >
      <button 
        onClick={() => setIsCartOpen(true)} 
        className="w-full bg-[#E30613] text-white rounded-2xl p-4 flex items-center justify-between shadow-xl shadow-red-900/20 active:scale-[0.98] transition-transform min-h-[56px]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-[#FFC700] text-slate-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {itemCount}
            </span>
          </div>
          <span className="font-medium">Ver carrinho</span>
        </div>
        <span className="font-bold">{formatPrice(cartTotal)}</span>
      </button>
    </motion.div>
  );
};

export const CartModal = () => {
  const { cartItems, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const [deliveryType, setDeliveryOption] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [error, setError] = useState('');

  if (!isCartOpen) return null;

  // ✅ FIX: Função de sanitização para prevenir injeção
  const sanitizeText = (text) => {
    if (!text) return '';
    return text
      .replace(/[<>]/g, '') // Remove < e >
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove caracteres de controle
      .trim()
      .substring(0, 200); // Limite de segurança
  };

  const handleCheckout = () => {
    if (!deliveryType) { 
      setError('Selecione se é para entrega ou retirada.'); 
      return; 
    }
    if (!paymentMethod) { 
      setError('Selecione a forma de pagamento.'); 
      return; 
    }
    setError('');

    let text = `🍕 *NOVO PEDIDO - ${MENU_DATA.estabelecimento.nome}*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    cartItems.forEach(item => {
      // ✅ FIX: Sanitizar todos os textos antes de enviar
      const nomeProduto = sanitizeText(item.productName);
      const obs = sanitizeText(item.observacao);
      
      text += `🛒 *${item.quantity}x ${nomeProduto}*${item.size ? ` (${item.size === '6ft' ? 'Pequena' : 'Grande'})` : ''}\n`;
      
      if (item.addons.length > 0) {
        const addonsText = item.addons.map(a => sanitizeText(a.nome)).join(', ');
        text += `   ↳ _${addonsText}_\n`;
      }
      
      if (obs) text += `   ↳ *Obs:* ${obs}\n`;
      text += `   *Valor:* ${formatPrice(item.totalPrice)}\n\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📍 *TIPO:* ${deliveryType === 'delivery' ? 'Entrega (🛵)' : 'Retirada no Local (🏪)'}\n`;
    text += `💳 *PAGAMENTO:* ${paymentMethod.toUpperCase()}\n`;
    text += `💰 *TOTAL:* ${formatPrice(cartTotal)}\n\n`;

    if (deliveryType === 'delivery') {
      text += `⚠️ *IMPORTANTE:* Vou enviar minha localização atual abaixo para facilitar a entrega! 👇`;
    } else {
      text += `👍 Já realizei o pedido, aguardo a previsão para retirar!`;
    }

    // ✅ FIX: Codificação mais robusta
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${MENU_DATA.estabelecimento.whatsapp}?text=${encodedText}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/60 z-50 flex justify-end"
        style={{ backdropFilter: 'blur(4px)' }} // ✅ FIX: Blur reduzido para performance
      >
        <motion.div 
          initial={{ x: '100%' }} 
          animate={{ x: 0 }} 
          exit={{ x: '100%' }} 
          transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-slate-50 dark:bg-zinc-900 h-full flex flex-col shadow-2xl overscroll-contain"
          style={{ overscrollBehavior: 'contain' }} // ✅ FIX: Prevenir scroll do body no iOS
        >
          
          <div className="flex items-center justify-between p-5 bg-white dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="text-[#E30613]" /> Seu Pedido
            </h2>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="p-2 bg-slate-100 dark:bg-zinc-700 rounded-full text-slate-500 dark:text-zinc-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar overscroll-contain">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500">
                <ShoppingBag size={48} className="mb-4 opacity-50" />
                <p>Seu carrinho está vazio</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-slate-100 dark:border-zinc-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 dark:text-zinc-100 break-words">
                            {item.quantity}x {item.productName}
                          </h4>
                          {item.size && (
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                              Tamanho: {item.size === '6ft' ? 'Pequena' : 'Grande'}
                            </p>
                          )}
                          {item.addons.length > 0 && (
                            <p className="text-[10px] text-slate-500 dark:text-zinc-500 break-words">
                              + {item.addons.map(a => a.nome).join(', ')}
                            </p>
                          )}
                          {item.observacao && (
                            <p className="text-xs font-semibold text-[#E30613] mt-1 italic break-words">
                              Obs: {item.observacao}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-3 ml-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatPrice(item.totalPrice)}
                          </span>
                          <button 
                            onClick={() => removeFromCart(item.cartId)} 
                            className="text-slate-400 hover:text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-slate-100 dark:border-zinc-700 space-y-6">
                  <div>
                    <label className="text-sm font-bold text-slate-800 dark:text-zinc-200 block mb-3">
                      É para entrega?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setDeliveryOption('delivery')} 
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-h-[60px] ${
                          deliveryType === 'delivery' 
                            ? 'border-[#E30613] bg-red-50 dark:bg-red-900/10' 
                            : 'border-slate-100 dark:border-zinc-700 dark:bg-zinc-900'
                        }`}
                      >
                        <Bike size={20} className={deliveryType === 'delivery' ? 'text-[#E30613]' : 'text-slate-400'} />
                        <span className={`text-xs font-bold ${deliveryType === 'delivery' ? 'text-[#E30613]' : 'text-slate-500'}`}>
                          SIM, ENTREGA
                        </span>
                      </button>
                      <button 
                        onClick={() => setDeliveryOption('pickup')} 
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all min-h-[60px] ${
                          deliveryType === 'pickup' 
                            ? 'border-[#E30613] bg-red-50 dark:bg-red-900/10' 
                            : 'border-slate-100 dark:border-zinc-700 dark:bg-zinc-900'
                        }`}
                      >
                        <Store size={20} className={deliveryType === 'pickup' ? 'text-[#E30613]' : 'text-slate-400'} />
                        <span className={`text-xs font-bold ${deliveryType === 'pickup' ? 'text-[#E30613]' : 'text-slate-500'}`}>
                          NÃO, RETIRO
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-800 dark:text-zinc-200 block mb-3 flex items-center gap-2">
                      <CreditCard size={18} /> Forma de Pagamento
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Pix', 'Dinheiro', 'Débito', 'Crédito'].map((method) => (
                        <button 
                          key={method} 
                          onClick={() => setPaymentMethod(method.toLowerCase())} 
                          className={`p-2.5 rounded-xl border-2 text-[10px] font-bold transition-all min-h-[44px] ${
                            paymentMethod === method.toLowerCase() 
                              ? 'border-[#FFC700] bg-yellow-50 dark:bg-yellow-900/10 text-slate-900 dark:text-white' 
                              : 'border-slate-100 dark:border-zinc-700 dark:bg-zinc-900 text-slate-500'
                          }`}
                        >
                          {method.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="bg-white dark:bg-zinc-800 border-t border-slate-200 dark:border-zinc-700 p-5 pb-8 space-y-4 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)]">
              {deliveryType === 'delivery' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-2">
                  <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-800 dark:text-blue-300 font-medium">
                    Após finalizar, lembre-se de enviar sua localização atual no WhatsApp.
                  </p>
                </div>
              )}
              {error && (
                <p className="text-red-500 text-xs font-bold flex items-center gap-1">
                  <AlertCircle size={14}/> {error}
                </p>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 dark:text-zinc-400 font-bold">Total do Pedido</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <button 
                onClick={handleCheckout} 
                className="w-full bg-[#25D366] hover:bg-[#1ebd5c] text-white py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-[0.98] min-h-[56px]"
              >
                Finalizar Pedido
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
