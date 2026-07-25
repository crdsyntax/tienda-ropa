export function StockBar({ stock }: { stock: number }) {
  const pct = Math.min(stock / 50, 1) * 100;
  const color = stock <= 5 ? 'bg-red-500' : stock <= 15 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
      <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
