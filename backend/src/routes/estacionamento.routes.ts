/**
 * O que resolve: define os caminhos HTTP do domínio "estacionamento" e
 * decide quais passam pelo authMiddleware (só admin) e quais são públicos.
 *
 * Ligações: registrado em app.ts, igual health.routes.ts e auth.routes.ts.
 */
import { Router } from "express";
import {
  statusController,
  ajustarVagasController,
  eventosController,
} from "../controllers/estacionamento.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Pública — qualquer um vê o status das vagas, sem login (decisão fechada no documento central).
router.get("/estacionamento/status", statusController);

// Protegida — só admin ajusta vagas manualmente.
router.patch("/estacionamento/vagas", authMiddleware, ajustarVagasController);

// Protegida — histórico de eventos é informação de gestão, não pública.
router.get("/estacionamento/eventos", authMiddleware, eventosController);

export default router;
