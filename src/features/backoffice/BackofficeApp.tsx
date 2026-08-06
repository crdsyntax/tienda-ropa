import { useState, useCallback, useEffect } from 'react';
import { Menu, X, Loader2 } from 'lucide-react';
import type { PromoSlide } from '../../types';
import type { BackofficeProduct, Order, Section } from './types';
import { NAV_ITEMS } from './constants';
import { MOCK_PRODUCTS } from './mockData';
import { useOrders } from '../../context/OrdersContext';
import { useMerchantPayment } from '../../context/MerchantPaymentContext';
import { ToastContainer } from './components';
import {
  DashboardSection,
  ProductsSection,
  InventorySection,
  OrdersSection,
  PromosSection,
  PaymentSection,
} from './sections';

const STORAGE_KEY = 'cottonshop_products';

function loadInitialProducts(): BackofficeProduct[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      /* ignore */
    }
  }
  return MOCK_PRODUCTS;
}

export function BackofficeApp() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [productsState, setProductsState] = useState<BackofficeProduct[]>([]);
  const { orders, updateOrderStatus } = useOrders();
  const { settings: payment, setSettings: setPayment } = useMerchantPayment();
  const [initialPromos, setInitialPromos] = useState<PromoSlide[]>([]);

  useEffect(() => {
    const local = loadInitialProducts();
    if (local !== MOCK_PRODUCTS) {
      setProductsState(local);
      setLoading(false);
      return;
    }
    fetch('/data/productos.json')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.products) {
          setProductsState(data.products);
        }
        if (data?.promos) {
          setInitialPromos(data.promos);
        }
      })
      .catch(() => setProductsState(MOCK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (productsState.length > 0 && productsState !== MOCK_PRODUCTS) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productsState));
    }
  }, [productsState]);

  const handleSaveProduct = useCallback((product: BackofficeProduct) => {
    setProductsState((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = product;
        return updated;
      }
      return [...prev, product];
    });
  }, []);

  const handleDeleteProduct = useCallback((id: string) => {
    setProductsState((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleUpdateStock = useCallback((id: string, newStock: number) => {
    setProductsState((prev) => prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
  }, []);

  const handleUpdateStatus = useCallback((orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  }, [updateOrderStatus]);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection products={productsState} orders={orders} />;
      case 'products':
        return <ProductsSection products={productsState} onSave={handleSaveProduct} onDelete={handleDeleteProduct} />;
      case 'inventory':
        return <InventorySection products={productsState} onUpdateStock={handleUpdateStock} />;
      case 'orders':
        return <OrdersSection orders={orders} onUpdateStatus={handleUpdateStatus} />;
      case 'promos':
        return <PromosSection initialPromos={initialPromos} />;
      case 'payment':
        return <PaymentSection payment={payment} onSave={setPayment} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <ToastContainer />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-slate-900 animate-spin" />
            <p className="text-sm text-slate-500">Cargando catálogo...</p>
          </div>
        </div>
      )}

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
          <Menu size={20} />
        </button>
        <span className="text-sm font-bold text-slate-900">CottonShop Admin</span>
        <div className="w-9" />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 animate-fade-in lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`h-full w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative fixed top-0 left-0 z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[10px] font-bold">CS</div>
            <span className="text-sm font-bold text-slate-900">CottonShop</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 lg:hidden cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                activeSection === item.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">A</div>
            <div>
              <p className="text-xs font-medium text-slate-700">Admin</p>
              <p className="text-[10px] text-slate-400">v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 h-full overflow-y-auto pt-14 lg:pt-0">
        <div className="p-8">
          {!loading && renderSection()}
        </div>
      </main>
    </div>
  );
}
