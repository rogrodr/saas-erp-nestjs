import { useEffect, useState, type FormEvent } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesCampo, classesRotulo } from '../lib/estilos';

interface Empresa {
  id: number;
  nome: string;
  cnpj?: string;
  createdAt?: string;
}

export function Empresa() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    api
      .get<Empresa>('/empresa/minha')
      .then((resposta) => {
        setEmpresa(resposta.data);
        setNome(resposta.data.nome);
        setCnpj(resposta.data.cnpj ?? '');
      })
      .catch((erroRequisicao) => setErro(extrairMensagemErro(erroRequisicao)))
      .finally(() => setCarregando(false));
  }, []);

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErro(null);
    setSucesso(false);
    try {
      const { data } = await api.patch<Empresa>('/empresa/minha', { nome, cnpj: cnpj || undefined });
      setEmpresa(data);
      setSucesso(true);
    } catch (erroRequisicao) {
      setErro(extrairMensagemErro(erroRequisicao));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex h-64 items-center justify-center text-ink-500">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink-900">Empresa</h1>
        <p className="text-sm text-ink-500">Dados cadastrais da sua empresa</p>
      </div>

      <div className="max-w-lg rounded-xl border border-ink-100 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">{empresa?.nome}</p>
            <p className="text-xs text-ink-500">Empresa #{empresa?.id}</p>
          </div>
        </div>

        <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Nome da empresa</label>
            <input required className={classesCampo} value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>CNPJ</label>
            <input className={classesCampo} value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" />
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}
          {sucesso && <p className="text-sm text-emerald-600">Dados atualizados com sucesso.</p>}

          <button type="submit" disabled={salvando} className={`${classesBotaoPrimario} self-start`}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
