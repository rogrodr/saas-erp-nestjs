import { useState, type FormEvent } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useRecurso, extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';

interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

type FormularioFornecedor = Omit<Fornecedor, 'id'>;

const formularioVazio: FormularioFornecedor = {
  nome: '',
  cnpj: '',
  telefone: '',
  email: '',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
};

const colunas: ColunaTabela<Fornecedor>[] = [
  { cabecalho: 'Nome', render: (item) => item.nome },
  { cabecalho: 'CNPJ', render: (item) => item.cnpj ?? '—' },
  { cabecalho: 'Telefone', render: (item) => item.telefone ?? '—' },
  { cabecalho: 'E-mail', render: (item) => item.email ?? '—' },
  { cabecalho: 'Cidade', render: (item) => item.cidade ?? '—' },
];

function limparVazios<T extends object>(objeto: T): Partial<T> {
  return Object.fromEntries(Object.entries(objeto).filter(([, valor]) => valor !== '')) as Partial<T>;
}

export function Fornecedores() {
  const { itens, carregando, erro, criar, atualizar, remover } = useRecurso<Fornecedor>('/fornecedores');

  const [modalAberto, setModalAberto] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);
  const [formulario, setFormulario] = useState<FormularioFornecedor>(formularioVazio);
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [fornecedorParaExcluir, setFornecedorParaExcluir] = useState<Fornecedor | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  function campo(nomeCampo: keyof FormularioFornecedor, valor: string) {
    setFormulario((atual) => ({ ...atual, [nomeCampo]: valor }));
  }

  function abrirCriacao() {
    setFornecedorEditando(null);
    setFormulario(formularioVazio);
    setErroFormulario(null);
    setModalAberto(true);
  }

  function abrirEdicao(fornecedor: Fornecedor) {
    setFornecedorEditando(fornecedor);
    setFormulario({
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj ?? '',
      telefone: fornecedor.telefone ?? '',
      email: fornecedor.email ?? '',
      endereco: fornecedor.endereco ?? '',
      numero: fornecedor.numero ?? '',
      bairro: fornecedor.bairro ?? '',
      cidade: fornecedor.cidade ?? '',
      estado: fornecedor.estado ?? '',
      cep: fornecedor.cep ?? '',
    });
    setErroFormulario(null);
    setModalAberto(true);
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErroFormulario(null);
    try {
      const payload = limparVazios(formulario);
      if (fornecedorEditando) {
        await atualizar(fornecedorEditando.id, payload);
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
    if (!fornecedorParaExcluir) return;
    setExcluindo(true);
    try {
      await remover(fornecedorParaExcluir.id);
      setFornecedorParaExcluir(null);
    } catch {
      // erro silencioso
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Fornecedores"
        subtitulo="Cadastro de fornecedores da empresa"
        rotuloAcao="Novo fornecedor"
        aoClicarAcao={abrirCriacao}
      />

      {erro && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}

      <DataTable
        colunas={colunas}
        itens={itens}
        carregando={carregando}
        chave={(item) => item.id}
        mensagemVazio="Nenhum fornecedor cadastrado ainda."
        busca={{
          placeholder: 'Buscar por nome, CNPJ ou cidade',
          camposBusca: (item) => [item.nome, item.cnpj, item.cidade],
        }}
        acoes={(item) => (
          <div className="flex items-center gap-1">
            <button onClick={() => abrirEdicao(item)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100">
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setFornecedorParaExcluir(item)}
              className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <Modal
        aberto={modalAberto}
        titulo={fornecedorEditando ? 'Editar fornecedor' : 'Novo fornecedor'}
        aoFechar={() => setModalAberto(false)}
        largura="lg"
      >
        <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Nome</label>
              <input required className={classesCampo} value={formulario.nome} onChange={(e) => campo('nome', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>CNPJ</label>
              <input className={classesCampo} value={formulario.cnpj} onChange={(e) => campo('cnpj', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Telefone</label>
              <input className={classesCampo} value={formulario.telefone} onChange={(e) => campo('telefone', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>E-mail</label>
              <input type="email" className={classesCampo} value={formulario.email} onChange={(e) => campo('email', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input
              className={`${classesCampo} col-span-2`}
              placeholder="Endereço"
              value={formulario.endereco}
              onChange={(e) => campo('endereco', e.target.value)}
            />
            <input className={classesCampo} placeholder="Número" value={formulario.numero} onChange={(e) => campo('numero', e.target.value)} />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <input
              className={`${classesCampo} col-span-2`}
              placeholder="Bairro"
              value={formulario.bairro}
              onChange={(e) => campo('bairro', e.target.value)}
            />
            <input className={classesCampo} placeholder="Cidade" value={formulario.cidade} onChange={(e) => campo('cidade', e.target.value)} />
            <input
              className={classesCampo}
              placeholder="UF"
              maxLength={2}
              value={formulario.estado}
              onChange={(e) => campo('estado', e.target.value.toUpperCase())}
            />
          </div>

          <input className={classesCampo} placeholder="CEP" value={formulario.cep} onChange={(e) => campo('cep', e.target.value)} />

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
        aberto={Boolean(fornecedorParaExcluir)}
        titulo="Excluir fornecedor"
        mensagem={`Tem certeza que deseja excluir "${fornecedorParaExcluir?.nome}"? Essa ação não pode ser desfeita.`}
        carregando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoFechar={() => setFornecedorParaExcluir(null)}
      />
    </div>
  );
}
