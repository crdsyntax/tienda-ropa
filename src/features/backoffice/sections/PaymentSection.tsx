import { useState, useCallback } from 'react';
import { Save, CheckCircle2, Info } from 'lucide-react';
import type { MerchantPaymentSettings, PaymentMethodId, PaymentFieldDef } from '../../../types/payment';
import { PAYMENT_METHODS } from '../../../types/payment';
import { notify } from '../components';

interface PaymentSectionProps {
  payment: MerchantPaymentSettings;
  onSave: (payment: MerchantPaymentSettings) => void;
}

const inputClass = 'w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400';

function fieldInput(def: PaymentFieldDef, value: string, onChange: (v: string) => void) {
  return (
    <div key={def.key}>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        {def.label}
        {def.required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={def.placeholder}
        className={inputClass}
      />
    </div>
  );
}

export function PaymentSection({ payment, onSave }: PaymentSectionProps) {
  const [draft, setDraft] = useState<MerchantPaymentSettings>(payment);

  const enabledCount = PAYMENT_METHODS.filter((m) => draft.enabledMethods[m.id]).length;

  const toggleMethod = useCallback((id: PaymentMethodId, enabled: boolean) => {
    setDraft((prev) => ({ ...prev, enabledMethods: { ...prev.enabledMethods, [id]: enabled } }));
  }, []);

  const updateField = useCallback((id: PaymentMethodId, key: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      data: { ...prev.data, [id]: { ...prev.data[id], [key]: value } },
    }));
  }, []);

  const handleSave = useCallback(() => {
    for (const method of PAYMENT_METHODS) {
      if (!draft.enabledMethods[method.id]) continue;
      for (const field of method.merchantFields) {
        if (field.required && !(draft.data[method.id]?.[field.key] ?? '').trim()) {
          notify(`Completa "${field.label}" del método ${method.label}`, 'error');
          return;
        }
      }
    }
    onSave(draft);
    notify('Datos de pago guardados');
  }, [draft, onSave]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Métodos de Pago</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {enabledCount > 0
              ? `${enabledCount} métodos habilitados para tus clientes.`
              : 'Habilita al menos un método para poder recibir pedidos.'}
          </p>
        </div>
        {enabledCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full">
            <CheckCircle2 size={12} />
            {enabledCount} métodos activos
          </span>
        )}
      </div>

      <div className="space-y-4 max-w-3xl">
        {PAYMENT_METHODS.map((method) => {
          const enabled = draft.enabledMethods[method.id];
          const fields = draft.data[method.id] ?? {};
          return (
            <div key={method.id} className={`bg-white rounded-xl border shadow-sm p-5 transition-colors ${enabled ? 'border-slate-300' : 'border-slate-200 opacity-80'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => toggleMethod(method.id, e.target.checked)}
                  className="accent-slate-900 w-4 h-4 mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{method.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{method.description}</p>
                </div>
              </div>

              {enabled && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {method.merchantFields.length === 0 ? (
                    <p className="text-xs text-slate-400">Este método no requiere datos de registro del comerciante.</p>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Datos de registro del comerciante</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {method.merchantFields.map((def) => fieldInput(def, fields[def.key] ?? '', (v) => updateField(method.id, def.key, v)))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-6 max-w-3xl">
        <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer shadow-sm">
          <Save size={16} />
          Guardar métodos de pago
        </button>
      </div>

      <div className="mt-6 max-w-3xl">
        <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl p-4 text-sm">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>
            Los métodos habilitados aparecerán en el checkout. El cliente elegirá uno y deberá registrar los datos de pago requeridos. Los campos cambian automáticamente según el método seleccionado.
          </p>
        </div>
      </div>
    </div>
  );
}