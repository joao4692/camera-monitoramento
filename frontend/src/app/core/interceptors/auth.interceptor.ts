/**
 * O que resolve: anexa automaticamente o header `Authorization: Bearer
 * <token>` em toda requisição feita pro nosso próprio backend — assim os
 * componentes/serviços não precisam se preocupar em montar esse header
 * toda vez que chamam uma rota protegida (ex: PATCH /estacionamento/vagas).
 *
 * Ligações: registrado em app.config.ts via provideHttpClient(withInterceptors([...])).
 * Usa AuthService pra saber se há token guardado.
 */
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { API_BASE_URL } from '../config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  if (!token || !req.url.startsWith(API_BASE_URL)) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  );
};
