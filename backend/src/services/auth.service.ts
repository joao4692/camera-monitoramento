import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { usuarioRepository } from "../repositories/usuario.repository";

// jsonwebtoken tipa `expiresIn` com um formato restrito (ex: "8h", "60s"), mas ele vem
// de uma variável de ambiente (string genérica) — o cast documenta que o valor é
// confiável porque nós mesmos definimos o formato no .env.
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "8h") as SignOptions["expiresIn"];

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no .env");
}

const JWT_SECRET: string = process.env.JWT_SECRET;

export interface TokenPayload {
  sub: number;
  email: string;
  tipo: string;
}

export interface LoginResult {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    tipo: string;
  };
}

export async function login(email: string, senha: string): Promise<LoginResult | null> {
  const usuario = await usuarioRepository.findByEmail(email);
  if (!usuario) {
    return null;
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
  if (!senhaValida) {
    return null;
  }

  const payload: TokenPayload = { sub: usuario.id, email: usuario.email, tipo: usuario.tipo };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    },
  };
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;
}

export function hashPassword(senha: string): Promise<string> {
  return bcrypt.hash(senha, 10);
}
