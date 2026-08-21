/**
 * O que resolve: bloqueia o acesso às rotas da área admin pra quem não
 * está logado, mandando de volta pra tela de login.
 *
 * Ligações: aplicado em app.routes.ts nas rotas de admin (canActivate).
 * Usa AuthService pra saber se há sessão ativa.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.autenticado) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};
