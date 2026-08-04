# 📷 Especificações de Câmera — Projeto Estacionamento Inteligente

> Documento de apoio para aquisição de câmera. O sistema usa uma câmera para detectar veículos entrando e saindo de um estacionamento. O software (Python) precisa acessar a imagem da câmera pela rede — por isso, nem toda câmera serve.

---

## 0. Fase de teste (câmera de celular)

Este documento descreve os requisitos da **câmera definitiva** (Aitek ou equivalente, via RTSP/ONVIF), que será usada quando o projeto crescer. Na fase inicial de desenvolvimento e testes, o projeto usa a **câmera de um celular** para capturar os frames, evitando a complexidade de configuração de rede/conexão (IP, porta, RTSP, ONVIF) logo no início. Toda a arquitetura de processamento (Python/OpenCV) permanece igual — só muda a fonte da imagem. Ver detalhes em [documento-central-estacionamento-inteligente.md](./documento-central-estacionamento-inteligente.md#fase-de-teste).

---

## 1. Requisito essencial (obrigatório)

A câmera precisa suportar **ONVIF** ou expor um **stream RTSP funcional e padrão**, documentado pelo fabricante — não apenas acesso fechado dentro de um app proprietário (tipo apps de câmera genérica chinesa que só funcionam por ID de nuvem).

Isso é o que permite que qualquer software (não só o app do fabricante) se conecte na câmera e leia a imagem em tempo real.

---

## 2. Marcas recomendadas

Maior chance de funcionar sem dor de cabeça:

- Hikvision
- Dahua
- Intelbras (linha profissional / linha IP — não as básicas de app fechado)
- TP-Link Tapo
- Reolink
- Amcrest

Não precisa ser modelo caro ou topo de linha — mesmo os modelos de entrada dessas marcas costumam ter RTSP/ONVIF funcionando corretamente, porque são marcas com suporte técnico e compatibilidade documentada.

---

## 3. O que evitar

- Câmeras sem marca ("genéricas"), vendidas apenas com um app tipo Yoosee, CamHi, V380, iCSee — nessas, o RTSP, quando existe, costuma ter bugs de implementação e travar softwares de terceiros (já aconteceu em teste real neste projeto).
- Câmeras que só mencionam "acesso via nuvem do app XYZ" sem citar RTSP ou ONVIF em nenhum lugar da descrição/manual.

---

## 4. Informações necessárias após a instalação

- Usuário e senha de acesso (de fábrica ou definidos na instalação)
- Endereço IP que a câmera vai ter na rede (ou como localizar esse IP depois)
- Porta RTSP (padrão `554`, confirmar se for diferente)
- Caminho do stream RTSP (varia por marca/modelo — geralmente vem no manual, ex: `/Streaming/Channels/101` para Hikvision, `/cam/realmonitor` para Dahua)

---

## 5. Especificações físicas

| Item | Preferência |
|---|---|
| Tipo | Câmera IP (com fio ou WiFi, tanto faz) |
| Resolução | 720p já é suficiente; 1080p é confortável |
| Ambiente | Uso externo (entrada do estacionamento), com proteção IP66 |
| Visão noturna | Recomendado, já que o estacionamento funciona à noite também |
| Ângulo/posicionamento | Precisa enxergar bem a faixa de entrada/saída de veículos, sem obstrução |

---

## Resumo

> Câmera IP de marca confiável, com RTSP ou ONVIF funcionando de verdade — não uma câmera que só funciona fechada dentro do app do fabricante.

---

*Documento de apoio para aquisição de equipamento — projeto de estudo em engenharia de software (visão computacional aplicada a estacionamento inteligente).*
