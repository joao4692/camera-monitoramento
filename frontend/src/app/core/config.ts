/**
 * O que resolve: centraliza as URLs do backend (REST e WebSocket) usadas
 * pelo frontend, lidas do arquivo de ambiente certo pro tipo de build —
 * `environment.ts` (dev, localhost) ou `environment.prod.ts` (produção,
 * trocado automaticamente pelo Angular via fileReplacements no
 * angular.json quando builda com `--configuration production`).
 *
 * Ligações: usado por EstacionamentoService e AuthService.
 */
import { environment } from '../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;
export const WS_URL = environment.wsUrl;
