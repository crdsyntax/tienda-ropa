import { useState, useMemo, useCallback, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, X, ChevronDown, Upload, FileSpreadsheet } from 'lucide-react';
import type { BackofficeProduct } from '../types';
import { SIZES, CATEGORIES } from '../constants';
import { Modal, StatusBadge, StockBar, EmptyState, notify } from '../components';
import { imageStore, isIdbUrl } from '../../../services/imageStore';
import { ProductImage } from '../../../components/ui/ProductImage';
import { exportRowsToExcel, type ExcelColumn } from '../../../services/excelExport';

interface ProductsSectionProps {
  products: BackofficeProduct[];
  onSave: (product: BackofficeProduct) => void;
  onDelete: (id: string) => void;
}

const EMPTY_FORM: BackofficeProduct = {
  id: '', name: '', sku: '', description: '', price: 0, originalPrice: null, currency: 'USD', stock: 0, category: CATEGORIES[0], status: 'active', images: [], brand: '', sizes: [], colors: [],
};

export function ProductsSection({ products, onSave, onDelete }: ProductsSectionProps) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BackofficeProduct | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<BackofficeProduct>(EMPTY_FORM);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }, [products, search]);

  const openCreate = useCallback(() => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((product: BackofficeProduct) => {
    setEditingProduct(product);
    setForm({ ...product });
    setErrors({});
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!form.sku.trim()) newErrors.sku = 'El SKU es obligatorio';
    if (form.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const product: BackofficeProduct = {
      ...form,
      id: editingProduct ? editingProduct.id : `p${Date.now()}`,
    };
    onSave(product);
    notify(editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
    setModalOpen(false);
  }, [form, editingProduct, onSave]);

  const handleDelete = useCallback((id: string, name: string) => {
    if (window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      onDelete(id);
      notify(`"${name}" eliminado correctamente`, 'error');
    }
  }, [onDelete]);

  const toggleSize = useCallback((size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
    }));
  }, []);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const id = `img_${Date.now()}_${file.name}`;
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    await imageStore.save(id, blob);

    setForm((prev) => ({ ...prev, images: [...prev.images, `idb://${id}`] }));
    notify(`Imagen "${file.name}" agregada`);

    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const removeImage = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleExport = useCallback(() => {
    const columns: ExcelColumn[] = [
      { header: 'ID', key: 'id' },
      { header: 'Nombre', key: 'name' },
      { header: 'SKU', key: 'sku' },
      { header: 'Categoría', key: 'category' },
      { header: 'Marca', key: 'brand' },
      { header: 'Precio', key: 'price' },
      { header: 'Precio Original', key: 'originalPrice' },
      { header: 'Stock', key: 'stock' },
      { header: 'Estado', key: 'status' },
      { header: 'Tallas', key: 'sizes' },
      { header: 'Colores', key: 'colors' },
    ];
    const rows = filtered.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      brand: p.brand,
      price: p.price,
      originalPrice: p.originalPrice ?? '',
      stock: p.stock,
      status: p.status,
      sizes: p.sizes.join(', '),
      colors: p.colors.join(', '),
    }));
    exportRowsToExcel(columns, rows, 'Productos', `productos-${Date.now()}.xlsx`);
    notify(`Exportados ${rows.length} productos a Excel`);
  }, [filtered]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} productos registrados</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={16} />
            Exportar Excel
          </button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer shadow-sm">
            <Plus size={16} />
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3.5">Producto</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Precio</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Categoría</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p, idx) => (
                <tr key={p.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/40`}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <ProductImage src={p.images[0] || ''} className="w-10 h-10 rounded-xl bg-slate-100 object-cover shrink-0 border border-slate-200" alt={p.name} />
                      <div>
                        <span className="font-medium text-slate-900">{p.name}</span>
                        <p className="text-xs text-slate-400">{p.sizes.join(', ') || 'Sin tallas'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-500 font-mono text-xs rounded-md">{p.sku}</span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-0.5 max-w-[80px]">
                      <span className={`font-medium ${p.stock <= 5 ? 'text-red-500' : 'text-slate-700'}`}>{p.stock} uds.</span>
                      <StockBar stock={p.stock} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-slate-500">{p.category}</span>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer" title="Editar">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" title="Eliminar">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <EmptyState icon={<Search size={32} />} message={search ? `Sin resultados para "${search}"` : 'No hay productos registrados'} />
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Nombre</label>
              <input
                type="text" value={form.name}
                onChange={(e) => { setForm((prev) => ({ ...prev, name: e.target.value })); setErrors((prev) => ({ ...prev, name: '' })); }}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                placeholder="Nombre del producto"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">SKU</label>
              <input
                type="text" value={form.sku}
                onChange={(e) => { setForm((prev) => ({ ...prev, sku: e.target.value })); setErrors((prev) => ({ ...prev, sku: '' })); }}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors ${errors.sku ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                placeholder="Ej: CAM-001"
              />
              {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Precio ($)</label>
              <input
                type="number" min={0} step="0.01" value={form.price}
                onChange={(e) => { setForm((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 })); setErrors((prev) => ({ ...prev, price: '' })); }}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-colors ${errors.price ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Stock Inicial</label>
              <input type="number" min={0} value={form.stock} onChange={(e) => setForm((prev) => ({ ...prev, stock: parseInt(e.target.value) || 0 }))} className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Categoría</label>
              <div className="relative">
                <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent appearance-none bg-white">
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Estado</label>
              <div className="relative">
                <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as 'active' | 'draft' }))} className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent appearance-none bg-white">
                  <option value="active">Activo</option>
                  <option value="draft">Borrador</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">URL o Subir Imagen</label>
            <div className="flex gap-2">
              <input
                type="text" value={form.images[0] || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, images: [e.target.value, ...prev.images.slice(1)] }))}
                className="flex-1 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                placeholder="https://... o idb://..."
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
              >
                <Upload size={16} />
                Subir
              </button>
            </div>
          </div>

          {form.images.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Imágenes ({form.images.length})</label>
              <div className="flex flex-wrap gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <ProductImage src={img} alt={`Imagen ${i + 1}`} className="w-20 h-20 rounded-xl border border-slate-200 object-cover bg-slate-50" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                    {isIdbUrl(img) && (
                      <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/60 text-white text-[8px] rounded font-medium">LOCAL</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none" placeholder="Descripción del producto" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Tallas Disponibles</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                    form.sizes.includes(size)
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:shadow-sm'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              Cancelar
            </button>
            <button onClick={handleSave} className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer shadow-sm">
              {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
