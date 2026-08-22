/**
 * O que resolve: a tela pública do estacionamento — status das vagas em
 * tempo real, sem login (decisão fechada no documento central). É a
 * porta de entrada de qualquer visitante do site.
 *
 * Ligações: usa EstacionamentoService pra buscar o status inicial (REST)
 * e escutar atualizações ao vivo (WebSocket).
 */
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstacionamentoService } from '../../core/services/estacionamento.service';

@Component({
  imports: [FormsModule],
  selector: 'app-public-status',
  styleUrl: './public-status.css',
  templateUrl: './public-status.html',
})
export class PublicStatus implements OnInit, OnDestroy {
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  // Estado do modal de reserva (protótipo — nada disso é salvo de verdade)
  readonly modalAberto = signal(false);
  readonly reservaConfirmada = signal(false);

  vagaSelecionada: number | null = null;
  horarioSelecionado = '';
  formaPagamento = '';

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

  // Gera uma lista [1, 2, 3, ...] do tamanho de vagasLivres, só pra ter
  // "vagas" pra escolher no protótipo (nosso backend só guarda a
  // contagem, não vagas individuais numeradas).
  listaVagas(): number[] {
    const livres = this.estacionamento.status()?.vagasLivres ?? 0;
    return Array.from({ length: livres }, (_, i) => i + 1);
  }

  abrirModal(): void {
    this.modalAberto.set(true);
    this.reservaConfirmada.set(false);
    this.vagaSelecionada = null;
    this.horarioSelecionado = '';
    this.formaPagamento = '';
  }

  fecharModal(): void {
    this.modalAberto.set(false);
  }

  confirmarReserva(): void {
    // Protótipo: não chama nenhum endpoint, só simula sucesso na tela.
    this.reservaConfirmada.set(true);
  }
}
