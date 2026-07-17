import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useRecurso, extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';
import { formatadorMoeda, formatarData } from '../lib/formatadores';

interface ContaPagar {
  id: number;
  descricao: string;
  valor: number;
  vencimento: string;
  pago: boolean;
}

interface FormularioConta {
  descricao: string;
  valor: string;
  vencimento: string;
}

const formularioVazio: FormularioConta = { descricao: '', valor: '', vencimento: '' };

const colunas: ColunaTabela<ContaPagar>[] = [
  { cabecalho: 'Descrição', render: (item) => item.descricao },
  { cabecalho: 'Valor', render: (item) => formatadorMoeda.format(item.valor) },
  { cabecalho: 'Vencimento', render: (item) => formatarData(item.vencimento) },
  {
    cabecalho: 'Status',
    render: (item) => <Badge texto={item.pago ? 'Pago' : 'Em aberto'} tom={item.pago ? 'verde' : 'ambar'} />,
  },
];

export function ContasPagar() {
  const { itens, carregando, erro, criar, acaoCustomizada } = useRecurso<ContaPagar>('/contas-pagar');

  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState<FormularioConta>(formularioVazio);
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  function campo(nomeCampo: keyof FormularioConta, valor: string) {
    setFormulario((atual) => ({ ...atual, [nomeCampo]: valor }));
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErroFormulario(null);
    try {
      await criar({
        descricao: formulario.descricao,
        valor: Number(formulario.valor),
        vencimento: formulario.vencimento,
      });
      setModalAberto(false);
      setFormulario(formularioVazio);
    } catch (erroRequisicao) {
      setErroFormulario(extrairMensagemErro(erroRequisicao));
    } finally {
      setSalvando(false);
    }
  }

  async function marcarComoPago(conta: ContaPagar) {
    setProcessandoId(conta.id);
    try {
      await acaoCustomizada(conta.id, 'pagar');
    } finally {
      setProcessandoId(null);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Contas a Pagar"
        subtitulo="Controle de obrigações da empresa"
        rotuloAcao="Nova conta"
        aoClicarAcao={() => setModalAberto(true)}
      />

      {erro && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}

      <DataTable
        colunas={colunas}
        itens={itens}
        carregando={carregando}
        chave={(item) => item.id}
        mensagemVazio="Nenhuma conta a pagar cadastrada."
        busca={{ placeholder: 'Buscar por descrição', camposBusca: (item) => [item.descricao] }}
        acoes={(item) =>
          !item.pago && (
            <button
              onClick={() => marcarComoPago(item)}
              disabled={processandoId === item.id}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
            >
              <CheckCircle2 size={15} />
              {processandoId === item.id ? 'Processando...' : 'Marcar pago'}
            </button>
          )
        }
      />

      <Modal aberto={modalAberto} titulo="Nova conta a pagar" aoFechar={() => setModalAberto(false)}>
        <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Descrição</label>
            <input required className={classesCampo} value={formulario.descricao} onChange={(e) => campo('descricao', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Valor</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className={classesCampo}
                value={formulario.valor}
                onChange={(e) => campo('valor', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Vencimento</label>
              <input
                type="date"
                required
                className={classesCampo}
                value={formulario.vencimento}
                onChange={(e) => campo('vencimento', e.target.value)}
              />
            </div>
          </div>

          {erroFormulario && <p className="text-sm text-red-500">{erroFormulario}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setModalAberto(false)} className={classesBotaoSecundario}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando} className={classesBotaoPrimario}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
