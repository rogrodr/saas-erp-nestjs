import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
  empresaId: number;
}

export interface RegistrarEmpresaPayload {
  nomeEmpresa: string;
  cnpj?: string;
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'erp.token';
  private readonly userKey = 'erp.user';

  constructor(private readonly http: HttpClient) {}

  async login(email: string, senha: string): Promise<AuthResponse> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, senha })
    );

    this.persistSession(response, { email });
    return response;
  }

  async register(payload: RegisterPayload): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiUrl}/auth/register`, payload));
  }

  async registrarComEmpresa(payload: RegistrarEmpresaPayload): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/register-empresa`, payload)
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getStoredUser(): { email: string; empresaId?: number } | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }

  private persistSession(response: AuthResponse, user: { email: string; empresaId?: number }): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }
}