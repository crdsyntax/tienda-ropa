import type { ReactNode } from 'react';

export function EmptyState({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 bg-slate-100 rounded-2xl text-slate-400 mb-4">{icon}</div>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}
