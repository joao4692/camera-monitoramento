import { prisma } from "../lib/prisma";
import { TipoEvento } from "../generated/prisma/enums";
import type { EventoModel } from "../generated/prisma/models";

export const eventoRepository = {
  // Cria um novo evento (entrada ou saída) vinculado a um estacionamento.
  // timestamp é opcional: se não vier, o Prisma usa o default(now()) do schema.
  registrar(tipo: TipoEvento, estacionamentoId: number, timestamp?: Date): Promise<EventoModel> {
    return prisma.evento.create({
      data: { tipo, estacionamentoId, ...(timestamp && { timestamp }) },
    });
  },
};
