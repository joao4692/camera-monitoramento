/**
 * O que resolve: formulário de login do admin — único jeito de entrar na
 * área administrativa (decisão fechada: só admin loga, cliente não).
 *
 * Ligações: usa AuthService.login(). Em caso de sucesso, navega pra
 * /admin (rota protegida pelo authGuard).
 */
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [FormsModule],
  selector: 'app-admin-login',
  styleUrl: './admin-login.css',
  templateUrl: './admin-login.html',
})
export class AdminLogin {
  email = '';
  senha = '';

  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async entrar(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      await this.authService.login(this.email, this.senha);
      this.router.navigate(['/admin']);
    } catch {
      this.erro.set('Email ou senha inválidos.');
    } finally {
      this.carregando.set(false);
    }
  }
}
