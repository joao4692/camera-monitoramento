/**
 * O que resolve: valida a mensagem que o serviço Python manda pelo
 * WebSocket sempre que detecta (ou simula) um veículo entrando/saindo.
 * Formato definido no documento central: { tipo, estacionamento_id, timestamp }.
 *
 * Ligações: usado pelo handler de WebSocket (websocket/server.ts).
 * O `estacionamentoId` está aqui pra manter o contrato alinhado com o
 * schema do Evento (documentado desde o início), mesmo que hoje, como só
 * existe um estacionamento, o handler não precise usá-lo pra decidir nada.
 */
import { z } from "zod";

export const eventoWebSocketSchema = z.object({
  tipo: z.enum(["entrada", "saida"]),
  estacionamento_id: z.number().int(),
  timestamp: z.string().datetime(),
});

export type EventoWebSocketInput = z.infer<typeof eventoWebSocketSchema>;
