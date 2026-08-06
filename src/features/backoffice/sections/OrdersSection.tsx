import { useState, useMemo, useCallback } from 'react';
import { Search, X, Store, FileSpreadsheet, ChevronDown } from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { Modal, StatusBadge, EmptyState, OrderTimeline, notify } from '../components';
import { exportRowsToExcel, type ExcelColumn } from '../../../services/excelExport';

interface OrdersSectionProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void;
}

const STATUS_FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'shipped', label: 'Enviados' },
  { value: 'delivered', label: 'Entregados' },
  { value: 'cancelled', label: 'Cancelados' },
];

export function OrdersSection({ orders, onUpdateStatus }: OrdersSectionProps) {
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));
    }
    return result;
  }, [orders, search, statusFilter]);

  const handleExport = useCallback(() => {
    const columns: ExcelColumn[] = [
      { header: 'ID', key: 'id' },
      { header: 'Cliente', key: 'customer' },
      { header: 'Email', key: 'customerEmail' },
      { header: 'Teléfono', key: 'customerPhone' },
      { header: 'Fecha', key: 'date' },
      { header: 'Estado', key: 'status' },
      { header: 'Método de Pago', key: 'paymentMethod' },
      { header: 'Total', key: 'total' },
      { header: 'Dirección', key: 'address' },
      { header: 'Artículos', key: 'itemsSummary' },
    ];
    const rows = filtered.map((o) => ({
      id: o.id,
      customer: o.customer,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      date: new Date(o.date).toLocaleDateString('es-MX'),
      status: o.status,
      paymentMethod: o.paymentMethod,
      total: o.total,
      address: o.address,
      itemsSummary: o.items.map((i) => `${i.productName} (${i.size}) x${i.quantity}`).join('; '),
    }));
    const label = statusFilter === 'all' ? 'todos' : statusFilter;
    exportRowsToExcel(columns, rows, 'Pedidos', `pedidos-${label}-${Date.now()}.xlsx`);
    notify(`Exportados ${rows.length} pedidos a Excel`);
  }, [filtered, statusFilter]);

  const statusFlow = useCallback((current: Order['status']): Order['status'][] => {
    const flow: Order['status'][] = [];
    if (current === 'pending') flow.push('shipped', 'cancelled');
    if (current === 'shipped') flow.push('delivered', 'cancelled');
    return flow;
  }, []);

  const handleStatusChange = useCallback((orderId: string, newStatus: Order['status']) => {
    onUpdateStatus(orderId, newStatus);
    const label: Record<Order['status'], string> = { pending: 'pendiente', shipped: 'enviado', delivered: 'entregado', cancelled: 'cancelado' };
    notify(`Pedido ${orderId} marcado como ${label[newStatus]}`, newStatus === 'cancelled' ? 'error' : 'success');
    setDetailOrder((prev) => prev ? { ...prev, status: newStatus } : null);
  }, [onUpdateStatus]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ventas y Pedidos</h1>
          <p className="text-sm text-slate-500 mt-0.5">{orders.length} pedidos registrados</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por ID o cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="w-full sm:w-40 pl-4 pr-9 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 appearance-none cursor-pointer"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={16} />
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3.5">ID</th>
                <th className="px-4 py-3.5">Cliente</th>
                <th className="px-4 py-3.5">Fecha</th>
                <th className="px-4 py-3.5">Total</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-4 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o, idx) => (
                <tr key={o.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/40 cursor-pointer`} onClick={() => setDetailOrder(o)}>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 font-mono text-xs font-semibold rounded-md">{o.id}</span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">{o.customer}</td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {new Date(o.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3.5 text-right">
                    <button onClick={(e) => { e.stopPropagation(); setDetailOrder(o); }} className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <EmptyState icon={<Search size={32} />} message={search ? `Sin resultados para "${search}"` : 'No hay pedidos registrados'} />
          )}
        </div>
      </div>

      <Modal isOpen={!!detailOrder} onClose={() => setDetailOrder(null)} title={`Pedido ${detailOrder?.id || ''}`} size="lg">
        {detailOrder && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Estado del Pedido</h3>
              <OrderTimeline current={detailOrder.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Store size={14} />
                  Datos del Cliente
                </h3>
                <p className="text-sm font-semibold text-slate-900">{detailOrder.customer}</p>
                <p className="text-sm text-slate-500 mt-0.5">{detailOrder.customerEmail}</p>
                <p className="text-sm text-slate-500">{detailOrder.customerPhone}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Método de Pago</h3>
                <p className="text-sm font-semibold text-slate-900">{detailOrder.paymentMethod}</p>
                {detailOrder.payment && Object.keys(detailOrder.payment.userData).length > 0 && (
                  <dl className="mt-3 space-y-1.5 text-xs">
                    {Object.entries(detailOrder.payment.userData).map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-2">
                        <dt className="text-slate-400 capitalize">{key}</dt>
                        <dd className="font-medium text-slate-700 text-right">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <p className="text-xs text-slate-400 mt-2">Total: <span className="font-semibold text-slate-900 text-sm">${detailOrder.total.toFixed(2)}</span></p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Dirección de Envío</h3>
              <p className="text-sm text-slate-700">{detailOrder.address}</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Artículos <span className="text-slate-400 font-normal">({detailOrder.items.length})</span>
              </h3>
              <div className="space-y-2.5">
                {detailOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-3 hover:shadow-sm transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.productName}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-slate-500">Talla: <strong>{item.size}</strong></span>
                        <span className="text-xs text-slate-400">|</span>
                        <span className="text-xs text-slate-500">Cant: <strong>{item.quantity}</strong></span>
                        <span className="text-xs text-slate-400">|</span>
                        <span className="text-xs text-slate-500">${item.price.toFixed(2)} c/u</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Estado actual:</span>
                <StatusBadge status={detailOrder.status} />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {statusFlow(detailOrder.status).map((nextStatus) => (
                  <button
                    key={nextStatus}
                    onClick={() => handleStatusChange(detailOrder.id, nextStatus)}
                    className={`flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium rounded-xl transition-all active:scale-[0.98] cursor-pointer ${
                      nextStatus === 'cancelled'
                        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                    }`}
                  >
                    {nextStatus === 'shipped' ? 'Marcar Enviado' : nextStatus === 'delivered' ? 'Marcar Entregado' : 'Cancelar'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
