import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layers, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cadastroRealizado = Boolean((location.state as { cadastroRealizado?: boolean } | null)?.cadastroRealizado);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/');
    } catch {
      setErro('E-mail ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6fb] px-4">
      <div className="w-full max-w-sm rounded-xl border border-ink-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600">
            <Layers size={22} className="text-white" />
          </div>
          <h1 className="text-lg font-semibold text-ink-900">Acessar o Meu ERP</h1>
          <p className="text-sm text-ink-500">Entre com suas credenciais</p>
        </div>

        {cadastroRealizado && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            Empresa criada com sucesso! Faça login para continuar.
          </div>
        )}

        <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-700">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              className="rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="voce@empresa.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-ink-700">Senha</label>
              <Link to="/recuperar-senha" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                Esqueci minha senha
              </Link>
            </div>
            <input
              type="password"
              required
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              className="rounded-lg border border-ink-100 px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="••••••••"
            />
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {carregando && <Loader2 size={16} className="animate-spin" />}
            Entrar
          </button>

          <p className="text-center text-sm text-ink-500">
            Ainda não tem uma empresa cadastrada?{' '}
            <Link to="/cadastro" className="font-medium text-brand-600 hover:text-brand-700">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
