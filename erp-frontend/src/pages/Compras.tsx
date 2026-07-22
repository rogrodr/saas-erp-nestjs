import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { FileUp } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { ItensPedidoEditor, type ItemPedido } from '../components/ui/ItensPedido';
import { useRecurso, extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';
import { formatadorMoeda } from '../lib/formatadores';
import { api } from '../lib/api';

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

interface ItemPreviewXml {
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  produtoIdSugerido: number | null;
  produtoNomeSugerido: string | null;
}

interface PreviewImportacaoXml {
  fornecedor: { cnpj: string; nome: string; fornecedorIdSugerido: number | null };
  itens: ItemPreviewXml[];
  valorTotal: number;
}

export function Compras() {
  const { itens: compras, carregando, erro, criar } = useRecurso<Compra>('/compras');
  const { itens: produtos } = useRecurso<Produto>('/produtos');
  const { itens: fornecedores } = useRecurso<Fornecedor>('/fornecedores');

  // --- Modal de compra manual ---
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

  // --- Modal de importação de XML (NF-e) ---
  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const [xmlModalAberto, setXmlModalAberto] = useState(false);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [lendoXml, setLendoXml] = useState(false);
  const [erroXml, setErroXml] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewImportacaoXml | null>(null);
  const [fornecedorIdXml, setFornecedorIdXml] = useState('');
  const [itensXml, setItensXml] = useState<ItemPedido[]>([]);
  const [confirmandoXml, setConfirmandoXml] = useState(false);

  function abrirModalXml() {
    setPreview(null);
    setNomeArquivo('');
    setErroXml(null);
    setFornecedorIdXml('');
    setItensXml([]);
    setXmlModalAberto(true);
  }

  async function aoSelecionarArquivo(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    setNomeArquivo(arquivo.name);
    setLendoXml(true);
    setErroXml(null);
    setPreview(null);

    try {
      const textoXml = await arquivo.text();
      const { data } = await api.post<PreviewImportacaoXml>('/compras/importar-xml', { xml: textoXml });
      setPreview(data);
      setFornecedorIdXml(data.fornecedor.fornecedorIdSugerido ? String(data.fornecedor.fornecedorIdSugerido) : '');
      setItensXml(
        data.itens.map((item) => ({
          produtoId: item.produtoIdSugerido ? String(item.produtoIdSugerido) : '',
          quantidade: String(item.quantidade),
          preco: String(item.valorUnitario),
        })),
      );
    } catch (erroRequisicao) {
      setErroXml(extrairMensagemErro(erroRequisicao));
    } finally {
      setLendoXml(false);
    }
  }

  const totalCalculadoXml = itensXml.reduce(
    (soma, item) => soma + (Number(item.quantidade) || 0) * (Number(item.preco) || 0),
    0,
  );

  async function confirmarImportacaoXml(evento: FormEvent) {
    evento.preventDefault();
    setConfirmandoXml(true);
    setErroXml(null);
    try {
      await criar({
        fornecedorId: Number(fornecedorIdXml),
        total: totalCalculadoXml,
        itens: itensXml.map((item) => ({
          produtoId: Number(item.produtoId),
          quantidade: Number(item.quantidade),
          preco: Number(item.preco),
        })),
      } as Partial<Compra>);
      setXmlModalAberto(false);
    } catch (erroRequisicao) {
      setErroXml(extrairMensagemErro(erroRequisicao));
    } finally {
      setConfirmandoXml(false);
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
        acaoExtra={
          <button onClick={abrirModalXml} className={classesBotaoSecundario}>
            <FileUp size={16} />
            Importar XML
          </button>
        }
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

      {/* Modal: nova compra manual */}
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

      {/* Modal: importar XML de NF-e */}
      <Modal aberto={xmlModalAberto} titulo="Importar compra via XML (NF-e)" aoFechar={() => setXmlModalAberto(false)} largura="lg">
        <div className="flex flex-col gap-4">
          <div>
            <input
              ref={inputArquivoRef}
              type="file"
              accept=".xml,text/xml"
              className="hidden"
              onChange={aoSelecionarArquivo}
            />
            <button type="button" onClick={() => inputArquivoRef.current?.click()} className={classesBotaoSecundario}>
              <FileUp size={16} />
              {nomeArquivo || 'Selecionar arquivo XML da NF-e'}
            </button>
          </div>

          {lendoXml && <p className="text-sm text-ink-500">Lendo e interpretando o XML...</p>}
          {erroXml && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erroXml}</div>}

          {preview && (
            <form onSubmit={confirmarImportacaoXml} className="flex flex-col gap-4 border-t border-ink-100 pt-4">
              <div className="flex flex-col gap-1.5">
                <label className={classesRotulo}>
                  Fornecedor identificado na nota: <span className="font-normal text-ink-500">{preview.fornecedor.nome} (CNPJ {preview.fornecedor.cnpj})</span>
                </label>
                <select required className={classesCampo} value={fornecedorIdXml} onChange={(e) => setFornecedorIdXml(e.target.value)}>
                  <option value="">Selecione o fornecedor correspondente</option>
                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
                {!preview.fornecedor.fornecedorIdSugerido && (
                  <p className="text-xs text-amber-700">
                    Não encontramos um fornecedor cadastrado com esse CNPJ — cadastre-o em Fornecedores ou selecione o mais próximo.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 rounded-lg border border-ink-100 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Itens identificados na nota</p>
                {preview.itens.map((item, indice) => (
                  <div key={indice} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-ink-900">
                      {item.codigo} — {item.descricao} ({item.quantidade} un. × {formatadorMoeda.format(item.valorUnitario)})
                    </span>
                    {item.produtoIdSugerido ? (
                      <Badge texto={`= ${item.produtoNomeSugerido}`} tom="verde" />
                    ) : (
                      <Badge texto="Produto não encontrado" tom="ambar" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={classesRotulo}>Confirme/ajuste os produtos antes de importar</label>
                <ItensPedidoEditor itens={itensXml} produtos={produtos} aoAlterar={setItensXml} />
              </div>

              <div className="flex justify-end border-t border-ink-100 pt-4 text-right">
                <div>
                  <p className="text-xs text-ink-500">Total</p>
                  <p className="text-lg font-semibold text-ink-900">{formatadorMoeda.format(totalCalculadoXml)}</p>
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setXmlModalAberto(false)} className={classesBotaoSecundario}>
                  Cancelar
                </button>
                <button type="submit" disabled={confirmandoXml} className={classesBotaoPrimario}>
                  {confirmandoXml ? 'Importando...' : 'Confirmar importação'}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
