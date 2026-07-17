import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  itensPorPagina: number;
  aoMudarPagina: (pagina: number) => void;
}

export function Pagination({ paginaAtual, totalPaginas, totalItens, itensPorPagina, aoMudarPagina }: PaginationProps) {
  if (totalItens === 0) return null;

  const inicio = (paginaAtual - 1) * itensPorPagina + 1;
  const fim = Math.min(paginaAtual * itensPorPagina, totalItens);

  return (
    <div className="flex items-center justify-between border-t border-ink-100 px-4 py-3 text-sm text-ink-500">
      <span>
        Mostrando {inicio}–{fim} de {totalItens}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => aoMudarPagina(paginaAtual - 1)}
          disabled={paginaAtual <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-ink-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-2 text-ink-700">
          Página {paginaAtual} de {totalPaginas}
        </span>
        <button
          onClick={() => aoMudarPagina(paginaAtual + 1)}
          disabled={paginaAtual >= totalPaginas}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-ink-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
