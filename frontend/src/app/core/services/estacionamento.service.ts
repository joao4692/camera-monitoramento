/**
 * O que resolve: busca o status inicial do estacionamento via REST e depois
 * escuta o WebSocket pra manter esse status atualizado em tempo real — sem
 * o usuário precisar dar refresh. Expõe tudo como um signal (`status`),
 * que os componentes leem diretamente no template.
 *
 * Ligações: consome GET /estacionamento/status e o WebSocket do backend
 * (Etapa 6). Usado pela tela pública (features/public-status) e pode ser
 * reaproveitado pela área admin mais adiante.
 */
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL, WS_URL } from '../config';
import { StatusEstacionamento } from '../models/status-estacionamento';

@Injectable({ providedIn: 'root' })
export class EstacionamentoService {
  readonly status = signal<StatusEstacionamento | null>(null);
  readonly conectado = signal(false);

  private socket?: WebSocket;

  constructor(private http: HttpClient) {}

  async carregarStatusInicial(): Promise<void> {
    const status = await firstValueFrom(
      this.http.get<StatusEstacionamento>(`${API_BASE_URL}/estacionamento/status`)
    );
    this.status.set(status);
  }

  conectarTempoReal(): void {
    if (this.socket) {
      return; // já conectado — evita abrir uma segunda conexão à toa
    }

    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => this.conectado.set(true);

    this.socket.onmessage = (event) => {
      const dado = JSON.parse(event.data);
      if (typeof dado?.totalVagas === 'number') {
        this.status.set(dado as StatusEstacionamento);
      }
    };

    this.socket.onclose = () => {
      this.conectado.set(false);
      this.socket = undefined;
    };
  }

  desconectar(): void {
    this.socket?.close();
    this.socket = undefined;
  }
}
