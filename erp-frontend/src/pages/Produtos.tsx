import { useState, type FormEvent } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Badge } from '../components/ui/Badge';
import { useRecurso, extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';
import { formatadorMoeda } from '../lib/formatadores';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  sku?: string;
  categoria?: string;
  estoque: number;
  estoqueMin: number;
  ativo: boolean;
}

interface FormularioProduto {
  nome: string;
  preco: string;
  sku: string;
  categoria: string;
  estoque: string;
  estoqueMin: string;
  ativo: boolean;
}

const formularioVazio: FormularioProduto = {
  nome: '',
  preco: '',
  sku: '',
  categoria: '',
  estoque: '0',
  estoqueMin: '0',
  ativo: true,
};

function paraFormulario(produto: Produto): FormularioProduto {
  return {
    nome: produto.nome,
    preco: String(produto.preco),
    sku: produto.sku ?? '',
    categoria: produto.categoria ?? '',
    estoque: String(produto.estoque ?? 0),
    estoqueMin: String(produto.estoqueMin ?? 0),
    ativo: produto.ativo,
  };
}

function paraPayload(formulario: FormularioProduto) {
  return {
    nome: formulario.nome,
    preco: Number(formulario.preco),
    sku: formulario.sku || undefined,
    categoria: formulario.categoria || undefined,
    estoque: Number(formulario.estoque),
    estoqueMin: Number(formulario.estoqueMin),
    ativo: formulario.ativo,
  };
}

const colunas: ColunaTabela<Produto>[] = [
  { cabecalho: 'Nome', render: (item) => item.nome },
  { cabecalho: 'SKU', render: (item) => item.sku ?? '—' },
  { cabecalho: 'Categoria', render: (item) => item.categoria ?? '—' },
  { cabecalho: 'Preço', render: (item) => formatadorMoeda.format(item.preco) },
  {
    cabecalho: 'Estoque',
    render: (item) => (
      <span className={item.estoque <= item.estoqueMin ? 'font-semibold text-amber-600' : ''}>
        {item.estoque} un.
      </span>
    ),
  },
  { cabecalho: 'Status', render: (item) => <Badge texto={item.ativo ? 'Ativo' : 'Inativo'} tom={item.ativo ? 'verde' : 'cinza'} /> },
];

export function Produtos() {
  const { itens, carregando, erro, criar, atualizar, remover } = useRecurso<Produto>('/produtos');

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [formulario, setFormulario] = useState<FormularioProduto>(formularioVazio);
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  function abrirCriacao() {
    setProdutoEditando(null);
    setFormulario(formularioVazio);
    setErroFormulario(null);
    setModalAberto(true);
  }

  function abrirEdicao(produto: Produto) {
    setProdutoEditando(produto);
    setFormulario(paraFormulario(produto));
    setErroFormulario(null);
    setModalAberto(true);
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErroFormulario(null);
    try {
      const payload = paraPayload(formulario);
      if (produtoEditando) {
        await atualizar(produtoEditando.id, payload);
      } else {
        await criar(payload);
      }
      setModalAberto(false);
    } catch (erroRequisicao) {
      setErroFormulario(extrairMensagemErro(erroRequisicao));
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!produtoParaExcluir) return;
    setExcluindo(true);
    try {
      await remover(produtoParaExcluir.id);
      setProdutoParaExcluir(null);
    } catch {
      // erro silencioso
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Produtos"
        subtitulo="Catálogo de produtos da empresa"
        rotuloAcao="Novo produto"
        aoClicarAcao={abrirCriacao}
      />

      {erro && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}

      <DataTable
        colunas={colunas}
        itens={itens}
        carregando={carregando}
        chave={(item) => item.id}
        mensagemVazio="Nenhum produto cadastrado ainda."
        busca={{ placeholder: 'Buscar por nome, SKU ou categoria', camposBusca: (item) => [item.nome, item.sku, item.categoria] }}
        acoes={(item) => (
          <div className="flex items-center gap-1">
            <button onClick={() => abrirEdicao(item)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100">
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setProdutoParaExcluir(item)}
              className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <Modal
        aberto={modalAberto}
        titulo={produtoEditando ? 'Editar produto' : 'Novo produto'}
        aoFechar={() => setModalAberto(false)}
      >
        <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Nome</label>
            <input
              required
              className={classesCampo}
              value={formulario.nome}
              onChange={(evento) => setFormulario((atual) => ({ ...atual, nome: evento.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Preço</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className={classesCampo}
                value={formulario.preco}
                onChange={(evento) => setFormulario((atual) => ({ ...atual, preco: evento.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>SKU</label>
              <input
                className={classesCampo}
                value={formulario.sku}
                onChange={(evento) => setFormulario((atual) => ({ ...atual, sku: evento.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Categoria</label>
            <input
              className={classesCampo}
              value={formulario.categoria}
              onChange={(evento) => setFormulario((atual) => ({ ...atual, categoria: evento.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Estoque atual</label>
              <input
                type="number"
                min="0"
                className={classesCampo}
                value={formulario.estoque}
                onChange={(evento) => setFormulario((atual) => ({ ...atual, estoque: evento.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Estoque mínimo</label>
              <input
                type="number"
                min="0"
                className={classesCampo}
                value={formulario.estoqueMin}
                onChange={(evento) => setFormulario((atual) => ({ ...atual, estoqueMin: evento.target.value }))}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={formulario.ativo}
              onChange={(evento) => setFormulario((atual) => ({ ...atual, ativo: evento.target.checked }))}
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-100"
            />
            Produto ativo
          </label>

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

      <ConfirmDialog
        aberto={Boolean(produtoParaExcluir)}
        titulo="Excluir produto"
        mensagem={`Tem certeza que deseja excluir "${produtoParaExcluir?.nome}"? Essa ação não pode ser desfeita.`}
        carregando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoFechar={() => setProdutoParaExcluir(null)}
      />
    </div>
  );
}
