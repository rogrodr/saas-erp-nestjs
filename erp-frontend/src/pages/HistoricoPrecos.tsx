import { useState, type FormEvent } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Badge } from '../components/ui/Badge';
import { useRecurso, extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';
import { formatadorMoeda, formatarData } from '../lib/formatadores';
import { api } from '../lib/api';

interface Produto {
  id: number;
  nome: string;
}

interface RegistroHistorico {
  id: number;
  preco: number;
  tipo: 'COMPRA' | 'VENDA';
  createdAt: string;
  compra?: { fornecedor?: { nome: string } };
}

interface MenorPreco {
  produto: string;
  menorPreco: number;
  fornecedor: string;
  data: string;
}

export function HistoricoPrecos() {
  const { itens: produtos } = useRecurso<Produto>('/produtos');

  const [produtoId, setProdutoId] = useState('');
  const [historico, setHistorico] = useState<RegistroHistorico[] | null>(null);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [erroHistorico, setErroHistorico] = useState<string | null>(null);

  const [de, setDe] = useState('');
  const [ate, setAte] = useState('');
  const [menoresPrecos, setMenoresPrecos] = useState<MenorPreco[] | null>(null);
  const [carregandoMenorPreco, setCarregandoMenorPreco] = useState(false);
  const [erroMenorPreco, setErroMenorPreco] = useState<string | null>(null);

  async function consultarHistorico(evento: FormEvent) {
    evento.preventDefault();
    if (!produtoId) return;
    setCarregandoHistorico(true);
    setErroHistorico(null);
    try {
      const { data } = await api.get<RegistroHistorico[]>(`/historico-precos/produto/${produtoId}`);
      setHistorico(data);
    } catch (erroRequisicao) {
      setErroHistorico(extrairMensagemErro(erroRequisicao));
    } finally {
      setCarregandoHistorico(false);
    }
  }

  async function consultarMenorPreco(evento: FormEvent) {
    evento.preventDefault();
    if (!de || !ate) return;
    setCarregandoMenorPreco(true);
    setErroMenorPreco(null);
    try {
      const { data } = await api.get<MenorPreco[]>('/historico-precos/menor-preco', { params: { de, ate } });
      setMenoresPrecos(data);
    } catch (erroRequisicao) {
      setErroMenorPreco(extrairMensagemErro(erroRequisicao));
    } finally {
      setCarregandoMenorPreco(false);
    }
  }

  const colunasHistorico: ColunaTabela<RegistroHistorico>[] = [
    { cabecalho: 'Data', render: (item) => formatarData(item.createdAt) },
    {
      cabecalho: 'Tipo',
      render: (item) => <Badge texto={item.tipo === 'COMPRA' ? 'Compra' : 'Venda'} tom={item.tipo === 'COMPRA' ? 'azul' : 'verde'} />,
    },
    { cabecalho: 'Preço', render: (item) => formatadorMoeda.format(item.preco) },
    { cabecalho: 'Fornecedor', render: (item) => item.compra?.fornecedor?.nome ?? '—' },
  ];

  const colunasMenorPreco: ColunaTabela<MenorPreco>[] = [
    { cabecalho: 'Produto', render: (item) => item.produto },
    { cabecalho: 'Menor preço de compra', render: (item) => formatadorMoeda.format(item.menorPreco) },
    { cabecalho: 'Fornecedor', render: (item) => item.fornecedor },
    { cabecalho: 'Data', render: (item) => formatarData(item.data) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader titulo="Histórico de Preços" subtitulo="Consulte a variação de preços dos seus produtos" />

      <div className="rounded-xl border border-ink-100 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-ink-900">Histórico por produto</h3>
        <form onSubmit={consultarHistorico} className="mb-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Produto</label>
            <select required className={`${classesCampo} w-64`} value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={classesBotaoPrimario}>
            Consultar
          </button>
        </form>

        {erroHistorico && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erroHistorico}</div>}

        {historico && (
          <DataTable
            colunas={colunasHistorico}
            itens={historico}
            carregando={carregandoHistorico}
            chave={(item) => item.id}
            mensagemVazio="Nenhum histórico de preço para esse produto ainda."
          />
        )}
      </div>

      <div className="rounded-xl border border-ink-100 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-ink-900">Menor preço de compra por período</h3>
        <form onSubmit={consultarMenorPreco} className="mb-4 flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>De</label>
            <input type="date" required className={classesCampo} value={de} onChange={(e) => setDe(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Até</label>
            <input type="date" required className={classesCampo} value={ate} onChange={(e) => setAte(e.target.value)} />
          </div>
          <button type="submit" className={classesBotaoPrimario}>
            Consultar
          </button>
          {menoresPrecos && (
            <button
              type="button"
              className={classesBotaoSecundario}
              onClick={() => {
                setMenoresPrecos(null);
                setDe('');
                setAte('');
              }}
            >
              Limpar
            </button>
          )}
        </form>

        {erroMenorPreco && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erroMenorPreco}</div>}

        {menoresPrecos && (
          <DataTable
            colunas={colunasMenorPreco}
            itens={menoresPrecos}
            carregando={carregandoMenorPreco}
            chave={(item) => `${item.produto}-${item.data}`}
            mensagemVazio="Nenhuma compra encontrada nesse período."
          />
        )}
      </div>
    </div>
  );
}
