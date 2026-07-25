import type { BackofficeProduct, Order } from '../types';
import { STATUS_STYLES, STATUS_LABELS } from '../constants';

interface BadgeProps {
  status: BackofficeProduct['status'] | Order['status'];
}

export function StatusBadge({ status }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
