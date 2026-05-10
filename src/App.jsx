import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { MENU_DATA } from './data/menuData';

import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDrawer } from './components/ProductDrawer';
import { CartFAB, CartModal } from './components/Cart';

const CategoryNav = ({ activeCategory }) => {
  const navRef = useRef(null);

  // ✅ CORREÇÃO 1: Evita o bug de "voltar para cima". 
  // Agora rola apenas o menu horizontalmente, sem afetar a tela inteira.
  useEffect(() => {
    if (navRef.current && activeCategory) {
      const activeEl = navRef.current.querySelector(`[data-id="${activeCategory}"]`);
      if (activeEl) {
        const container = navRef.current;
        const scrollPos = activeEl.offsetLeft - (container.offsetWidth / 2) + (activeEl.offsetWidth / 2);
        container.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }
    }
  }, [activeCategory]);

  const handleCategoryClick = useCallback((catId) => {
    const el = document.getElementById(`section-${catId}`);
    if (el) {
      window.scrollTo({ 
        top: el.getBoundingClientRect().top + window.scrollY - 100, 
        behavior: 'smooth' 
      });
    }
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-slate-50/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 transition-colors w-full">
      <div ref={navRef} className="flex overflow-x-auto hide-scrollbar px-3 py-3 gap-2 md:px-4 md:gap-3">
        {MENU_DATA.categorias.map((cat) => (
          <button
            key={cat.id}
            data-id={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            // ✅ CORREÇÃO 2: A classe "shrink-0" impede o botão de encolher, segurando o texto dentro da caixa!
            className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-[13px] md:text-sm font-semibold transition-all ${
              activeCategory === cat.id 
                ? 'bg-[#E30613] text-white shadow-md' 
                : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700'
            }`}
          >
            {cat.titulo}
          </button>
        ))}
      </div>
    </div>
  );
};

const MainLayout = () => {
  const [activeCategory, setActiveCategory] = useState(MENU_DATA.categorias[0].id);
  const [selectedProductData, setSelectedProductData] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveCategory(entry.target.id.replace('section-', ''));
        });
      }, { root: null, rootMargin: '-20% 0px -75% 0px', threshold: 0 }
    );
    MENU_DATA.categorias.forEach(cat => {
      const el = document.getElementById(`section-${cat.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleExpand = useCallback((id) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleProductClick = useCallback((product, category) => {
    setSelectedProductData({ product, category });
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedProductData(null);
  }, []);

  return (
    // ✅ CORREÇÃO 3: Removido o "overflow-hidden" global que travava a rolagem do usuário para baixo.
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1B] text-slate-900 dark:text-white pb-32 transition-colors duration-300 font-sans selection:bg-[#E30613] selection:text-white flex flex-col w-full overflow-x-hidden">
      <Header />
      <CategoryNav activeCategory={activeCategory} />

      <main className="px-3 md:px-4 mt-5 max-w-3xl mx-auto space-y-10 flex-1 w-full overflow-x-hidden">
        {MENU_DATA.categorias.map(category => {
          const limit = category.id === 'hamburgueres' ? 4 : 5;
          const isExpanded = expandedCategories[category.id];
          const visibleItems = isExpanded ? category.itens : category.itens.slice(0, limit);
          const hasMore = category.itens.length > limit;

          return (
            <section key={category.id} id={`section-${category.id}`} className="scroll-mt-32 w-full">
              <div 
                onClick={() => hasMore && toggleExpand(category.id)}
                className={`flex items-center justify-between mb-1 gap-2 w-full ${hasMore ? 'cursor-pointer hover:opacity-80' : ''}`}
              >
                {/* Permite que títulos muito longos desçam uma linha suavemente se precisarem */}
                <h2 className="text-[18px] md:text-2xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1 flex-1 break-words whitespace-normal">
                  <span>{category.titulo}</span>
                  <ChevronRight size={18} className="text-[#E30613] shrink-0" />
                </h2>
                {hasMore && (
                  <div className="text-slate-400 dark:text-zinc-500 bg-slate-200 dark:bg-zinc-800 p-1.5 rounded-full shrink-0">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                )}
              </div>
              
              {category.descricao ? (
                <p className="text-[12px] md:text-sm text-slate-500 dark:text-zinc-400 mb-4">{category.descricao}</p>
              ) : <div className="h-3"></div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
                {visibleItems.map(product => (
                  <ProductCard 
                    key={`${category.id}-${product.nome}`}
                    product={product} 
                    category={category} 
                    onClick={handleProductClick}
                  />
                ))}
              </div>

              {hasMore && !isExpanded && (
                <button 
                  onClick={() => toggleExpand(category.id)}
                  className="w-full mt-3 py-2.5 border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-xl text-slate-600 dark:text-zinc-400 font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-[13px] md:text-sm"
                >
                  Ver mais +{category.itens.length - limit} opções
                </button>
              )}
            </section>
          );
        })}
      </main>

      <footer className="w-full text-center py-10 mt-8 opacity-80 z-10 relative">
        <p className="text-sm text-slate-500 dark:text-zinc-500">
          Powered by <strong className="text-slate-800 dark:text-zinc-300">GarotoDev</strong>
        </p>
      </footer>

      <ProductDrawer 
        isOpen={!!selectedProductData} 
        onClose={handleCloseDrawer}
        product={selectedProductData?.product} 
        category={selectedProductData?.category} 
      />
      <CartFAB />
      <CartModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </ThemeProvider>
  );
}
