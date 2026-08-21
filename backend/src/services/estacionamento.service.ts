/**
 * O que resolve: é aqui que mora a regra de negócio central do sistema — o
 * contador de vagas do estacionamento. Toda entrada/saída de veículo (vinda
 * da câmera, na Etapa 6/7) e todo ajuste manual do admin passam por aqui,
 * garantindo que `vagasOcupadas` nunca fique negativo nem ultrapasse
 * `totalVagas`.
 *
 * Ligações:
 * - Usa estacionamentoRepository e eventoRepository (Prisma) pra ler/gravar.
 * - Lança AppError quando uma regra é violada (ex: ajuste manual fora do intervalo).
 * - Vai ser chamado por estacionamento.controller.ts (rotas REST desta etapa)
 *   e, na Etapa 6, pelo handler de WebSocket que recebe eventos da câmera Python.
 */
import { estacionamentoRepository } from "../repositories/estacionamento.repository";
import { eventoRepository } from "../repositories/evento.repository";
import { TipoEvento } from "../generated/prisma/enums";
import type { EventoModel } from "../generated/prisma/models";
import { AppError } from "../errors/AppError";

const LIMITE_HISTORICO_PADRAO = 50;

export interface StatusEstacionamento {
  totalVagas: number;
  vagasOcupadas: number;
  vagasLivres: number;
}

function paraStatus(estacionamento: {
  totalVagas: number;
  vagasOcupadas: number;
}): StatusEstacionamento {
  return {
    totalVagas: estacionamento.totalVagas,
    vagasOcupadas: estacionamento.vagasOcupadas,
    vagasLivres: estacionamento.totalVagas - estacionamento.vagasOcupadas,
  };
}

async function buscarEstacionamentoOuFalhar() {
  const estacionamento = await estacionamentoRepository.findAtual();
  if (!estacionamento) {
    throw new AppError("Nenhum estacionamento cadastrado", 404);
  }
  return estacionamento;
}

export async function getStatus(): Promise<StatusEstacionamento> {
  const estacionamento = await buscarEstacionamentoOuFalhar();
  return paraStatus(estacionamento);
}

export async function registrarEntrada(timestamp?: Date): Promise<StatusEstacionamento> {
  const estacionamento = await buscarEstacionamentoOuFalhar();

  // Nunca passa de totalVagas: se já estiver cheio, o evento ainda é
  // registrado (aconteceu de verdade), mas o contador trava no máximo.
  const novasVagasOcupadas = Math.min(
    estacionamento.vagasOcupadas + 1,
    estacionamento.totalVagas
  );

  const atualizado = await estacionamentoRepository.atualizarVagasOcupadas(
    estacionamento.id,
    novasVagasOcupadas
  );
  await eventoRepository.registrar(TipoEvento.entrada, estacionamento.id, timestamp);

  return paraStatus(atualizado);
}

export async function registrarSaida(timestamp?: Date): Promise<StatusEstacionamento> {
  const estacionamento = await buscarEstacionamentoOuFalhar();

  // Nunca fica negativo: trava em zero.
  const novasVagasOcupadas = Math.max(estacionamento.vagasOcupadas - 1, 0);

  const atualizado = await estacionamentoRepository.atualizarVagasOcupadas(
    estacionamento.id,
    novasVagasOcupadas
  );
  await eventoRepository.registrar(TipoEvento.saida, estacionamento.id, timestamp);

  return paraStatus(atualizado);
}

export function listarEventosRecentes(limite = LIMITE_HISTORICO_PADRAO): Promise<EventoModel[]> {
  return eventoRepository.listarRecentes(limite);
}

export async function ajustarVagasManualmente(
  vagasOcupadas: number
): Promise<StatusEstacionamento> {
  const estacionamento = await buscarEstacionamentoOuFalhar();

  if (vagasOcupadas < 0 || vagasOcupadas > estacionamento.totalVagas) {
    throw new AppError(
      `vagasOcupadas deve estar entre 0 e ${estacionamento.totalVagas}`,
      400
    );
  }

  const atualizado = await estacionamentoRepository.atualizarVagasOcupadas(
    estacionamento.id,
    vagasOcupadas
  );

  return paraStatus(atualizado);
}
