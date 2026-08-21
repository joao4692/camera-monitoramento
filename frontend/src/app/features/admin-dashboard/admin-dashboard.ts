/**
 * O que resolve: painel do admin — status atual, ajuste manual de vagas
 * ocupadas, e histórico de eventos. Só chega aqui quem passou pelo
 * authGuard (login válido).
 *
 * Ligações: usa EstacionamentoService (status + ajuste + histórico) e
 * AuthService (logout).
 */
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EstacionamentoService } from '../../core/services/estacionamento.service';
import { AuthService } from '../../core/services/auth.service';
import { Evento } from '../../core/models/evento';

@Component({
  imports: [FormsModule, DatePipe],
  selector: 'app-admin-dashboard',
  styleUrl: './admin-dashboard.css',
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard implements OnInit, OnDestroy {
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly eventos = signal<Evento[]>([]);
  readonly salvando = signal(false);

  novoValorVagas: number | null = null;

  constructor(
    readonly estacionamento: EstacionamentoService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await Promise.all([
        this.estacionamento.carregarStatusInicial(),
        this.carregarEventos(),
      ]);
    } catch {
      this.erro.set('Não foi possível carregar os dados do estacionamento.');
    } finally {
      this.carregando.set(false);
    }

    this.estacionamento.conectarTempoReal();
  }

  ngOnDestroy(): void {
    this.estacionamento.desconectar();
  }

  async carregarEventos(): Promise<void> {
    this.eventos.set(await this.estacionamento.listarEventos());
  }

  async salvarAjuste(): Promise<void> {
    if (this.novoValorVagas === null) {
      return;
    }

    this.salvando.set(true);
    this.erro.set(null);

    try {
      await this.estacionamento.ajustarVagas(this.novoValorVagas);
      await this.carregarEventos();
      this.novoValorVagas = null;
    } catch {
      this.erro.set('Não foi possível salvar o ajuste (confira se o valor está dentro do limite de vagas).');
    } finally {
      this.salvando.set(false);
    }
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
