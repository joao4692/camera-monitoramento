import "dotenv/config";
import http from "http";
import app from "./app";
import { initWebSocketServer } from "./websocket/estacionamentoSocket";

const PORT = process.env.PORT || 3000;

// Criamos o servidor HTTP explicitamente (é o que app.listen() fazia por
// baixo dos panos) pra poder conectar o Express e o WebSocket nele ao
// mesmo tempo, na mesma porta.
const server = http.createServer(app);
initWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
