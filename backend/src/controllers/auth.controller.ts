import { Response, NextFunction, Request } from "express";
import { loginSchema } from "../schemas/auth.schema";
import { login } from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, senha } = loginSchema.parse(req.body);
    const resultado = await login(email, senha);

    if (!resultado) {
      res.status(401).json({ error: "Credenciais inválidas" });
      return;
    }

    res.json(resultado);
  } catch (err) {
    next(err);
  }
}

export function meController(req: AuthenticatedRequest, res: Response) {
  res.json({ usuario: req.usuario });
}
