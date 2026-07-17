import type { ReactNode } from 'react';

interface PanelProps {
  titulo: string;
  acao?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Panel({ titulo, acao, children, className }: PanelProps) {
  return (
    <div className={`rounded-xl border border-ink-100 bg-white p-5 ${className ?? ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">{titulo}</h3>
        {acao}
      </div>
      {children}
    </div>
  );
}
