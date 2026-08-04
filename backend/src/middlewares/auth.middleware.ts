import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../services/auth.service";

export interface AuthenticatedRequest extends Request {
  usuario?: TokenPayload;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    req.usuario = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
