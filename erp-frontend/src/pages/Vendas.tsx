import { useState, type FormEvent } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { ItensPedidoEditor, type ItemPedido } from '../components/ui/ItensPedido';
import { useRecurso, extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';
import { formatadorMoeda } from '../lib/formatadores';

// O enum de status do pedido (StatusPedido) não veio no código-fonte do backend
// (não havia prisma/schema.prisma no zip enviado). As opções abaixo são um palpite
// com base no que o VendasService usa ('FATURADO') — confirme os valores exatos
// no seu schema.prisma e ajuste esta lista se necessário.
type StatusPedido = 'ABERTO' | 'FATURADO' | 'CANCELADO';

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface Cliente {
  id: number;
  nome: string;
}

interface Venda {
  id: number;
  total: number;
  desconto?: number;
  status?: StatusPedido;
  cliente?: Cliente;
  itens: { produtoId: number; quantidade: number; preco: number; produto?: Produto }[];
  createdAt?: string;
}

const tonsStatus: Record<StatusPedido, 'verde' | 'ambar' | 'vermelho'> = {
  ABERTO: 'ambar',
  FATURADO: 'verde',
  CANCELADO: 'vermelho',
};

export function Vendas() {
  const { itens: vendas, carregando, erro, criar } = useRecurso<Venda>('/vendas');
  const { itens: produtos } = useRecurso<Produto>('/produtos');
  const { itens: clientes } = useRecurso<Cliente>('/clientes');

  const [modalAberto, setModalAberto] = useState(false);
  const [clienteId, setClienteId] = useState('');
  const [desconto, setDesconto] = useState('');
  const [status, setStatus] = useState<StatusPedido>('ABERTO');
  const [itensPedido, setItensPedido] = useState<ItemPedido[]>([{ produtoId: '', quantidade: '1', preco: '' }]);
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const totalCalculado = itensPedido.reduce(
    (soma, item) => soma + (Number(item.quantidade) || 0) * (Number(item.preco) || 0),
    0,
  );

  function resetarFormulario() {
    setClienteId('');
    setDesconto('');
    setStatus('ABERTO');
    setItensPedido([{ produtoId: '', quantidade: '1', preco: '' }]);
    setErroFormulario(null);
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErroFormulario(null);
    try {
      const descontoNumero = Number(desconto) || 0;
      await criar({
        clienteId: clienteId ? Number(clienteId) : undefined,
        status,
        desconto: descontoNumero || undefined,
        total: totalCalculado - descontoNumero,
        itens: itensPedido.map((item) => ({
          produtoId: Number(item.produtoId),
          quantidade: Number(item.quantidade),
          preco: Number(item.preco),
        })),
      } as Partial<Venda>);
      setModalAberto(false);
      resetarFormulario();
    } catch (erroRequisicao) {
      setErroFormulario(extrairMensagemErro(erroRequisicao));
    } finally {
      setSalvando(false);
    }
  }

  const colunas: ColunaTabela<Venda>[] = [
    { cabecalho: 'Cliente', render: (item) => item.cliente?.nome ?? 'Consumidor final' },
    { cabecalho: 'Itens', render: (item) => `${item.itens?.length ?? 0} item(ns)` },
    { cabecalho: 'Desconto', render: (item) => (item.desconto ? formatadorMoeda.format(item.desconto) : '—') },
    { cabecalho: 'Total', render: (item) => formatadorMoeda.format(item.total) },
    {
      cabecalho: 'Status',
      render: (item) => (item.status ? <Badge texto={item.status} tom={tonsStatus[item.status] ?? 'cinza'} /> : '—'),
    },
  ];

  return (
    <div>
      <PageHeader
        titulo="Vendas"
        subtitulo="Pedidos de venda da empresa"
        rotuloAcao="Nova venda"
        aoClicarAcao={() => setModalAberto(true)}
      />

      {erro && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}

      <DataTable
        colunas={colunas}
        itens={vendas}
        carregando={carregando}
        chave={(item) => item.id}
        mensagemVazio="Nenhuma venda registrada ainda."
        busca={{
          placeholder: 'Buscar por cliente ou status',
          camposBusca: (item) => [item.cliente?.nome, item.status],
        }}
      />

      <Modal aberto={modalAberto} titulo="Nova venda" aoFechar={() => setModalAberto(false)} largura="lg">
        <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className={classesRotulo}>Cliente (opcional)</label>
              <select className={classesCampo} value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                <option value="">Consumidor final</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Status</label>
              <select className={classesCampo} value={status} onChange={(e) => setStatus(e.target.value as StatusPedido)}>
                <option value="ABERTO">Aberto</option>
                <option value="FATURADO">Faturado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          </div>

          <ItensPedidoEditor itens={itensPedido} produtos={produtos} aoAlterar={setItensPedido} />

          <div className="flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Desconto (opcional)</label>
              <input type="number" step="0.01" min="0" className={`${classesCampo} w-40`} value={desconto} onChange={(e) => setDesconto(e.target.value)} />
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-500">Total</p>
              <p className="text-lg font-semibold text-ink-900">
                {formatadorMoeda.format(Math.max(totalCalculado - (Number(desconto) || 0), 0))}
              </p>
            </div>
          </div>

          {erroFormulario && <p className="text-sm text-red-500">{erroFormulario}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setModalAberto(false)} className={classesBotaoSecundario}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando} className={classesBotaoPrimario}>
              {salvando ? 'Salvando...' : 'Salvar venda'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
