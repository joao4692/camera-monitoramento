/**
 * O que resolve: erro de negócio "esperado" (ex: valor de vagas fora do
 * intervalo permitido), diferente de um bug/exceção inesperada. Carrega o
 * status HTTP certo pra resposta, em vez de sempre cair no 500 genérico.
 *
 * Ligações:
 * - Lançado pelos services (ex: estacionamento.service.ts) quando uma regra
 *   de negócio é violada.
 * - Tratado especificamente no errorHandler.ts (middleware global de erro),
 *   que usa o `statusCode` pra responder com o código certo.
 */
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}
