import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  largura?: 'sm' | 'md';
}

const larguras = {
  sm: 'max-w-sm',
  md: 'max-w-md',
};

export function AuthLayout({ children, largura = 'sm' }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden w-1/2 flex-col items-center justify-center bg-ink-900 md:flex">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="text-white">RSON</span> <span className="text-ink-500">ERP</span>
        </h1>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-10 md:w-1/2">
        <div className={`w-full ${larguras[largura]}`}>{children}</div>
      </div>
    </div>
  );
}
