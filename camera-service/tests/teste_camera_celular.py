import cv2

# Troca pelo IP que apareceu no seu celular
url = "http://192.168.0.22:8080/video"

print(f"Tentando conectar em: {url}")
cap = cv2.VideoCapture(url)

if cap.isOpened():
    print("✅ Conectou na câmera do celular!")
    ret, frame = cap.read()
    if ret:
        cv2.imwrite("teste_frame_celular.jpg", frame)
        print("✅ Imagem salva como teste_frame_celular.jpg")
    else:
        print("⚠️ Conectou, mas não leu o frame.")
else:
    print("❌ Não conectou.")

cap.release()