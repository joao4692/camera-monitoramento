/**
 * O que resolve: formato da resposta de GET /estacionamento/status e das
 * mensagens de status que chegam pelo WebSocket — espelha exatamente o
 * StatusEstacionamento do backend (backend/src/services/estacionamento.service.ts).
 */
export interface StatusEstacionamento {
  totalVagas: number;
  vagasOcupadas: number;
  vagasLivres: number;
}
