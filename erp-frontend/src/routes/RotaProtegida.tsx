import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RotaProtegida({ children }: { children: ReactNode }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div className="flex h-screen items-center justify-center text-sm text-ink-500">Carregando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
