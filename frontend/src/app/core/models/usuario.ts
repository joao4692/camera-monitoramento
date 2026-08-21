/**
 * O que resolve: formato do usuário admin retornado por POST /auth/login
 * (espelha o LoginResult do backend, sem o token — esse fica só no
 * AuthService).
 */
export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioLogado;
}
