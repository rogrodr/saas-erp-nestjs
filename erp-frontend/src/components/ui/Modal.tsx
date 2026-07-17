import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  aberto: boolean;
  titulo: string;
  aoFechar: () => void;
  children: ReactNode;
  largura?: 'sm' | 'md' | 'lg';
}

const larguras = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ aberto, titulo, aoFechar, children, largura = 'md' }: ModalProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4">
      <div className="absolute inset-0" onClick={aoFechar} />
      <div className={`relative z-10 w-full ${larguras[largura]} rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h2 className="text-base font-semibold text-ink-900">{titulo}</h2>
          <button onClick={aoFechar} className="rounded-full p-1.5 text-ink-500 hover:bg-ink-100">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
