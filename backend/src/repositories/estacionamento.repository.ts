import { prisma } from "../lib/prisma";
import type { EstacionamentoModel } from "../generated/prisma/models";

export const estacionamentoRepository = {
  // Busca o único estacionamento cadastrado (não temos multi-tenant, é sempre um só).
  // Dica: prisma.estacionamento.findFirst()
  findAtual(): Promise<EstacionamentoModel | null> {
    return prisma.estacionamento.findFirst();
  },

  // Atualiza o campo vagasOcupadas do estacionamento com o id informado,
  // e devolve o registro já atualizado.
  // Dica: prisma.estacionamento.update({ where: { id }, data: { vagasOcupadas } })
  atualizarVagasOcupadas(id: number, vagasOcupadas: number): Promise<EstacionamentoModel> {
    return prisma.estacionamento.update({
      where: { id },
      data: { vagasOcupadas },
    });
  },
};
