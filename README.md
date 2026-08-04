# 🅿️ Estacionamento Inteligente

Sistema de estacionamento inteligente que usa uma câmera para detectar veículos entrando e saindo, atualizando o status das vagas em tempo real.

## Visão geral

| Componente            | Responsabilidade                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| **camera-service** (Python/OpenCV) | Lê o stream da câmera, detecta entrada/saída de veículo e envia um evento via WebSocket. |
| **backend** (Node.js)  | Recebe o evento, valida, aplica regra de negócio, persiste no banco e notifica o frontend em tempo real. |
| **frontend** (Angular) | Mostra o status das vagas em tempo real: tela pública (sem login) e área admin (com login).              |
| **Postgres + Prisma**  | Armazena eventos, estado do estacionamento e usuários (admin).                                            |

> Fase de teste atual: os frames são capturados da câmera de um celular, no lugar da câmera Aitek/RTSP definitiva. Detalhes em [docs/documento-central-estacionamento-inteligente.md](./docs/documento-central-estacionamento-inteligente.md#fase-de-teste).

## Documentação

Toda decisão de arquitetura, stack e regras de negócio está documentada em:

- [docs/documento-central-estacionamento-inteligente.md](./docs/documento-central-estacionamento-inteligente.md) — fonte única da verdade do projeto.
- [docs/especificacoes-camera-estacionamento.md](./docs/especificacoes-camera-estacionamento.md) — requisitos da câmera definitiva.
- [docs/plano-de-execucao-checklist.md](./docs/plano-de-execucao-checklist.md) — checklist operacional de cada etapa.

## Estrutura do repositório

```
.
├── backend/         # API Node.js (MVC + Repositories, Prisma, JWT, WebSocket)
├── frontend/         # Aplicação Angular (tela pública + área admin)
├── camera-service/   # Serviço Python (OpenCV) que detecta veículos e envia eventos
└── docs/             # Documentação do projeto
```

## Status

Projeto em desenvolvimento — projeto de portfólio e aprendizado em engenharia de software fullstack.
