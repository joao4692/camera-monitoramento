"""
O que resolve: centraliza a configuração do serviço, lida do .env — URL da
câmera do celular, URL do WebSocket do backend Node, e qual estacionamento
este serviço representa (estacionamento_id, exigido pelo schema da Etapa 6
mesmo não havendo múltiplos estacionamentos ainda).

Ligações: usado por main.py e websocket_client.py. O .env real fica de
fora do Git (só o .env.example, com valores de exemplo).
"""
import os
from dotenv import load_dotenv

load_dotenv()

CAMERA_URL = os.getenv("CAMERA_URL", "http://192.168.0.22:8080/video")
WS_URL = os.getenv("WS_URL", "ws://localhost:3000")
ESTACIONAMENTO_ID = int(os.getenv("ESTACIONAMENTO_ID", "1"))
