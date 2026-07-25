import type { ReactNode } from 'react';
import { Clock, Truck, CheckCircle2, Ban } from 'lucide-react';
import type { Order } from '../types';

const STATUS_FLOW: { status: Order['status']; label: string; icon: ReactNode }[] = [
  { status: 'pending', label: 'Pendiente', icon: <Clock size={16} /> },
  { status: 'shipped', label: 'Enviado', icon: <Truck size={16} /> },
  { status: 'delivered', label: 'Entregado', icon: <CheckCircle2 size={16} /> },
];

export function OrderTimeline({ current }: { current: Order['status'] }) {
  const currentIndex = STATUS_FLOW.findIndex((s) => s.status === current);

  return (
    <div className="flex items-center gap-2">
      {STATUS_FLOW.map((step, idx) => {
        const isCompleted = idx <= currentIndex && current !== 'cancelled';
        const isCurrent = idx === currentIndex && current !== 'cancelled';
        return (
          <div key={step.status} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              current === 'cancelled' ? 'bg-red-50 text-red-500' :
              isCompleted ? (isCurrent ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-emerald-50 text-emerald-600') :
              'bg-slate-100 text-slate-400'
            }`}>
              {step.icon}
              {step.label}
            </div>
            {idx < STATUS_FLOW.length - 1 && (
              <div className={`h-px flex-1 ${current === 'cancelled' ? 'bg-red-200' : idx < currentIndex ? 'bg-emerald-300' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
      {current === 'cancelled' && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-50 text-red-500 border border-red-200">
          <Ban size={16} />
          Cancelado
        </div>
      )}
    </div>
  );
}
