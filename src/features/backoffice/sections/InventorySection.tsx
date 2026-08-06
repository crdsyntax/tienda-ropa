import { useState, useCallback } from 'react';
import { Minus, Plus, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import type { BackofficeProduct } from '../types';
import { StockBar, notify } from '../components';
import { ProductImage } from '../../../components/ui/ProductImage';
import { exportRowsToExcel, type ExcelColumn } from '../../../services/excelExport';

interface InventorySectionProps {
  products: BackofficeProduct[];
  onUpdateStock: (id: string, newStock: number) => void;
}

export function InventorySection({ products, onUpdateStock }: InventorySectionProps) {
  const [editStockId, setEditStockId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);

  const startEdit = useCallback((product: BackofficeProduct) => {
    setEditStockId(product.id);
    setEditValue(product.stock);
  }, []);

  const commitEdit = useCallback((id: string) => {
    if (editValue >= 0) {
      onUpdateStock(id, editValue);
      notify('Stock actualizado correctamente');
    }
    setEditStockId(null);
  }, [editValue, onUpdateStock]);

  const criticalCount = products.filter((p) => p.stock <= 5 && p.status === 'active').length;

  const handleExport = useCallback(() => {
    const columns: ExcelColumn[] = [
      { header: 'ID', key: 'id' },
      { header: 'Producto', key: 'name' },
      { header: 'SKU', key: 'sku' },
      { header: 'Categoría', key: 'category' },
      { header: 'Stock', key: 'stock' },
      { header: 'Estado', key: 'status' },
    ];
    const rows = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      stock: p.stock,
      status: p.status,
    }));
    exportRowsToExcel(columns, rows, 'Inventario', `inventario-${Date.now()}.xlsx`);
    notify(`Exportados ${rows.length} productos a Excel`);
  }, [products]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Control de Inventario</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {criticalCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                <AlertTriangle size={14} />
                {criticalCount} producto{criticalCount !== 1 ? 's' : ''} con stock crítico
              </span>
            ) : 'Todos los productos tienen stock suficiente'}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={products.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet size={16} />
          Exportar Excel
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3.5">Producto</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Stock Actual</th>
                <th className="px-4 py-3.5 text-right">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p, idx) => (
                <tr key={p.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/40`}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <ProductImage src={p.images[0] || ''} alt={p.name} className="w-10 h-10 rounded-xl bg-slate-100 object-cover shrink-0 border border-slate-200" />
                      </div>
                      <span className="font-medium text-slate-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-500 font-mono text-xs rounded-md">{p.sku}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1 max-w-[120px]">
                      <div className="flex items-center gap-2">
                        {p.stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-200">
                            <AlertTriangle size={12} />
                            {p.stock}
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-900">{p.stock}</span>
                        )}
                        <span className="text-xs text-slate-400">uds.</span>
                      </div>
                      <StockBar stock={p.stock} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))}
                        disabled={p.stock <= 0}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>

                      {editStockId === p.id ? (
                        <input
                          type="number"
                          min={0}
                          value={editValue}
                          onChange={(e) => setEditValue(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-16 text-center text-sm font-semibold border-2 border-slate-300 rounded-xl py-1.5 focus:outline-none focus:border-slate-900"
                          autoFocus
                          onBlur={() => commitEdit(p.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(p.id); if (e.key === 'Escape') setEditStockId(null); }}
                        />
                      ) : (
                        <button
                          onClick={() => startEdit(p)}
                          className="min-w-[60px] px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer tabular-nums"
                        >
                          {p.stock}
                        </button>
                      )}

                      <button
                        onClick={() => onUpdateStock(p.id, p.stock + 1)}
                        className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
