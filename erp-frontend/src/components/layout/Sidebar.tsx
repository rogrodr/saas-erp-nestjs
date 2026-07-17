import { NavLink } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight, Layers } from 'lucide-react';
import clsx from 'clsx';
import { itensNavegacao } from '../../lib/navegacao';

interface SidebarProps {
  recolhida: boolean;
  aoAlternar: () => void;
}

export function Sidebar({ recolhida, aoAlternar }: SidebarProps) {
  return (
    <aside
      className={clsx(
        'flex h-screen flex-col border-r border-ink-100 bg-white transition-all duration-200',
        recolhida ? 'w-[76px]' : 'w-64',
      )}
    >
      <div
        className={clsx(
          'flex h-16 items-center border-b border-ink-100',
          recolhida ? 'justify-center' : 'justify-between px-5',
        )}
      >
        {!recolhida && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <Layers size={18} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold text-ink-900">RSON ERP</span>
          </div>
        )}
        {recolhida && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <Layers size={18} className="text-white" />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col gap-1 px-3">
          {itensNavegacao.map((item) => (
            <li key={item.caminho}>
              <NavLink
                to={item.caminho}
                end={item.caminho === '/'}
                title={recolhida ? item.rotulo : undefined}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    recolhida && 'justify-center px-0',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icone
                      size={19}
                      className={isActive ? 'text-brand-600' : 'text-ink-500'}
                    />
                    {!recolhida && <span>{item.rotulo}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-ink-100 p-3">
        <button
          onClick={aoAlternar}
          className={clsx(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-ink-100 hover:text-ink-900',
            recolhida && 'justify-center px-0',
          )}
        >
          {recolhida ? <ChevronsRight size={19} /> : <ChevronsLeft size={19} />}
          {!recolhida && <span>Recolher menu</span>}
        </button>
      </div>
    </aside>
  );
}
