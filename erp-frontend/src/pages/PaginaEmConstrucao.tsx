import { Construction } from 'lucide-react';

interface PaginaEmConstrucaoProps {
  titulo: string;
}

export function PaginaEmConstrucao({ titulo }: PaginaEmConstrucaoProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-ink-900">{titulo}</h1>
      <p className="mb-4 text-sm text-ink-500">Módulo conectado ao backend, tela em construção.</p>
      <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-300 bg-white text-ink-500">
        <Construction size={28} />
        <p className="text-sm">A tela de {titulo.toLowerCase()} será implementada aqui.</p>
      </div>
    </div>
  );
}
