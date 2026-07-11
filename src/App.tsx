import { useProducts } from './features/products';
import { ProductGrid } from './features/products/components';
import { BannerCarousel } from './features/promos';
import { CartDrawer } from './features/cart';
import { Footer } from './components/layout';
import { useCart } from './context/CartContext';
import { usePWA } from './hooks';
import { Button } from './components/ui';
import logoPrincipal from './assets/logoPrincipal.png';

function App() {
  const { products, loading, error, refetch } = useProducts();
  const { totalItems, openCart } = useCart();
  const { isInstallable, install } = usePWA();

  const scrollToProducts = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <img src={logoPrincipal} alt="TiendaRopa" className="h-9 w-auto" />

            <div className="flex items-center gap-3">
              {isInstallable && (
                <Button variant="ghost" size="sm" onClick={install}>
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
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none min-w-[18px]">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BannerCarousel onCtaClick={scrollToProducts} />

        <div id="catalogo" className="mb-6 scroll-mt-20">
          <h2 className="text-2xl font-bold text-slate-900">Catálogo</h2>
          <p className="text-slate-500 mt-1">Descubre nuestra última colección</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
            <p className="text-slate-400">Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="secondary" onClick={refetch}>
              Reintentar
            </Button>
          </div>
        )}

        {!loading && !error && <ProductGrid products={products} />}
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}

export default App;
