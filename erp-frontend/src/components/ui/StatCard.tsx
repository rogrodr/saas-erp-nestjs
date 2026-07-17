import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  titulo: string;
  valor: string;
  variacao?: string;
  tendencia?: 'positiva' | 'negativa';
  icone: LucideIcon;
  corIcone: 'brand' | 'verde' | 'ambar';
}

const coresFundo: Record<StatCardProps['corIcone'], string> = {
  brand: 'bg-brand-100 text-brand-700',
  verde: 'bg-emerald-100 text-emerald-700',
  ambar: 'bg-amber-100 text-amber-700',
};

export function StatCard({ titulo, valor, variacao, tendencia, icone: Icone, corIcone }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-ink-100 bg-white p-5">
      <div className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-full', coresFundo[corIcone])}>
        <Icone size={20} />
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-ink-900">{valor}</span>
          {variacao && (
            <span
              className={clsx(
                'text-xs font-medium',
                tendencia === 'negativa' ? 'text-red-500' : 'text-emerald-600',
              )}
            >
              ({variacao})
            </span>
          )}
        </div>
        <p className="text-xs text-ink-500">{titulo}</p>
      </div>
    </div>
  );
}
