/**
 * O que resolve: formato de um item do histórico de eventos, retornado
 * por GET /estacionamento/eventos — espelha o model Evento do Prisma.
 */
export interface Evento {
  id: number;
  tipo: 'entrada' | 'saida';
  timestamp: string;
  estacionamentoId: number;
}
