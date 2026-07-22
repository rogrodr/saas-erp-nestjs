import { useEffect, useState, type FormEvent } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Badge } from '../components/ui/Badge';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';
import { formatarData } from '../lib/formatadores';
import { api } from '../lib/api';
import { extrairMensagemErro } from '../lib/hooks/useRecurso';


type AcaoAuditoria = 'CRIAR' | 'ATUALIZAR' | 'DELETAR' | 'ACESSO';

const tonsAcao: Record<AcaoAuditoria, 'verde' | 'azul' | 'vermelho' | 'cinza'> = {
  CRIAR: 'verde',
  ATUALIZAR: 'azul',
  DELETAR: 'vermelho',
  ACESSO: 'cinza',
};

interface Auditoria {
  id: number;
  acao: AcaoAuditoria;
  entidade: string;
  entidadeId?: number;
  createdAt: string;
  usuario?: { id: number; nome: string; email: string };
}

export function Auditoria() {
  const [itens, setItens] = useState<Auditoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [entidade, setEntidade] = useState('');
  const [acao, setAcao] = useState<AcaoAuditoria | ''>('');

  async function buscar(filtros?: { entidade?: string; acao?: string }) {
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await api.get<Auditoria[]>('/auditoria', {
        params: { entidade: filtros?.entidade || undefined, acao: filtros?.acao || undefined, limite: 100 },
      });
      setItens(Array.isArray(data) ? data : []);
    } catch (erroRequisicao) {
      setErro(extrairMensagemErro(erroRequisicao));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function aoFiltrar(evento: FormEvent) {
    evento.preventDefault();
    buscar({ entidade, acao });
  }

  function limparFiltros() {
    setEntidade('');
    setAcao('');
    buscar();
  }

  const colunas: ColunaTabela<Auditoria>[] = [
    { cabecalho: 'Data', render: (item) => formatarData(item.createdAt) },
    { cabecalho: 'Usuário', render: (item) => item.usuario?.nome ?? item.usuario?.email ?? '—' },
    { cabecalho: 'Ação', render: (item) => <Badge texto={item.acao} tom={tonsAcao[item.acao] ?? 'cinza'} /> },
    { cabecalho: 'Entidade', render: (item) => item.entidade },
    { cabecalho: 'ID do registro', render: (item) => item.entidadeId ?? '—' },
  ];

  return (
    <div>
      <PageHeader titulo="Auditoria" subtitulo="Histórico de ações realizadas na empresa" />

      <form onSubmit={aoFiltrar} className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-ink-100 bg-white p-4">
        <div className="flex flex-col gap-1.5">
          <label className={classesRotulo}>Entidade</label>
          <input
            className={`${classesCampo} w-48`}
            placeholder="ex: produto, venda"
            value={entidade}
            onChange={(e) => setEntidade(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={classesRotulo}>Ação</label>
          <select className={`${classesCampo} w-48`} value={acao} onChange={(e) => setAcao(e.target.value as AcaoAuditoria | '')}>
            <option value="">Todas</option>
            <option value="CRIAR">Criar</option>
            <option value="ATUALIZAR">Atualizar</option>
            <option value="DELETAR">Deletar</option>
            <option value="ACESSO">Acesso</option>
          </select>
        </div>
        <button type="submit" className={classesBotaoPrimario}>
          Filtrar
        </button>
        <button type="button" onClick={limparFiltros} className={classesBotaoSecundario}>
          Limpar
        </button>
      </form>

      {erro && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}

      <DataTable
        colunas={colunas}
        itens={itens}
        carregando={carregando}
        chave={(item) => item.id}
        mensagemVazio="Nenhum registro de auditoria encontrado."
        busca={{
          placeholder: 'Buscar por usuário, ação ou entidade',
          camposBusca: (item) => [item.usuario?.nome, item.usuario?.email, item.acao, item.entidade],
        }}
      />
    </div>
  );
}
