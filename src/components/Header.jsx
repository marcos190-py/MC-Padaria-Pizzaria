import React from 'react';
import { Moon, Sun, Instagram } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MENU_DATA } from '../data/menuData';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="pt-8 pb-6 px-4 flex flex-col items-center justify-center relative bg-slate-50 dark:bg-zinc-900 transition-colors">
      <div className="absolute top-4 w-full px-4 flex justify-between items-center z-20">
        <a 
          href={MENU_DATA.estabelecimento.instagram} 
          target="_blank" 
          rel="noopener noreferrer" // ✅ FIX: Segurança para links externos
          aria-label="Instagram MC Padaria"
          className="p-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm text-pink-600 dark:text-pink-500 transition-all hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <Instagram size={20} />
        </a>
        <button 
          onClick={toggleTheme}
          aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
          className="p-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm text-zinc-600 dark:text-zinc-300 transition-all hover:scale-105 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
      
      <div className="relative mb-3 mt-4">
        {/* ✅ FIX: Imagem otimizada com dimensões e lazy loading */}
        <img 
          src="/logo.jpg" 
          alt="Logo MC Padaria & Pizzaria" 
          width="96"
          height="96"
          loading="eager" // Logo não precisa de lazy load
          className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-lg relative z-10" 
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#FFC700]/20 rounded-full blur-xl -z-0"></div>
      </div>
      
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        {MENU_DATA.estabelecimento.nome}
      </h1>
      <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Palmas, TO</p>
    </header>
  );
};