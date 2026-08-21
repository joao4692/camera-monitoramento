/**
 * O que resolve: login do admin (POST /auth/login), guarda o token JWT e o
 * usuário logado (localStorage, pra sobreviver a um refresh de página), e
 * expõe se há alguém autenticado agora.
 *
 * Ligações: usado pela tela de login (features/admin-login), pelo
 * authGuard (bloqueia rota sem login) e pelo authInterceptor (anexa o
 * token nas requisições pro backend).
 */
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../config';
import { LoginResponse, UsuarioLogado } from '../models/usuario';

const TOKEN_KEY = 'estacionamento_token';
const USUARIO_KEY = 'estacionamento_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly usuario = signal<UsuarioLogado | null>(this.recuperarUsuarioSalvo());

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  get autenticado(): boolean {
    return this.token !== null;
  }

  async login(email: string, senha: string): Promise<void> {
    const resultado = await firstValueFrom(
      this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { email, senha })
    );

    localStorage.setItem(TOKEN_KEY, resultado.token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(resultado.usuario));
    this.usuario.set(resultado.usuario);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    this.usuario.set(null);
  }

  private recuperarUsuarioSalvo(): UsuarioLogado | null {
    const bruto = localStorage.getItem(USUARIO_KEY);
    return bruto ? (JSON.parse(bruto) as UsuarioLogado) : null;
  }
}
