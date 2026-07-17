import { Search } from 'lucide-react';

interface SearchBarProps {
  valor: string;
  aoAlterar: (valor: string) => void;
  placeholder?: string;
}

export function SearchBar({ valor, aoAlterar, placeholder }: SearchBarProps) {
  return (
    <div className="flex w-full max-w-xs items-center gap-2 rounded-lg border border-ink-100 bg-white px-3 py-2">
      <Search size={16} className="text-ink-500" />
      <input
        type="text"
        value={valor}
        onChange={(evento) => aoAlterar(evento.target.value)}
        placeholder={placeholder ?? 'Buscar...'}
        className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none"
      />
    </div>
  );
}
