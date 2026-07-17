import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { extrairMensagemErro } from '../lib/hooks/useRecurso';
import { AuthLayout } from '../components/layout/AuthLayout';
import { classesBotaoPrimario, classesCampo, classesRotulo } from '../lib/estilos';

export function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [enviandoSolicitacao, setEnviandoSolicitacao] = useState(false);
  const [mensagemSolicitacao, setMensagemSolicitacao] = useState<string | null>(null);
  const [erroSolicitacao, setErroSolicitacao] = useState<string | null>(null);

  const [token, setToken] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [redefinindo, setRedefinindo] = useState(false);
  const [mensagemRedefinicao, setMensagemRedefinicao] = useState<string | null>(null);
  const [erroRedefinicao, setErroRedefinicao] = useState<string | null>(null);

  async function aoSolicitar(evento: FormEvent) {
    evento.preventDefault();
    setEnviandoSolicitacao(true);
    setErroSolicitacao(null);
    setMensagemSolicitacao(null);
    try {
      const { data } = await api.post<{ message: string }>('/auth/recuperar-senha', { email });
      setMensagemSolicitacao(data.message);
    } catch (erroRequisicao) {
      setErroSolicitacao(extrairMensagemErro(erroRequisicao));
    } finally {
      setEnviandoSolicitacao(false);
    }
  }

  async function aoRedefinir(evento: FormEvent) {
    evento.preventDefault();
    setErroRedefinicao(null);
    setMensagemRedefinicao(null);

    if (novaSenha !== confirmarSenha) {
      setErroRedefinicao('As senhas não coincidem.');
      return;
    }

    setRedefinindo(true);
    try {
      const { data } = await api.post<{ message: string }>('/auth/redefinir-senha', { token, novaSenha });
      setMensagemRedefinicao(data.message);
      setToken('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (erroRequisicao) {
      setErroRedefinicao(extrairMensagemErro(erroRequisicao));
    } finally {
      setRedefinindo(false);
    }
  }

  return (
    <AuthLayout largura="md">
      <h1 className="mb-1 text-2xl font-semibold text-ink-900 md:hidden">
        <span className="text-ink-900">RSON</span> <span className="text-ink-500">ERP</span>
      </h1>
      <h2 className="text-lg font-semibold text-ink-900">Recuperar senha</h2>

      <div className="my-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        <strong className="font-semibold">Aviso:</strong> o envio de e-mail ainda é simulado no backend (o
        código aparece só no console do servidor, não chega numa caixa de entrada real). Antes de colocar
        isso em produção, configure um provedor de e-mail de verdade (Resend, SendGrid, SMTP, etc.) no
        backend — senão ninguém vai conseguir recuperar a senha fora do ambiente de desenvolvimento.
      </div>

      <form onSubmit={aoSolicitar} className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">1. Solicitar código de recuperação</p>
        <div className="flex flex-col gap-1.5">
          <label className={classesRotulo}>E-mail</label>
          <input
            type="email"
            required
            className={classesCampo}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@empresa.com"
          />
        </div>

        {erroSolicitacao && <p className="text-sm text-red-500">{erroSolicitacao}</p>}
        {mensagemSolicitacao && <p className="text-sm text-emerald-600">{mensagemSolicitacao}</p>}

        <button type="submit" disabled={enviandoSolicitacao} className={classesBotaoPrimario}>
          {enviandoSolicitacao && <Loader2 size={16} className="animate-spin" />}
          Enviar código
        </button>
      </form>

      <form onSubmit={aoRedefinir} className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">2. Redefinir senha com o código</p>

        <div className="flex flex-col gap-1.5">
          <label className={classesRotulo}>Código recebido</label>
          <input required className={classesCampo} value={token} onChange={(e) => setToken(e.target.value)} placeholder="Cole o código aqui" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Nova senha</label>
            <input
              type="password"
              required
              minLength={6}
              className={classesCampo}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Confirmar senha</label>
            <input
              type="password"
              required
              minLength={6}
              className={classesCampo}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
        </div>

        {erroRedefinicao && <p className="text-sm text-red-500">{erroRedefinicao}</p>}
        {mensagemRedefinicao && <p className="text-sm text-emerald-600">{mensagemRedefinicao}</p>}

        <button type="submit" disabled={redefinindo} className={classesBotaoPrimario}>
          {redefinindo && <Loader2 size={16} className="animate-spin" />}
          Redefinir senha
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Voltar para o login
        </Link>
      </p>
    </AuthLayout>
  );
}
