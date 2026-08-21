"""
O que resolve: cliente WebSocket que manda os eventos de entrada/saída pro
backend Node, no formato exato validado pelo eventoWebSocketSchema do
lado Node (backend/src/schemas/websocket.schema.ts): tipo, estacionamento_id,
timestamp (ISO 8601 em UTC, terminado em "Z" — mesmo formato que o
JavaScript gera com `new Date().toISOString()`, por isso o formato manual
abaixo em vez de datetime.isoformat(), que gera "+00:00" e quebraria a
validação do Zod).

Ligações: usado por main.py sempre que um evento (mock ou detecção real)
acontece.
"""
import json
from datetime import datetime, timezone

import websocket


def _agora_utc_iso() -> str:
    agora = datetime.now(timezone.utc)
    return agora.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


class EstacionamentoWebSocketClient:
    def __init__(self, url: str, estacionamento_id: int):
        self.url = url
        self.estacionamento_id = estacionamento_id
        self._ws: websocket.WebSocket | None = None

    def conectar(self) -> None:
        self._ws = websocket.create_connection(self.url)

    def enviar_evento(self, tipo: str) -> None:
        if self._ws is None:
            raise RuntimeError("WebSocket não conectado. Chame conectar() primeiro.")

        payload = {
            "tipo": tipo,
            "estacionamento_id": self.estacionamento_id,
            "timestamp": _agora_utc_iso(),
        }
        self._ws.send(json.dumps(payload))

    def fechar(self) -> None:
        if self._ws is not None:
            self._ws.close()
            self._ws = None
