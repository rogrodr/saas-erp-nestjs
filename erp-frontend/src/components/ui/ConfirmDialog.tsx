import { Modal } from './Modal';

interface ConfirmDialogProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  carregando?: boolean;
  aoConfirmar: () => void;
  aoFechar: () => void;
}

export function ConfirmDialog({ aberto, titulo, mensagem, carregando, aoConfirmar, aoFechar }: ConfirmDialogProps) {
  return (
    <Modal aberto={aberto} titulo={titulo} aoFechar={aoFechar} largura="sm">
      <p className="text-sm text-ink-700">{mensagem}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={aoFechar}
          className="rounded-lg border border-ink-100 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
        >
          Cancelar
        </button>
        <button
          onClick={aoConfirmar}
          disabled={carregando}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {carregando ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </Modal>
  );
}
