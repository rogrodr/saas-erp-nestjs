import { useEffect, useState, type FormEvent } from 'react';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { StatCard } from '../components/ui/StatCard';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Badge } from '../components/ui/Badge';
import { api } from '../lib/api';
import { extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';
import { formatadorMoeda, formatarData, paraInputDate } from '../lib/formatadores';

interface ContaComSituacao {
  id: number;
  descricao: string;
  valor: number;
  vencimento: string;
  cliente?: { nome: string };
  situacao: 'Vencida' | 'A vencer';
}

interface RespostaFinanceiro {
  periodo: { de: string; ate: string };
  contasReceber: { vencidas: any[]; aVencer: any[]; totalEmAberto: number };
  contasPagar: { vencidas: any[]; aVencer: any[]; totalEmAberto: number };
  resultado: { receita: number; despesas: number; saldo: number };
}

function combinarComSituacao(vencidas: any[], aVencer: any[]): ContaComSituacao[] {
  return [
    ...vencidas.map((item) => ({ ...item, situacao: 'Vencida' as const })),
    ...aVencer.map((item) => ({ ...item, situacao: 'A vencer' as const })),
  ];
}

export function RelatorioFinanceiro() {
  const [de, setDe] = useState('');
  const [ate, setAte] = useState('');
  const [dados, setDados] = useState<RespostaFinanceiro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function buscar(filtros?: { de?: string; ate?: string }) {
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await api.get<RespostaFinanceiro>('/relatorios/financeiro', {
        params: { de: filtros?.de || undefined, ate: filtros?.ate || undefined },
      });
      setDados(data);
      setDe(paraInputDate(data.periodo.de));
      setAte(paraInputDate(data.periodo.ate));
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
    buscar({ de, ate });
  }

  const contasReceber = dados ? combinarComSituacao(dados.contasReceber.vencidas, dados.contasReceber.aVencer) : [];
  const contasPagar = dados ? combinarComSituacao(dados.contasPagar.vencidas, dados.contasPagar.aVencer) : [];

  const colunasReceber: ColunaTabela<ContaComSituacao>[] = [
    { cabecalho: 'Descrição', render: (item) => item.descricao },
    { cabecalho: 'Cliente', render: (item) => item.cliente?.nome ?? '—' },
    { cabecalho: 'Valor', render: (item) => formatadorMoeda.format(item.valor) },
    { cabecalho: 'Vencimento', render: (item) => formatarData(item.vencimento) },
    {
      cabecalho: 'Situação',
      render: (item) => <Badge texto={item.situacao} tom={item.situacao === 'Vencida' ? 'vermelho' : 'ambar'} />,
    },
  ];

  const colunasPagar: ColunaTabela<ContaComSituacao>[] = [
    { cabecalho: 'Descrição', render: (item) => item.descricao },
    { cabecalho: 'Valor', render: (item) => formatadorMoeda.format(item.valor) },
    { cabecalho: 'Vencimento', render: (item) => formatarData(item.vencimento) },
    {
      cabecalho: 'Situação',
      render: (item) => <Badge texto={item.situacao} tom={item.situacao === 'Vencida' ? 'vermelho' : 'ambar'} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader titulo="Relatório Financeiro" subtitulo="DRE simplificado e contas a pagar/receber em aberto" />

      <form onSubmit={aoFiltrar} className="flex flex-wrap items-end gap-3 rounded-xl border border-ink-100 bg-white p-4">
        <div className="flex flex-col gap-1.5">
          <label className={classesRotulo}>Período — de</label>
          <input type="date" className={classesCampo} value={de} onChange={(e) => setDe(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={classesRotulo}>até</label>
          <input type="date" className={classesCampo} value={ate} onChange={(e) => setAte(e.target.value)} />
        </div>
        <button type="submit" className={classesBotaoPrimario}>
          Aplicar
        </button>
        <button type="button" onClick={() => buscar()} className={classesBotaoSecundario}>
          Mês atual
        </button>
      </form>

      {erro && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}

      {dados && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard titulo="Receita no período (vendas faturadas)" valor={formatadorMoeda.format(dados.resultado.receita)} icone={TrendingUp} corIcone="verde" />
            <StatCard titulo="Despesas pagas no período" valor={formatadorMoeda.format(dados.resultado.despesas)} icone={TrendingDown} corIcone="ambar" />
            <StatCard
              titulo="Saldo do período"
              valor={formatadorMoeda.format(dados.resultado.saldo)}
              icone={Wallet}
              corIcone={dados.resultado.saldo >= 0 ? 'verde' : 'ambar'}
            />
          </div>

          <Panel titulo={`Contas a Receber em aberto — total: ${formatadorMoeda.format(dados.contasReceber.totalEmAberto)}`}>
            <DataTable
              colunas={colunasReceber}
              itens={contasReceber}
              carregando={carregando}
              chave={(item) => item.id}
              mensagemVazio="Nenhuma conta a receber vencida ou a vencer nos próximos 30 dias."
              busca={{ placeholder: 'Buscar por descrição ou cliente', camposBusca: (item) => [item.descricao, item.cliente?.nome] }}
            />
          </Panel>

          <Panel titulo={`Contas a Pagar em aberto — total: ${formatadorMoeda.format(dados.contasPagar.totalEmAberto)}`}>
            <DataTable
              colunas={colunasPagar}
              itens={contasPagar}
              carregando={carregando}
              chave={(item) => item.id}
              mensagemVazio="Nenhuma conta a pagar vencida ou a vencer nos próximos 30 dias."
              busca={{ placeholder: 'Buscar por descrição', camposBusca: (item) => [item.descricao] }}
            />
          </Panel>
        </>
      )}
    </div>
  );
}
