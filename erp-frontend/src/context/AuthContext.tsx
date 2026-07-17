import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import { decodificarToken } from '../lib/jwt';

export interface Usuario {
  usuarioId: number;
  empresaId: number;
  email: string;
  role: string;
}

interface AuthContextValue {
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function usuarioDoToken(token: string): Usuario | null {
  const payload = decodificarToken(token);
  if (!payload) return null;
  return {
    usuarioId: payload.usuarioId,
    empresaId: payload.empresaId,
    email: payload.email,
    role: payload.role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const payload = decodificarToken(token);
      const tokenExpirado = !payload?.exp || payload.exp * 1000 < Date.now();
      setUsuario(tokenExpirado ? null : usuarioDoToken(token));
    }
    setCarregando(false);
  }, []);

  async function login(email: string, senha: string) {
    // O backend retorna { token, refreshToken } — não devolve os dados do
    // usuário, então extraímos usuarioId/empresaId/email/role do próprio JWT.
    const { data } = await api.post<{ token: string; refreshToken: string }>('/auth/login', {
      email,
      senha,
    });
    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUsuario(usuarioDoToken(data.token));
  }

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
