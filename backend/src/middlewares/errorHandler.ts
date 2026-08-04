import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Dados inválidos",
      issues: err.issues,
    });
    return;
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  const message = err instanceof Error ? err.message : "Erro interno inesperado";

  res.status(500).json({
    error: message,
  });
}
