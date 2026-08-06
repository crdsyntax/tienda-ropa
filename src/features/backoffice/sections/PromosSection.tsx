import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Plus, ChevronDown } from 'lucide-react';
import type { PromoSlide } from '../../../types';
import { imageStore } from '../../../services/imageStore';
import { ProductImage } from '../../../components/ui/ProductImage';
import { Modal, notify } from '../components';

const PROMOS_STORAGE_KEY = 'cottonshop_promos';

const BG_COLORS = [
  { value: 'from-rose-500 to-pink-600', label: 'Rosa' },
  { value: 'from-violet-500 to-purple-700', label: 'Púrpura' },
  { value: 'from-emerald-500 to-teal-600', label: 'Verde' },
  { value: 'from-amber-500 to-orange-600', label: 'Ámbar' },
  { value: 'from-blue-500 to-indigo-600', label: 'Azul' },
  { value: 'from-slate-700 to-slate-900', label: 'Oscuro' },
  { value: 'from-red-500 to-red-600', label: 'Rojo' },
  { value: 'from-cyan-500 to-blue-500', label: 'Cian' },
];

const ACCENT_COLORS = [
  { value: 'bg-white text-rose-600', label: 'Blanco/Rosa' },
  { value: 'bg-white text-violet-600', label: 'Blanco/Púrpura' },
  { value: 'bg-white text-emerald-600', label: 'Blanco/Verde' },
  { value: 'bg-white text-amber-600', label: 'Blanco/Ámbar' },
  { value: 'bg-white text-slate-900', label: 'Blanco/Negro' },
  { value: 'bg-slate-900 text-white', label: 'Negro/Blanco' },
];

const DEFAULT_BG = 'from-rose-500 to-pink-600';
const DEFAULT_ACCENT = 'bg-white text-rose-600';

function loadPromos(): PromoSlide[] {
  try {
    const stored = localStorage.getItem(PROMOS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

interface PromosSectionProps {
  initialPromos: PromoSlide[];
}

export function PromosSection({ initialPromos }: PromosSectionProps) {
  const [promos, setPromos] = useState<PromoSlide[]>(() => loadPromos().length > 0 ? loadPromos() : initialPromos);
  const [editing, setEditing] = useState<PromoSlide | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(PROMOS_STORAGE_KEY, JSON.stringify(promos));
  }, [promos]);

  const openEdit = useCallback((promo: PromoSlide) => {
    setEditing({ ...promo });
    setModalOpen(true);
  }, []);

  const openNew = useCallback(() => {
    setEditing({ id: `promo_${Date.now()}`, title: '', subtitle: '', imageUrl: '', bgColor: DEFAULT_BG, accentColor: DEFAULT_ACCENT, ctaText: 'Ver ofertas' });
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!editing || !editing.title.trim()) return;
    setPromos((prev) => {
      const idx = prev.findIndex((p) => p.id === editing.id);
      const isUpdate = idx >= 0;
      if (isUpdate) {
        const updated = [...prev];
        updated[idx] = editing;
        return updated;
      }
      return [...prev, editing];
    });
    notify('Banner guardado');
    setModalOpen(false);
  }, [editing]);

  const handleDelete = useCallback((id: string, title: string) => {
    if (window.confirm(`¿Eliminar banner "${title}"?`)) {
      setPromos((prev) => prev.filter((p) => p.id !== id));
      notify(`Banner "${title}" eliminado`, 'error');
    }
  }, []);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const id = `promo_img_${Date.now()}_${file.name}`;
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    await imageStore.save(id, blob);
    setEditing({ ...editing, imageUrl: `idb://${id}` });
    notify(`Imagen "${file.name}" agregada`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [editing]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banners Promocionales</h1>
          <p className="text-sm text-slate-500 mt-0.5">{promos.length} banners activos</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer shadow-sm">
          <Plus size={16} />
          Nuevo Banner
        </button>
      </div>

      <div className="space-y-4">
        {promos.map((promo, i) => (
          <div key={promo.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row">
              <div className={`relative w-full sm:w-64 h-40 shrink-0 bg-gradient-to-r ${promo.bgColor}`}>
                <ProductImage src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover opacity-80" />
                <span className="absolute top-2 left-2 bg-white/80 text-xs font-bold px-2 py-0.5 rounded text-slate-700">#{i + 1}</span>
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{promo.title}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{promo.subtitle}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                    {promo.ctaText}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(promo)} className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">Editar</button>
                    <button onClick={() => handleDelete(promo.id, promo.title)} className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {promos.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-400 text-sm">No hay banners. Creá uno nuevo.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={editing?.id && promos.some((p) => p.id === editing.id) ? 'Editar Banner' : 'Nuevo Banner'} size="lg">
        {editing && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Título</label>
                <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="Ej: Hasta 40% OFF" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Subtítulo</label>
                <input type="text" value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="Ej: En toda la colección de verano" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Texto del Botón</label>
                <input type="text" value={editing.ctaText} onChange={(e) => setEditing({ ...editing, ctaText: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Color de Fondo</label>
                <div className="relative">
                  <select value={editing.bgColor} onChange={(e) => setEditing({ ...editing, bgColor: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 appearance-none bg-white">
                    {BG_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Color del Botón</label>
                <div className="relative">
                  <select value={editing.accentColor} onChange={(e) => setEditing({ ...editing, accentColor: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 appearance-none bg-white">
                    {ACCENT_COLORS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Imagen de Fondo</label>
              <div className="flex gap-2">
                <input type="text" value={editing.imageUrl} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} className="flex-1 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400" placeholder="URL o idb://..." />
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shrink-0">
                  <Upload size={16} />
                  Subir
                </button>
              </div>
            </div>

            {editing.imageUrl && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Vista previa</label>
                <div className="relative w-full max-w-md h-28 rounded-xl overflow-hidden bg-slate-100">
                  <ProductImage src={editing.imageUrl} alt="Vista previa" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white font-bold text-sm">{editing.title || 'Título'}</p>
                    <p className="text-white/70 text-xs">{editing.subtitle || 'Subtítulo'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">Cancelar</button>
              <button onClick={handleSave} className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer shadow-sm">Guardar Banner</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
