/**
 * O que resolve: camada HTTP das rotas de estacionamento — recebe a
 * requisição, valida entrada (quando tem) e delega a regra de negócio
 * pro estacionamento.service.ts, sem conter lógica de negócio aqui.
 *
 * Ligações: usado por estacionamento.routes.ts. statusController é público;
 * ajustarVagasController passa pelo authMiddleware antes de chegar aqui
 * (só admin ajusta vagas manualmente). Chama broadcastStatus() depois de
 * um ajuste bem-sucedido, pra quem estiver com a tela pública aberta ver
 * a mudança sem precisar dar refresh (ver nota em websocket/estacionamentoSocket.ts).
 */
import { Request, Response, NextFunction } from "express";
import { ajustarVagasSchema } from "../schemas/estacionamento.schema";
import {
  getStatus,
  ajustarVagasManualmente,
  listarEventosRecentes,
} from "../services/estacionamento.service";
import { broadcastStatus } from "../websocket/estacionamentoSocket";

export async function statusController(req: Request, res: Response, next: NextFunction) {
  try {
    const status = await getStatus();
    res.json(status);
  } catch (err) {
    next(err);
  }
}

export async function eventosController(req: Request, res: Response, next: NextFunction) {
  try {
    const eventos = await listarEventosRecentes();
    res.json(eventos);
  } catch (err) {
    next(err);
  }
}

export async function ajustarVagasController(req: Request, res: Response, next: NextFunction) {
  try {
    const { vagasOcupadas } = ajustarVagasSchema.parse(req.body);
    const status = await ajustarVagasManualmente(vagasOcupadas);
    broadcastStatus(status);
    res.json(status);
  } catch (err) {
    next(err);
  }
}
