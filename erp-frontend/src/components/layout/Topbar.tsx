import { Bell, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Topbar() {
  const { usuario, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-ink-100 bg-white px-6">
      <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-ink-100 bg-ink-100/40 px-3 py-2">
        <Search size={16} className="text-ink-500" />
        <input
          type="text"
          placeholder="Buscar"
          className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-ink-500 hover:bg-ink-100">
          <Bell size={19} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-600" />
        </button>

        <div className="flex items-center gap-3 border-l border-ink-100 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {usuario?.email?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-semibold text-ink-900">{usuario?.email ?? 'Usuário'}</p>
            <p className="text-xs text-ink-500">{usuario?.role ?? '—'}</p>
          </div>
          <button
            onClick={logout}
            title="Sair"
            className="rounded-full p-2 text-ink-500 hover:bg-ink-100"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
