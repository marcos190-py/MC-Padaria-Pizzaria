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

  useEffect(() => {
    if (navRef.current && activeCategory) {
      const activeEl = navRef.current.querySelector(`[data-id="${activeCategory}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  const handleCategoryClick = useCallback((catId) => {
    const el = document.getElementById(`section-${catId}`);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 100,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    // FIX: overflow-x-hidden no wrapper externo bloqueia vazamento lateral
    <div className="sticky top-0 z-30 bg-slate-50/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 transition-colors w-full overflow-x-hidden">
      <div
        ref={navRef}
        className="flex overflow-x-auto hide-scrollbar px-3 py-2 gap-2 md:px-4 md:py-3 md:gap-3"
      >
        {MENU_DATA.categorias.map((cat) => (
          <button
            key={cat.id}
            data-id={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[12px] md:text-sm font-semibold transition-all ${
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActiveCategory(entry.target.id.replace('section-', ''));
        });
      },
      { root: null, rootMargin: '-20% 0px -75% 0px', threshold: 0 }
    );
    MENU_DATA.categorias.forEach((cat) => {
      const el = document.getElementById(`section-${cat.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleExpand = useCallback((id) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleProductClick = useCallback((product, category) => {
    setSelectedProductData({ product, category });
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedProductData(null);
  }, []);

  return (
    // FIX RAIZ: overflow-x-hidden (não apenas overflow-hidden) garante que nenhum filho
    // expanda além de 100vw, sem cortar o scroll vertical natural da página.
    // w-full + max-w-full fecham os dois vetores de vazamento.
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1B] text-slate-900 dark:text-white pb-32 transition-colors duration-300 font-sans selection:bg-[#E30613] selection:text-white flex flex-col w-full max-w-full overflow-x-hidden">
      <Header />
      <CategoryNav activeCategory={activeCategory} />

      {/* FIX: overflow-x-hidden na <main> cria uma segunda barreira de contenção */}
      <main className="px-3 md:px-4 mt-5 max-w-3xl mx-auto space-y-10 flex-1 w-full overflow-x-hidden">
        {MENU_DATA.categorias.map((category) => {
          const limit = category.id === 'hamburgueres' ? 4 : 5;
          const isExpanded = expandedCategories[category.id];
          const visibleItems = isExpanded ? category.itens : category.itens.slice(0, limit);
          const hasMore = category.itens.length > limit;

          return (
            <section
              key={category.id}
              id={`section-${category.id}`}
              // FIX: w-full + overflow-hidden na section impede que o grid interno vaze
              className="scroll-mt-32 w-full overflow-hidden"
            >
              <div
                onClick={() => hasMore && toggleExpand(category.id)}
                // FIX: overflow-hidden aqui garante que o h2 interno não vaze neste container
                className={`flex items-center justify-between mb-1 gap-2 w-full overflow-hidden ${
                  hasMore ? 'cursor-pointer hover:opacity-80' : ''
                }`}
              >
                {/*
                  FIX CRÍTICO DO TÍTULO:
                  - O h2 tem flex-1 min-w-0: permite encolher dentro do flex pai
                  - O <span> com truncate TAMBÉM precisa de min-w-0 e overflow-hidden,
                    pois ele é um flex item do h2 (que é display:flex).
                    Sem min-w-0 no próprio span, o truncate não funciona porque
                    o min-width:auto do flex item impede o overflow-hidden de agir.
                */}
                <h2 className="text-[17px] md:text-2xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
                  <span className="truncate min-w-0 overflow-hidden">{category.titulo}</span>
                  {/* FIX: flex-none substitui shrink-0 — previne crescimento E encolhimento */}
                  <ChevronRight size={18} className="text-[#E30613] flex-none" />
                </h2>
                {hasMore && (
                  // FIX: flex-none impede que este botão seja esticado pelo flex pai
                  <div className="text-slate-400 dark:text-zinc-500 bg-slate-200 dark:bg-zinc-800 p-1.5 rounded-full flex-none">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                )}
              </div>

              {category.descricao ? (
                // FIX: break-words + overflow-hidden na descrição da categoria
                <p className="text-[12px] md:text-sm text-slate-500 dark:text-zinc-400 mb-4 line-clamp-2 break-words overflow-hidden">
                  {category.descricao}
                </p>
              ) : (
                <div className="h-3"></div>
              )}

              {/* FIX: overflow-hidden no grid garante que cards não vazem */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full overflow-hidden">
                {visibleItems.map((product) => (
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