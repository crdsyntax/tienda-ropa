import { useProducts } from './features/products';
import { ProductGrid } from './features/products/components';
import { BannerCarousel } from './features/promos';
import { CartDrawer } from './features/cart';
import { Footer, Header } from './components/layout';
import { Button } from './components/ui';

function App() {
  const { products, loading, error, refetch } = useProducts();

  const scrollToProducts = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

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
