import { useMemo } from 'react';
import {
  DollarSign, Clock, PackageCheck, AlertTriangle,
  ShoppingCart, PackageOpen, CircleDot,
  ArrowUpRight, TrendingUp,
} from 'lucide-react';
import type { BackofficeProduct, Order } from '../types';
import { StatusBadge, EmptyState } from '../components';

interface DashboardProps {
  products: BackofficeProduct[];
  orders: Order[];
}

export function DashboardSection({ products, orders }: DashboardProps) {
  const metrics = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;

    const activeProducts = products.filter((p) => p.status === 'active').length;

    const lowStockAlerts = products.filter((p) => p.stock <= 5 && p.status === 'active').length;

    return { totalRevenue, pendingOrders, activeProducts, lowStockAlerts };
  }, [products, orders]);

  const kpiConfig = [
    { label: 'Ingresos Totales', value: `$${metrics.totalRevenue.toFixed(2)}`, icon: <DollarSign size={20} />, accent: 'from-emerald-500 to-emerald-600', iconBg: 'bg-emerald-100 text-emerald-600', trend: '+12%', trendUp: true },
    { label: 'Pedidos Pendientes', value: metrics.pendingOrders.toString(), icon: <Clock size={20} />, accent: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-100 text-amber-600', trend: null, trendUp: false },
    { label: 'Productos Activos', value: metrics.activeProducts.toString(), icon: <PackageCheck size={20} />, accent: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-100 text-blue-600', trend: null, trendUp: false },
    { label: 'Alertas Stock Bajo', value: metrics.lowStockAlerts.toString(), icon: <AlertTriangle size={20} />, accent: metrics.lowStockAlerts > 0 ? 'from-red-500 to-red-600' : 'from-slate-400 to-slate-500', iconBg: metrics.lowStockAlerts > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400', trend: null, trendUp: false },
  ];

  const latestOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), [orders]);

  const topProducts = useMemo(() => {
    const salesMap = new Map<string, { name: string; totalSold: number; revenue: number }>();
    orders.filter((o) => o.status !== 'cancelled').forEach((o) => {
      o.items.forEach((item) => {
        const existing = salesMap.get(item.productId);
        if (existing) {
          existing.totalSold += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          salesMap.set(item.productId, { name: item.productName, totalSold: item.quantity, revenue: item.price * item.quantity });
        }
      });
    });
    return Array.from(salesMap.values()).sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);
  }, [orders]);

  const maxSold = Math.max(...topProducts.map((x) => x.totalSold), 1);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 md:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Resumen general de la tienda</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-full self-start md:self-auto">
          <CircleDot size={12} className="text-emerald-500" />
          Actualizado en tiempo real
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiConfig.map((kpi) => (
          <div key={kpi.label} className="relative bg-white rounded-xl border border-slate-100 shadow-sm p-6 overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.accent}`} />
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${kpi.iconBg}`}>{kpi.icon}</div>
              {kpi.trend && (
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${kpi.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  <ArrowUpRight size={14} />
                  {kpi.trend}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-4">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            Últimos Pedidos
          </h2>
          {latestOrders.length === 0 ? (
            <EmptyState icon={<ShoppingCart size={32} />} message="No hay pedidos recientes" />
          ) : (
            <div className="space-y-1">
              {latestOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2.5 px-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-mono font-bold text-slate-500">
                      {o.id.slice(-3)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{o.customer}</p>
                      <p className="text-xs text-slate-400">{o.id}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className="text-sm font-semibold text-slate-900">${o.total.toFixed(2)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-full bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-slate-400" />
            Productos con Mayor Rotación
          </h2>
          {topProducts.length === 0 ? (
            <EmptyState icon={<PackageOpen size={32} />} message="No hay datos de ventas aún" />
          ) : (
            <div className="space-y-1">
              {topProducts.map((p, i) => {
                const barWidth = Math.max((p.totalSold / maxSold) * 100, 10);
                return (
                  <div key={p.name} className="py-2.5 px-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                          i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-amber-50 text-amber-600' : 'text-slate-400'
                        }`}>
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium text-slate-900">{p.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{p.totalSold} vend.</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden ml-8">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all" style={{ width: `${barWidth}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
