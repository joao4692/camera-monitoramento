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

Resiliência (nunca cai sozinho, só com 'q'):
- Se a câmera falhar/desconectar, tenta reconectar a cada RETRY_SEGUNDOS,
  sem fechar o WebSocket nem encerrar o programa.
- Se o envio ao backend falhar (WebSocket caiu), a próxima tentativa de
  envio reconecta antes de desistir; se não conseguir, avisa no terminal
  e segue rodando (o evento daquela tentativa específica se perde, mas
  o serviço continua de pé pro próximo).
- 'q' é a única forma de encerrar de verdade (ex: manutenção manual).

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
RETRY_SEGUNDOS = 3.0


def conectar_camera():
    """Tenta abrir a câmera. Retorna o VideoCapture aberto, ou None se falhou
    (a câmera nunca levanta exceção pra isso — só isOpened()/read() que avisam)."""
    cap = cv2.VideoCapture(CAMERA_URL)
    if not cap.isOpened():
        cap.release()
        return None
    return cap


def conectar_websocket(cliente: EstacionamentoWebSocketClient) -> bool:
    try:
        cliente.conectar()
        print(f"Conectado ao backend: {WS_URL}")
        return True
    except Exception as err:  # noqa: BLE001 — qualquer falha de rede/protocolo aqui vira "tenta de novo depois", não crash
        print(f"Não foi possível conectar ao backend ({WS_URL}): {err}")
        return False


def main() -> None:
    cliente = EstacionamentoWebSocketClient(WS_URL, ESTACIONAMENTO_ID)
    ws_conectado = conectar_websocket(cliente)

    ultimo_envio: dict[str, float] = {"entrada": 0.0, "saida": 0.0}

    def pode_enviar(tipo: str) -> bool:
        agora = time.monotonic()
        if agora - ultimo_envio[tipo] < COOLDOWN_SEGUNDOS:
            return False
        ultimo_envio[tipo] = agora
        return True

    def enviar_com_resiliencia(tipo: str) -> None:
        nonlocal ws_conectado
        if not ws_conectado:
            ws_conectado = conectar_websocket(cliente)

        if not ws_conectado:
            print(f"[evento] {tipo} NÃO enviado — sem conexão com o backend agora")
            return

        try:
            cliente.enviar_evento(tipo)
            print(f"[evento] {tipo} enviado")
        except Exception as err:  # noqa: BLE001 — mesma ideia: falha de envio não pode matar o programa
            print(f"[evento] falha ao enviar {tipo} ({err}) — vou tentar reconectar na próxima")
            ws_conectado = False

    print("Pressione 'e' = entrada, 's' = saida, 'q' = sair (encerra o serviço).")

    sair = False
    while not sair:
        cap = conectar_camera()
        if cap is None:
            print(f"Câmera indisponível ({CAMERA_URL}), tentando de novo em {RETRY_SEGUNDOS:.0f}s...")
            time.sleep(RETRY_SEGUNDOS)
            continue

        print("Câmera conectada.")

        while True:
            ret, frame = cap.read()
            if not ret:
                print(f"Sinal da câmera perdido, tentando reconectar em {RETRY_SEGUNDOS:.0f}s...")
                break  # sai só do loop de leitura; o loop externo cuida de reconectar a câmera

            cv2.imshow("Estacionamento - camera-service", frame)
            tecla = cv2.waitKey(1) & 0xFF

            if tecla == ord("e") and pode_enviar("entrada"):
                enviar_com_resiliencia("entrada")
            elif tecla == ord("s") and pode_enviar("saida"):
                enviar_com_resiliencia("saida")
            elif tecla == ord("q"):
                sair = True
                break

        cap.release()
        if not sair:
            time.sleep(RETRY_SEGUNDOS)

    cv2.destroyAllWindows()
    cliente.fechar()


if __name__ == "__main__":
    main()
