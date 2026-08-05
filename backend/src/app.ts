import express from "express";
import cors from "cors";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import estacionamentoRoutes from "./routes/estacionamento.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use(healthRoutes);
app.use(authRoutes);
app.use(estacionamentoRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Middleware de erro precisa ser o último a ser registrado.
app.use(errorHandler);

export default app;
