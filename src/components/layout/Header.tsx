import { useState, useCallback, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { usePWA } from '../../hooks';
import { Button } from '../ui';
import sinfondo from '../../assets/sinfondo.svg';

const CATEGORIES = [
  'Camisetas',
  'Pantalones',
  'Chaquetas',
  'Vestidos',
  'Sudaderas',
  'Shorts',
];

export function Header() {
  const { totalItems, openCart } = useCart();
  const { isInstallable, install } = usePWA();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1: Logo + Search */}
        <div className="flex items-center gap-4 h-16">
          <a href="/" className="flex flex-col items-center shrink-0">
            <img src={sinfondo} alt="TiendaRopa" className="w-12 h-12 object-cover" style={{ borderRadius: '100%' }} />
            <span className="text-[10px] font-bold text-slate-900 leading-none hidden sm:block">TiendaRopa</span>
          </a>

          <div className="flex-1 max-w-2xl hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos, marcas y más..."
                className="w-full h-10 pl-4 pr-12 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
              <button className="absolute right-0 top-0 h-full px-3 bg-slate-900 text-white rounded-r-lg hover:bg-slate-800 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {isInstallable && (
              <Button variant="ghost" size="sm" onClick={install} className="hidden md:flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Instalar
              </Button>
            )}

            <button
              onClick={openCart}
              className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors sm:hidden cursor-pointer"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Row 1 Mobile: Search */}
        <div className="block sm:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos, marcas y más..."
              className="w-full h-10 pl-4 pr-12 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            />
            <button className="absolute right-0 top-0 h-full px-3 bg-slate-900 text-white rounded-r-lg hover:bg-slate-800 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2: Nav + User */}
        <div className="hidden sm:flex items-center justify-between h-10 border-t border-slate-100">
          <nav className="flex items-center gap-1 text-sm">
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setCategoriesOpen((prev) => !prev)}
                className="flex items-center gap-1 px-3 py-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium cursor-pointer"
              >
                Categorías
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="#" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Historial</a>
            <a href="#" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Tiendas oficiales</a>

            <a href="#" className="relative px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
              Ofertas
              <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded leading-none">
                NUEVO
              </span>
            </a>

            <a href="#" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Vender</a>
            <a href="#" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Ayuda</a>
          </nav>

          <nav className="flex items-center gap-1 text-sm">
            <a href="#" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Crea tu cuenta</a>
            <a href="#" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors font-medium">Ingresa</a>
            <a href="#" className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Mis compras</a>
          </nav>
        </div>

        {/* Row 2 Mobile: scroll horizontal */}
        <div className="flex sm:hidden overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide border-t border-slate-100 pt-2">
          <button
            onClick={() => setCategoriesOpen((prev) => !prev)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-full whitespace-nowrap shrink-0 cursor-pointer"
          >
            Categorías
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <a href="#" className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-full whitespace-nowrap shrink-0">Historial</a>
          <a href="#" className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-full whitespace-nowrap shrink-0">Tiendas</a>
          <a href="#" className="relative px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-full whitespace-nowrap shrink-0 font-medium">
            Ofertas
            <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[9px] font-bold px-1 rounded leading-none">NUEVO</span>
          </a>
          <a href="#" className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-full whitespace-nowrap shrink-0">Vender</a>
          <a href="#" className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-full whitespace-nowrap shrink-0">Ayuda</a>
          <a href="#" className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-full whitespace-nowrap shrink-0">Crea tu cuenta</a>
          <a href="#" className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-full whitespace-nowrap shrink-0 font-medium">Ingresa</a>
          <a href="#" className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-full whitespace-nowrap shrink-0">Mis compras</a>
        </div>

        {/* Mobile categories dropdown */}
        {categoriesOpen && (
          <div className="block sm:hidden border-t border-slate-100 py-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
