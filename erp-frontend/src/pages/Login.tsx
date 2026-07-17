import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { classesBotaoPrimario, classesCampo, classesRotulo } from '../lib/estilos';

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
    <AuthLayout>
      <h1 className="mb-1 text-2xl font-semibold text-ink-900 md:hidden">
        <span className="text-ink-900">RSON</span> <span className="text-ink-500">ERP</span>
      </h1>
      <h2 className="text-lg font-semibold text-ink-900">Entrar</h2>
      <p className="mb-6 text-sm text-ink-500">Acesse com suas credenciais</p>

      {cadastroRealizado && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Empresa criada com sucesso! Faça login para continuar.
        </div>
      )}

      <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={classesRotulo}>E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            className={classesCampo}
            placeholder="voce@empresa.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className={classesRotulo}>Senha</label>
            <Link to="/recuperar-senha" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Esqueci minha senha
            </Link>
          </div>
          <input
            type="password"
            required
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            className={classesCampo}
            placeholder="••••••••"
          />
        </div>

        {erro && <p className="text-sm text-red-500">{erro}</p>}

        <button type="submit" disabled={carregando} className={`mt-2 ${classesBotaoPrimario}`}>
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
    </AuthLayout>
  );
}
