import { useState, type FormEvent } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable, type ColunaTabela } from '../components/DataTable/DataTable';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useRecurso, extrairMensagemErro } from '../lib/hooks/useRecurso';
import { classesBotaoPrimario, classesBotaoSecundario, classesCampo, classesRotulo } from '../lib/estilos';
import { formatarData } from '../lib/formatadores';

type TipoMovimentacao = 'ENTRADA' | 'SAIDA' | 'AJUSTE';

interface Produto {
  id: number;
  nome: string;
}

interface Movimentacao {
  id: number;
  produtoId: number;
  produto?: Produto;
  tipo: TipoMovimentacao;
  quantidade: number;
  motivo?: string;
  createdAt: string;
}

interface FormularioMovimentacao {
  produtoId: string;
  tipo: TipoMovimentacao;
  quantidade: string;
  motivo: string;
}

const formularioVazio: FormularioMovimentacao = { produtoId: '', tipo: 'ENTRADA', quantidade: '', motivo: '' };

const tonsTipo: Record<TipoMovimentacao, 'verde' | 'vermelho' | 'ambar'> = {
  ENTRADA: 'verde',
  SAIDA: 'vermelho',
  AJUSTE: 'ambar',
};

const rotulosTipo: Record<TipoMovimentacao, string> = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída',
  AJUSTE: 'Ajuste',
};

export function Estoque() {
  const { itens, carregando, erro, criar } = useRecurso<Movimentacao>('/estoque');
  const { itens: produtos } = useRecurso<Produto>('/produtos');

  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState<FormularioMovimentacao>(formularioVazio);
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  function campo<K extends keyof FormularioMovimentacao>(nomeCampo: K, valor: FormularioMovimentacao[K]) {
    setFormulario((atual) => ({ ...atual, [nomeCampo]: valor }));
  }

  async function aoSubmeter(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErroFormulario(null);
    try {
      await criar({
        produtoId: Number(formulario.produtoId),
        tipo: formulario.tipo,
        quantidade: Number(formulario.quantidade),
        motivo: formulario.motivo || undefined,
      });
      setModalAberto(false);
      setFormulario(formularioVazio);
    } catch (erroRequisicao) {
      setErroFormulario(extrairMensagemErro(erroRequisicao));
    } finally {
      setSalvando(false);
    }
  }

  const colunas: ColunaTabela<Movimentacao>[] = [
    { cabecalho: 'Produto', render: (item) => item.produto?.nome ?? `#${item.produtoId}` },
    { cabecalho: 'Tipo', render: (item) => <Badge texto={rotulosTipo[item.tipo]} tom={tonsTipo[item.tipo]} /> },
    { cabecalho: 'Quantidade', render: (item) => item.quantidade },
    { cabecalho: 'Motivo', render: (item) => item.motivo ?? '—' },
    { cabecalho: 'Data', render: (item) => formatarData(item.createdAt) },
  ];

  return (
    <div>
      <PageHeader
        titulo="Estoque"
        subtitulo="Histórico de movimentações de estoque"
        rotuloAcao="Nova movimentação"
        aoClicarAcao={() => setModalAberto(true)}
      />

      {erro && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>}

      <DataTable
        colunas={colunas}
        itens={itens}
        carregando={carregando}
        chave={(item) => item.id}
        mensagemVazio="Nenhuma movimentação registrada ainda."
        busca={{
          placeholder: 'Buscar por produto ou motivo',
          camposBusca: (item) => [item.produto?.nome, item.motivo],
        }}
      />

      <Modal aberto={modalAberto} titulo="Nova movimentação de estoque" aoFechar={() => setModalAberto(false)}>
        <form onSubmit={aoSubmeter} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Produto</label>
            <select required className={classesCampo} value={formulario.produtoId} onChange={(e) => campo('produtoId', e.target.value)}>
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Tipo</label>
              <select className={classesCampo} value={formulario.tipo} onChange={(e) => campo('tipo', e.target.value as TipoMovimentacao)}>
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
                <option value="AJUSTE">Ajuste (define o estoque)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={classesRotulo}>Quantidade</label>
              <input
                type="number"
                min="0"
                required
                className={classesCampo}
                value={formulario.quantidade}
                onChange={(e) => campo('quantidade', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={classesRotulo}>Motivo (opcional)</label>
            <input className={classesCampo} value={formulario.motivo} onChange={(e) => campo('motivo', e.target.value)} />
          </div>

          {erroFormulario && <p className="text-sm text-red-500">{erroFormulario}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setModalAberto(false)} className={classesBotaoSecundario}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando} className={classesBotaoPrimario}>
              {salvando ? 'Salvando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
