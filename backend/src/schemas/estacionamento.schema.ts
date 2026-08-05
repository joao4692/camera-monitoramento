/**
 * O que resolve: valida o corpo da requisição de ajuste manual de vagas
 * (rota do admin) — garante que vagasOcupadas veio como número inteiro
 * não-negativo antes de chegar no service.
 *
 * Ligações: usado por estacionamento.controller.ts. O limite máximo
 * (não passar de totalVagas) não dá pra validar aqui porque totalVagas
 * é um valor dinâmico do banco — isso fica por conta do
 * estacionamento.service.ts (ajustarVagasManualmente).
 */
import { z } from "zod";

export const ajustarVagasSchema = z.object({
  vagasOcupadas: z.number().int().min(0, "vagasOcupadas não pode ser negativo"),
});

export type AjustarVagasInput = z.infer<typeof ajustarVagasSchema>;
