import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface FormularioCadastro {
  nomeEmpresa: string;
  cnpj: string;
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

const formularioVazio: FormularioCadastro = {
  nomeEmpresa: '',
  cnpj: '',
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
};

export function Cadastro() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState<FormularioCadastro>(formularioVazio);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function atualizarCampo(campo: keyof FormularioCadastro, valor: string) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);

    if (formulario.senha !== formulario.confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/auth/register-empresa', {
        nomeEmpresa: formulario.nomeEmpresa,
        cnpj: formulario.cnpj || undefined,
        nome: formulario.nome,
        email: formulario.email,
        senha: formulario.senha,
      });
      navigate('/login', { state: { cadastroRealizado: true } });
    } catch (erroRequisicao: any) {
      const mensagem = erroRequisicao?.response?.data?.message;
      setErro(Array.isArray(mensagem) ? mensagem[0] : mensagem ?? 'Não foi possível criar a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-ink-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600">
            <Layers size={22} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-ink-900">Criar conta no Meu ERP</h1>
          <p className="text-center text-sm text-ink-500">
            Cadastre sua empresa e crie o usuário administrador
          </p>
        </div>

        <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">
              Dados da empresa
            </legend>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">Nome da empresa</label>
              <input
                type="text"
                required
                value={formulario.nomeEmpresa}
                onChange={(evento) => atualizarCampo('nomeEmpresa', evento.target.value)}
                className="rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="Minha Empresa Ltda"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">CNPJ (opcional)</label>
              <input
                type="text"
                value={formulario.cnpj}
                onChange={(evento) => atualizarCampo('cnpj', evento.target.value)}
                className="rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="00.000.000/0001-00"
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4 border-t border-ink-100 pt-4">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">
              Usuário administrador
            </legend>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">Seu nome</label>
              <input
                type="text"
                required
                value={formulario.nome}
                onChange={(evento) => atualizarCampo('nome', evento.target.value)}
                className="rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">E-mail</label>
              <input
                type="email"
                required
                value={formulario.email}
                onChange={(evento) => atualizarCampo('email', evento.target.value)}
                className="rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                placeholder="voce@empresa.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-700">Senha</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formulario.senha}
                  onChange={(evento) => atualizarCampo('senha', evento.target.value)}
                  className="rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-700">Confirmar senha</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formulario.confirmarSenha}
                  onChange={(evento) => atualizarCampo('confirmarSenha', evento.target.value)}
                  className="rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  placeholder="Repita a senha"
                />
              </div>
            </div>
          </fieldset>

          {erro && <p className="text-sm text-red-500">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {carregando && <Loader2 size={16} className="animate-spin" />}
            Criar empresa e conta
          </button>

          <p className="text-center text-sm text-ink-500">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
