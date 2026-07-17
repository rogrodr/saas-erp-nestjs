import { useEffect, useState } from 'react';
import { AlertTriangle, DollarSign, PackageSearch, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../lib/api';
import { StatCard } from '../components/ui/StatCard';
import { Panel } from '../components/ui/Panel';
import { useAuth } from '../context/AuthContext';

interface ProdutoMaisVendido {
  produtoId: string;
  nome?: string;
  quantidadeVendida: number | null;
}

interface AlertaEstoque {
  id: string;
  nome: string;
  estoque: number;
}

interface ResumoDashboard {
  faturamentoMensal: number;
  produtosMaisVendidos: ProdutoMaisVendido[];
  alertasEstoque: AlertaEstoque[];
  valorEmAtraso: number;
}

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function Dashboard() {
  const { usuario } = useAuth();
  const [resumo, setResumo] = useState<ResumoDashboard | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ResumoDashboard>('/dashboard')
      .then((resposta) => setResumo(resposta.data))
      .catch(() => setErro('Não foi possível carregar os dados do dashboard.'))
      .finally(() => setCarregando(false));
  }, []);

  const dadosGrafico =
    resumo?.produtosMaisVendidos.map((produto) => ({
      nome: produto.nome ?? '—',
      quantidade: produto.quantidadeVendida ?? 0,
    })) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-ink-900">
          Bem-vindo{usuario?.email ? `, ${usuario.email}` : ''}
        </h1>
        <p className="text-sm text-ink-500">Aqui está o resumo da sua empresa hoje.</p>
      </div>

      {erro && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{erro}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          titulo="Faturamento do mês"
          valor={carregando ? '—' : formatadorMoeda.format(resumo?.faturamentoMensal ?? 0)}
          icone={DollarSign}
          corIcone="brand"
        />
        <StatCard
          titulo="Contas a receber em atraso"
          valor={carregando ? '—' : formatadorMoeda.format(resumo?.valorEmAtraso ?? 0)}
          icone={AlertTriangle}
          corIcone="ambar"
        />
        <StatCard
          titulo="Produtos monitorados no estoque"
          valor={carregando ? '—' : String(resumo?.alertasEstoque.length ?? 0)}
          icone={PackageSearch}
          corIcone="verde"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel titulo="Produtos mais vendidos" className="xl:col-span-2">
          {dadosGrafico.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-ink-500">
              Ainda não há vendas suficientes para exibir este gráfico.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f5" vertical={false} />
                <XAxis dataKey="nome" tick={{ fontSize: 12, fill: '#8b91a5' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8b91a5' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f2f2f3' }} />
                <Bar dataKey="quantidade" fill="#16181d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel titulo="Alertas de estoque baixo">
          <ul className="flex flex-col divide-y divide-ink-100">
            {(resumo?.alertasEstoque ?? []).slice(0, 6).map((produto) => (
              <li key={produto.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-ink-900">{produto.nome}</span>
                <span className="text-sm font-semibold text-ink-500">{produto.estoque} un.</span>
              </li>
            ))}
            {!carregando && (resumo?.alertasEstoque.length ?? 0) === 0 && (
              <li className="py-2.5 text-sm text-ink-500">Nenhum produto cadastrado ainda.</li>
            )}
          </ul>
        </Panel>
      </div>

      <Panel
        titulo="Visão geral de vendas"
        acao={<TrendingUp size={18} className="text-ink-500" />}
      >
        <div className="flex h-40 items-center justify-center rounded-lg bg-ink-100/40 text-sm text-ink-500">
          Gráfico de evolução de vendas aparecerá aqui em breve.
        </div>
      </Panel>
    </div>
  );
}
