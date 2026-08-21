/**
 * O que resolve: centraliza as URLs do backend (REST e WebSocket) usadas
 * pelo frontend. Por enquanto fixas em localhost — faz sentido na fase de
 * teste, tudo rodando na mesma máquina. Quando o projeto for pra produção
 * de verdade (Etapa 9), isso vira configuração por ambiente (build de dev
 * vs. build de produção), não antes.
 *
 * Ligações: usado por EstacionamentoService e AuthService.
 */
export const API_BASE_URL = 'http://localhost:3000';
export const WS_URL = 'ws://localhost:3000';
