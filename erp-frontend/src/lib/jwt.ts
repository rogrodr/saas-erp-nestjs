export interface PayloadToken {
  usuarioId: number;
  empresaId: number;
  email: string;
  role: string;
  exp?: number;
}

export function decodificarToken(token: string): PayloadToken | null {
  try {
    const [, payloadBase64] = token.split('.');
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}
