import { useState, type FormEvent } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Badge } from '../components/ui/Badge';
import { useRecurso, extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';
import { formatarData } from '../lib/formatadores';

type Papel = 'ADMIN' | 'GERENTE' | 'FUNCIONARIO';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: Papel;
  createdAt: string;
}

interface FormularioUsuario {
  nome: string;
  email: string;
  senha: string;
  role: Papel;
}

const formularioVazio: FormularioUsuario = { nome: '', email: '', senha: '', role: 'FUNCIONARIO' };

const tonsPapel: Record<Papel, 'azul' | 'ambar' | 'cinza'> = {
  ADMIN: 'azul',
  GERENTE: 'ambar',
  FUNCIONARIO: 'cinza',
};

const colunas: ColunaTabela<Usuario>[] = [
  { cabecalho: 'Nome', render: (item) => item.nome },
  { cabecalho: 'E-mail', render: (item) => item.email },
  { cabecalho: 'Papel', render: (item) => <Badge texto={item.role} tom={tonsPapel[item.role]} /> },
  { cabecalho: 'Criado em', render: (item) => formatarData(item.createdAt) },
];

export function Usuarios() {
  const { itens, carregando, erro, criar, atualizar, remover } = useRecurso<Usuario>('/usuarios');

  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [formulario, setFormulario] = useState<FormularioUsuario>(formularioVazio);
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  function abrirCriacao() {
    setUsuarioEditando(null);
    setFormulario(formularioVazio);
    setErroFormulario(null);
    setModalAberto(true);
  }

  function abrirEdicao(usuario: Usuario) {
    setUsuarioEditando(usuario);
    setFormulario({ nome: usuario.nome, email: usuario.email, senha: '', role: usuario.role });
    setErroFormulario(null);
    setModalAberto(true);
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErroFormulario(null);
    try {
      if (usuarioEditando) {
        const payload: Partial<FormularioUsuario> = { ...formulario };
        if (!payload.senha) delete payload.senha;
        await atualizar(usuarioEditando.id, payload);
      } else {
        await criar(formulario);
      }
      setModalAberto(false);
    } catch (erroRequisicao) {
      setErroFormulario(extrairMensagemErro(erroRequisicao));
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!usuarioParaExcluir) return;
    setExcluindo(true);
    try {
      await remover(usuarioParaExcluir.id);
      setUsuarioParaExcluir(null);
    } catch {
      // erro silencioso; poderia exibir um toast aqui
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Usuários"
        subtitulo="Gerencie os usuários da sua empresa"
        rotuloAcao="Novo usuário"
        aoClicarAcao={abrirCriacao}
      />

      {erro && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}

      <DataTable
        colunas={colunas}
        itens={itens}
        carregando={carregando}
        chave={(item) => item.id}
        mensagemVazio="Nenhum usuário cadastrado ainda."
        busca={{ placeholder: 'Buscar por nome, e-mail ou papel', camposBusca: (item) => [item.nome, item.email, item.role] }}
        acoes={(item) => (
          <div className="flex items-center gap-1">
            <button onClick={() => abrirEdicao(item)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100">
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setUsuarioParaExcluir(item)}
              className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <Modal
        aberto={modalAberto}
        titulo={usuarioEditando ? 'Editar usuário' : 'Novo usuário'}
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

          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>E-mail</label>
            <input
              type="email"
              required
              className={classesCampo}
              value={formulario.email}
              onChange={(evento) => setFormulario((atual) => ({ ...atual, email: evento.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>
              Senha {usuarioEditando && <span className="font-normal text-ink-500">(deixe em branco para manter)</span>}
            </label>
            <input
              type="password"
              minLength={6}
              required={!usuarioEditando}
              className={classesCampo}
              value={formulario.senha}
              onChange={(evento) => setFormulario((atual) => ({ ...atual, senha: evento.target.value }))}
              placeholder={usuarioEditando ? '••••••••' : 'Mínimo 6 caracteres'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Papel</label>
            <select
              className={classesCampo}
              value={formulario.role}
              onChange={(evento) => setFormulario((atual) => ({ ...atual, role: evento.target.value as Papel }))}
            >
              <option value="ADMIN">Admin</option>
              <option value="GERENTE">Gerente</option>
              <option value="FUNCIONARIO">Funcionário</option>
            </select>
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

      <ConfirmDialog
        aberto={Boolean(usuarioParaExcluir)}
        titulo="Excluir usuário"
        mensagem={`Tem certeza que deseja excluir "${usuarioParaExcluir?.nome}"? Essa ação não pode ser desfeita.`}
        carregando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoFechar={() => setUsuarioParaExcluir(null)}
      />
    </div>
  );
}
