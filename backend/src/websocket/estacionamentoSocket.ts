/**
 * O que resolve: é o lado do WebSocket que fala com o serviço Python
 * (Etapa 7). Recebe eventos de entrada/saída, aciona a regra de negócio
 * já pronta (estacionamento.service.ts) e avisa TODOS os clientes
 * conectados (tela pública, painel admin) sobre o novo status — em
 * tempo real, sem ninguém precisar perguntar de novo.
 *
 * Ligações:
 * - Chamado uma vez em server.ts, recebendo o servidor HTTP compartilhado
 *   com o Express.
 * - Usa eventoWebSocketSchema pra validar a mensagem recebida.
 * - Usa registrarEntrada/registrarSaida/getStatus de estacionamento.service.ts
 *   (os mesmos da Etapa 5 — nenhuma regra de negócio nova aqui).
 */
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { eventoWebSocketSchema } from "../schemas/websocket.schema";
import {
  registrarEntrada,
  registrarSaida,
  getStatus,
  StatusEstacionamento,
} from "../services/estacionamento.service";

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    console.log("[WS] cliente conectado");

    // Ao conectar, manda o status atual — quem acabou de abrir a tela
    // pública não precisa esperar o próximo evento pra saber o estado agora.
    getStatus()
      .then((status) => socket.send(JSON.stringify(status)))
      .catch((err) => console.error("[WS] erro ao enviar status inicial:", err));

    socket.on("message", async (data) => {
      try {
        const payload = JSON.parse(data.toString());
        const evento = eventoWebSocketSchema.parse(payload);
        const timestamp = new Date(evento.timestamp);

        const status =
          evento.tipo === "entrada"
            ? await registrarEntrada(timestamp)
            : await registrarSaida(timestamp);

        broadcast(wss, status);
      } catch (err) {
        // Mensagem ruim de UM cliente não pode derrubar a conexão dos
        // outros nem do servidor — mesma filosofia do error handler REST.
        console.error("[WS] mensagem inválida:", err);
        socket.send(JSON.stringify({ error: "Mensagem inválida" }));
      }
    });

    socket.on("close", () => {
      console.log("[WS] cliente desconectado");
    });
  });
}

function broadcast(wss: WebSocketServer, status: StatusEstacionamento) {
  const payload = JSON.stringify(status);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}
