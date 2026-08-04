import { prisma } from "../lib/prisma";
import type { UsuarioModel } from "../generated/prisma/models";

export const usuarioRepository = {
  findByEmail(email: string): Promise<UsuarioModel | null> {
    return prisma.usuario.findUnique({ where: { email } });
  },
};
