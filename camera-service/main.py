"""
O que resolve: ponto de entrada do serviço de câmera (fase de teste). Lê
os frames da câmera do celular continuamente e mostra o vídeo numa janela.
Como a fase de teste não garante acesso a carros reais passando o tempo
todo, a "detecção" aqui é um disparo manual (mock) via teclado — pressione
'e' pra simular uma entrada e 's' pra simular uma saída. Isso está
documentado como aceitável no documento central (seção "Fase de Teste").

Ligações: usa EstacionamentoWebSocketClient (websocket_client.py) pra
mandar o evento pro backend Node (Etapa 6), e as configurações de
config.py (URL da câmera, URL do WebSocket, id do estacionamento).

Como rodar: dentro de camera-service/, com o venv ativado,
`python main.py`. Precisa do backend (Etapa 6) rodando (`npm run dev`
em backend/) e do app de câmera do celular expondo o vídeo na rede local
(ver camera-service/tests/teste_camera_celular.py pra testar só a conexão
com a câmera, sem o WebSocket).

Nota sobre o debounce: cv2.waitKey roda a cada frame (dezenas de vezes
por segundo). Sem controle, um único toque de tecla — que fica "pressionada"
por uma fração de segundo — dispararia vários eventos, um por frame lido
nesse intervalo. COOLDOWN_SEGUNDOS garante que um evento do mesmo tipo só
é aceito de novo depois de passado esse tempo mínimo.
"""
import time

import cv2

from src.config import CAMERA_URL, WS_URL, ESTACIONAMENTO_ID
from src.websocket_client import EstacionamentoWebSocketClient

COOLDOWN_SEGUNDOS = 1.0


def main() -> None:
    cliente = EstacionamentoWebSocketClient(WS_URL, ESTACIONAMENTO_ID)
    cliente.conectar()
    print(f"Conectado ao backend: {WS_URL}")

    cap = cv2.VideoCapture(CAMERA_URL)
    if not cap.isOpened():
        print(f"Não foi possível conectar na câmera: {CAMERA_URL}")
        cliente.fechar()
        return

    print("Câmera conectada. Pressione 'e' = entrada, 's' = saida, 'q' = sair.")

    ultimo_envio: dict[str, float] = {"entrada": 0.0, "saida": 0.0}

    def pode_enviar(tipo: str) -> bool:
        agora = time.monotonic()
        if agora - ultimo_envio[tipo] < COOLDOWN_SEGUNDOS:
            return False
        ultimo_envio[tipo] = agora
        return True

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Falha ao ler frame da câmera.")
                break

            cv2.imshow("Estacionamento - camera-service", frame)
            tecla = cv2.waitKey(1) & 0xFF

            if tecla == ord("e") and pode_enviar("entrada"):
                cliente.enviar_evento("entrada")
                print("[evento] entrada enviada")
            elif tecla == ord("s") and pode_enviar("saida"):
                cliente.enviar_evento("saida")
                print("[evento] saida enviada")
            elif tecla == ord("q"):
                break
    finally:
        cap.release()
        cv2.destroyAllWindows()
        cliente.fechar()


if __name__ == "__main__":
    main()
