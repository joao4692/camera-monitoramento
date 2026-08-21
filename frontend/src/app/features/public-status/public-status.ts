/**
 * O que resolve: a tela pública do estacionamento — status das vagas em
 * tempo real, sem login (decisão fechada no documento central). É a
 * porta de entrada de qualquer visitante do site.
 *
 * Ligações: usa EstacionamentoService pra buscar o status inicial (REST)
 * e escutar atualizações ao vivo (WebSocket).
 */
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { EstacionamentoService } from '../../core/services/estacionamento.service';

@Component({
  imports: [],
  selector: 'app-public-status',
  styleUrl: './public-status.css',
  templateUrl: './public-status.html',
})
export class PublicStatus implements OnInit, OnDestroy {
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  constructor(readonly estacionamento: EstacionamentoService) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.estacionamento.carregarStatusInicial();
    } catch {
      this.erro.set('Não foi possível carregar o status do estacionamento.');
    } finally {
      this.carregando.set(false);
    }

    this.estacionamento.conectarTempoReal();
  }

  ngOnDestroy(): void {
    this.estacionamento.desconectar();
  }
}
