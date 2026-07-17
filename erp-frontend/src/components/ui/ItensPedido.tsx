import { Plus, Trash2 } from 'lucide-react';
import { classesCampo } from '../../lib/estilos';

export interface ItemPedido {
  produtoId: string;
  quantidade: string;
  preco: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface ItensPedidoEditorProps {
  itens: ItemPedido[];
  produtos: Produto[];
  aoAlterar: (itens: ItemPedido[]) => void;
}

export function ItensPedidoEditor({ itens, produtos, aoAlterar }: ItensPedidoEditorProps) {
  function atualizarItem(indice: number, campo: keyof ItemPedido, valor: string) {
    const novosItens = itens.map((item, i) => {
      if (i !== indice) return item;
      const itemAtualizado = { ...item, [campo]: valor };
      if (campo === 'produtoId') {
        const produto = produtos.find((p) => String(p.id) === valor);
        if (produto && !itemAtualizado.preco) {
          itemAtualizado.preco = String(produto.preco);
        }
      }
      return itemAtualizado;
    });
    aoAlterar(novosItens);
  }

  function adicionarItem() {
    aoAlterar([...itens, { produtoId: '', quantidade: '1', preco: '' }]);
  }

  function removerItem(indice: number) {
    aoAlterar(itens.filter((_, i) => i !== indice));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[1fr_90px_110px_32px] gap-2 text-xs font-medium text-ink-500">
        <span>Produto</span>
        <span>Qtd.</span>
        <span>Preço unit.</span>
        <span />
      </div>

      {itens.map((item, indice) => (
        <div key={indice} className="grid grid-cols-[1fr_90px_110px_32px] items-center gap-2">
          <select
            required
            className={classesCampo}
            value={item.produtoId}
            onChange={(e) => atualizarItem(indice, 'produtoId', e.target.value)}
          >
            <option value="">Selecione</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            required
            className={classesCampo}
            value={item.quantidade}
            onChange={(e) => atualizarItem(indice, 'quantidade', e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            min="0"
            required
            className={classesCampo}
            value={item.preco}
            onChange={(e) => atualizarItem(indice, 'preco', e.target.value)}
          />
          <button
            type="button"
            onClick={() => removerItem(indice)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={adicionarItem}
        className="mt-1 flex items-center gap-1.5 self-start rounded-lg px-2 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50"
      >
        <Plus size={15} />
        Adicionar item
      </button>
    </div>
  );
}
