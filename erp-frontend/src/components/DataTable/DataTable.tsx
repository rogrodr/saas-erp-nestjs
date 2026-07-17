import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { SearchBar } from '../SearchBar/SearchBar';
import { Pagination } from '../Pagination/Pagination';

export interface ColunaTabela<T> {
  cabecalho: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface BuscaConfig<T> {
  placeholder?: string;
  camposBusca: (item: T) => Array<string | number | undefined | null>;
}

interface DataTableProps<T> {
  colunas: ColunaTabela<T>[];
  itens: T[];
  carregando: boolean;
  chave: (item: T) => string | number;
  mensagemVazio?: string;
  acoes?: (item: T) => ReactNode;
  busca?: BuscaConfig<T>;
  itensPorPagina?: number;
}

export function DataTable<T>({
  colunas,
  itens,
  carregando,
  chave,
  mensagemVazio,
  acoes,
  busca,
  itensPorPagina = 8,
}: DataTableProps<T>) {
  const [termo, setTermo] = useState('');
  const [pagina, setPagina] = useState(1);

  const itensFiltrados = useMemo(() => {
    if (!busca || !termo.trim()) return itens;
    const termoNormalizado = termo.trim().toLowerCase();
    return itens.filter((item) =>
      busca
        .camposBusca(item)
        .filter(Boolean)
        .some((campo) => String(campo).toLowerCase().includes(termoNormalizado)),
    );
  }, [itens, termo, busca]);

  const totalPaginas = Math.max(1, Math.ceil(itensFiltrados.length / itensPorPagina));

  useEffect(() => {
    setPagina(1);
  }, [termo, itens.length]);

  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [pagina, totalPaginas]);

  const itensPaginados = itensFiltrados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);
  const colSpan = colunas.length + (acoes ? 1 : 0);

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
      {busca && (
        <div className="border-b border-ink-100 p-3">
          <SearchBar valor={termo} aoAlterar={setTermo} placeholder={busca.placeholder} />
        </div>
      )}

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-100/30">
            {colunas.map((coluna) => (
              <th key={coluna.cabecalho} className="px-4 py-3 font-medium text-ink-500">
                {coluna.cabecalho}
              </th>
            ))}
            {acoes && <th className="px-4 py-3 font-medium text-ink-500">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr>
              <td colSpan={colSpan} className="px-4 py-10 text-center text-ink-500">
                <Loader2 size={18} className="mx-auto animate-spin" />
              </td>
            </tr>
          )}

          {!carregando && itensPaginados.length === 0 && (
            <tr>
              <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-ink-500">
                {itens.length > 0 ? 'Nenhum resultado para essa busca.' : mensagemVazio ?? 'Nenhum registro encontrado.'}
              </td>
            </tr>
          )}

          {!carregando &&
            itensPaginados.map((item) => (
              <tr key={chave(item)} className="border-b border-ink-100 last:border-0 hover:bg-ink-100/20">
                {colunas.map((coluna) => (
                  <td key={coluna.cabecalho} className={`px-4 py-3 text-ink-900 ${coluna.className ?? ''}`}>
                    {coluna.render(item)}
                  </td>
                ))}
                {acoes && <td className="px-4 py-3">{acoes(item)}</td>}
              </tr>
            ))}
        </tbody>
      </table>

      {!carregando && (
        <Pagination
          paginaAtual={pagina}
          totalPaginas={totalPaginas}
          totalItens={itensFiltrados.length}
          itensPorPagina={itensPorPagina}
          aoMudarPagina={setPagina}
        />
      )}
    </div>
  );
}
