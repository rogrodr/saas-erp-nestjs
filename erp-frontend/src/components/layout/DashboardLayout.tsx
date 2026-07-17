import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardLayout() {
  const [recolhida, setRecolhida] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#f4f6fb]">
      <Sidebar recolhida={recolhida} aoAlternar={() => setRecolhida((valor) => !valor)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
