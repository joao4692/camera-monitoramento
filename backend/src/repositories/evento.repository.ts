import { prisma } from "../lib/prisma";
import { TipoEvento } from "../generated/prisma/enums";
import type { EventoModel } from "../generated/prisma/models";

export const eventoRepository = {
  // Cria um novo evento (entrada ou saída) vinculado a um estacionamento.
  // Dica: prisma.evento.create({ data: { tipo, estacionamentoId } })
  registrar(tipo: TipoEvento, estacionamentoId: number): Promise<EventoModel> {
    return prisma.evento.create({
      data: { tipo, estacionamentoId },
    });
  },
};
