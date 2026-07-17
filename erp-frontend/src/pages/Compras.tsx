import { useState, type FormEvent } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Modal } from '../components/ui/Modal';
import { ItensPedidoEditor, type ItemPedido } from '../components/ui/ItensPedido';
import { useRecurso, extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';
import { formatadorMoeda } from '../lib/formatadores';

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface Fornecedor {
  id: number;
  nome: string;
}

interface Compra {
  id: number;
  total: number;
  fornecedor?: Fornecedor;
  itens: { produtoId: number; quantidade: number; preco: number; produto?: Produto }[];
  createdAt?: string;
}

export function Compras() {
  const { itens: compras, carregando, erro, criar } = useRecurso<Compra>('/compras');
  const { itens: produtos } = useRecurso<Produto>('/produtos');
  const { itens: fornecedores } = useRecurso<Fornecedor>('/fornecedores');

  const [modalAberto, setModalAberto] = useState(false);
  const [fornecedorId, setFornecedorId] = useState('');
  const [itensPedido, setItensPedido] = useState<ItemPedido[]>([{ produtoId: '', quantidade: '1', preco: '' }]);
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const totalCalculado = itensPedido.reduce(
    (soma, item) => soma + (Number(item.quantidade) || 0) * (Number(item.preco) || 0),
    0,
  );

  function resetarFormulario() {
    setFornecedorId('');
    setItensPedido([{ produtoId: '', quantidade: '1', preco: '' }]);
    setErroFormulario(null);
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErroFormulario(null);
    try {
      await criar({
        fornecedorId: Number(fornecedorId),
        total: totalCalculado,
        itens: itensPedido.map((item) => ({
          produtoId: Number(item.produtoId),
          quantidade: Number(item.quantidade),
          preco: Number(item.preco),
        })),
      } as Partial<Compra>);
      setModalAberto(false);
      resetarFormulario();
    } catch (erroRequisicao) {
      setErroFormulario(extrairMensagemErro(erroRequisicao));
    } finally {
      setSalvando(false);
    }
  }

  const colunas: ColunaTabela<Compra>[] = [
    { cabecalho: 'Fornecedor', render: (item) => item.fornecedor?.nome ?? `#${item.id}` },
    { cabecalho: 'Itens', render: (item) => `${item.itens?.length ?? 0} item(ns)` },
    { cabecalho: 'Total', render: (item) => formatadorMoeda.format(item.total) },
  ];

  return (
    <div>
      <PageHeader
        titulo="Compras"
        subtitulo="Pedidos de compra junto a fornecedores"
        rotuloAcao="Nova compra"
        aoClicarAcao={() => setModalAberto(true)}
      />

      {erro && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}

      <DataTable
        colunas={colunas}
        itens={compras}
        carregando={carregando}
        chave={(item) => item.id}
        mensagemVazio="Nenhuma compra registrada ainda."
        busca={{ placeholder: 'Buscar por fornecedor', camposBusca: (item) => [item.fornecedor?.nome] }}
      />

      <Modal aberto={modalAberto} titulo="Nova compra" aoFechar={() => setModalAberto(false)} largura="lg">
        <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Fornecedor</label>
            <select required className={classesCampo} value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)}>
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
          </div>

          <ItensPedidoEditor itens={itensPedido} produtos={produtos} aoAlterar={setItensPedido} />

          <div className="flex justify-end border-t border-ink-100 pt-4 text-right">
            <div>
              <p className="text-xs text-ink-500">Total</p>
              <p className="text-lg font-semibold text-ink-900">{formatadorMoeda.format(totalCalculado)}</p>
            </div>
          </div>

          {erroFormulario && <p className="text-sm text-red-500">{erroFormulario}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setModalAberto(false)} className={classesBotaoSecundario}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando} className={classesBotaoPrimario}>
              {salvando ? 'Salvando...' : 'Salvar compra'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
