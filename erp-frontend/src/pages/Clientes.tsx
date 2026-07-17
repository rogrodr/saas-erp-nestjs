import { useState, type FormEvent } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useRecurso, extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';

interface EnderecoCliente {
  logradouro: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

interface ContatoCliente {
  nome: string;
  telefone?: string;
  email?: string;
}

interface Cliente {
  id: number;
  nome: string;
  cpf?: string;
  enderecos?: EnderecoCliente[];
  contatos?: ContatoCliente[];
}

interface FormularioCliente {
  nome: string;
  cpf: string;
  cidade: string;
  estado: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  contatoNome: string;
  contatoTelefone: string;
  contatoEmail: string;
}

const formularioVazio: FormularioCliente = {
  nome: '',
  cpf: '',
  cidade: '',
  estado: '',
  logradouro: '',
  numero: '',
  bairro: '',
  cep: '',
  contatoNome: '',
  contatoTelefone: '',
  contatoEmail: '',
};

const colunas: ColunaTabela<Cliente>[] = [
  { cabecalho: 'Nome', render: (item) => item.nome },
  { cabecalho: 'CPF', render: (item) => item.cpf ?? '—' },
  { cabecalho: 'Cidade', render: (item) => item.enderecos?.[0]?.cidade ?? '—' },
  { cabecalho: 'Contato', render: (item) => item.contatos?.[0]?.telefone ?? item.contatos?.[0]?.email ?? '—' },
];

export function Clientes() {
  const { itens, carregando, erro, criar, atualizar, remover } = useRecurso<Cliente>('/clientes');

  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [formulario, setFormulario] = useState<FormularioCliente>(formularioVazio);
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  function campo(nomeCampo: keyof FormularioCliente, valor: string) {
    setFormulario((atual) => ({ ...atual, [nomeCampo]: valor }));
  }

  function abrirCriacao() {
    setClienteEditando(null);
    setFormulario(formularioVazio);
    setErroFormulario(null);
    setModalAberto(true);
  }

  function abrirEdicao(cliente: Cliente) {
    setClienteEditando(cliente);
    setFormulario({
      ...formularioVazio,
      nome: cliente.nome,
      cpf: cliente.cpf ?? '',
    });
    setErroFormulario(null);
    setModalAberto(true);
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErroFormulario(null);
    try {
      if (clienteEditando) {
        // A atualização no backend não suporta reescrever endereços/contatos aninhados,
        // então aqui só reenviamos os dados básicos do cliente.
        await atualizar(clienteEditando.id, { nome: formulario.nome, cpf: formulario.cpf || undefined });
      } else {
        const enderecos = formulario.logradouro
          ? [
              {
                logradouro: formulario.logradouro,
                numero: formulario.numero || undefined,
                bairro: formulario.bairro || undefined,
                cidade: formulario.cidade || undefined,
                estado: formulario.estado || undefined,
                cep: formulario.cep || undefined,
                principal: true,
              },
            ]
          : undefined;

        const contatos = formulario.contatoNome
          ? [
              {
                nome: formulario.contatoNome,
                telefone: formulario.contatoTelefone || undefined,
                email: formulario.contatoEmail || undefined,
                principal: true,
              },
            ]
          : undefined;

        await criar({ nome: formulario.nome, cpf: formulario.cpf || undefined, enderecos, contatos } as Partial<Cliente>);
      }
      setModalAberto(false);
    } catch (erroRequisicao) {
      setErroFormulario(extrairMensagemErro(erroRequisicao));
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!clienteParaExcluir) return;
    setExcluindo(true);
    try {
      await remover(clienteParaExcluir.id);
      setClienteParaExcluir(null);
    } catch {
      // erro silencioso
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Clientes"
        subtitulo="Cadastro de clientes da empresa"
        rotuloAcao="Novo cliente"
        aoClicarAcao={abrirCriacao}
      />

      {erro && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}

      <DataTable
        colunas={colunas}
        itens={itens}
        carregando={carregando}
        chave={(item) => item.id}
        mensagemVazio="Nenhum cliente cadastrado ainda."
        busca={{
          placeholder: 'Buscar por nome, CPF ou cidade',
          camposBusca: (item) => [item.nome, item.cpf, item.enderecos?.[0]?.cidade],
        }}
        acoes={(item) => (
          <div className="flex items-center gap-1">
            <button onClick={() => abrirEdicao(item)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100">
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setClienteParaExcluir(item)}
              className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <Modal
        aberto={modalAberto}
        titulo={clienteEditando ? 'Editar cliente' : 'Novo cliente'}
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
              <label className={classesRotulo}>CPF</label>
              <input className={classesCampo} value={formulario.cpf} onChange={(e) => campo('cpf', e.target.value)} />
            </div>
          </div>

          {!clienteEditando && (
            <>
              <fieldset className="flex flex-col gap-3 border-t border-ink-100 pt-4">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Endereço (opcional)
                </legend>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    className={`${classesCampo} col-span-2`}
                    placeholder="Logradouro"
                    value={formulario.logradouro}
                    onChange={(e) => campo('logradouro', e.target.value)}
                  />
                  <input
                    className={classesCampo}
                    placeholder="Número"
                    value={formulario.numero}
                    onChange={(e) => campo('numero', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <input
                    className={`${classesCampo} col-span-2`}
                    placeholder="Bairro"
                    value={formulario.bairro}
                    onChange={(e) => campo('bairro', e.target.value)}
                  />
                  <input
                    className={classesCampo}
                    placeholder="Cidade"
                    value={formulario.cidade}
                    onChange={(e) => campo('cidade', e.target.value)}
                  />
                  <input
                    className={classesCampo}
                    placeholder="UF"
                    maxLength={2}
                    value={formulario.estado}
                    onChange={(e) => campo('estado', e.target.value.toUpperCase())}
                  />
                </div>
                <input
                  className={classesCampo}
                  placeholder="CEP"
                  value={formulario.cep}
                  onChange={(e) => campo('cep', e.target.value)}
                />
              </fieldset>

              <fieldset className="flex flex-col gap-3 border-t border-ink-100 pt-4">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Contato (opcional)
                </legend>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    className={classesCampo}
                    placeholder="Nome do contato"
                    value={formulario.contatoNome}
                    onChange={(e) => campo('contatoNome', e.target.value)}
                  />
                  <input
                    className={classesCampo}
                    placeholder="Telefone"
                    value={formulario.contatoTelefone}
                    onChange={(e) => campo('contatoTelefone', e.target.value)}
                  />
                  <input
                    className={classesCampo}
                    placeholder="E-mail"
                    value={formulario.contatoEmail}
                    onChange={(e) => campo('contatoEmail', e.target.value)}
                  />
                </div>
              </fieldset>
            </>
          )}

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
        aberto={Boolean(clienteParaExcluir)}
        titulo="Excluir cliente"
        mensagem={`Tem certeza que deseja excluir "${clienteParaExcluir?.nome}"? Essa ação não pode ser desfeita.`}
        carregando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoFechar={() => setClienteParaExcluir(null)}
      />
    </div>
  );
}
