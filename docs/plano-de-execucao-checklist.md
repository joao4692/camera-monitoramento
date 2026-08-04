# ✅ Plano de Execução — Checklist Detalhado

> Este documento é um **desdobramento operacional** do [documento-central-estacionamento-inteligente.md](./documento-central-estacionamento-inteligente.md). Ele não substitui nem altera nenhuma decisão já tomada lá — apenas quebra cada etapa em passos menores, com checkboxes para acompanhar o andamento real da implementação.
>
> Marque `[x]` conforme for concluindo cada passo.

---

## 📊 Visão geral do progresso

| #   | Etapa                               | Status      |
| --- | ----------------------------------- | ----------- |
| 1   | Setup do projeto (monorepo)         | ⬜ Pendente |
| 2   | Backend Node.js (base)              | ⬜ Pendente |
| 3   | Banco de dados (Postgres + Prisma)  | ⬜ Pendente |
| 4   | Autenticação (admin)                | ⬜ Pendente |
| 5   | Regras de negócio de estacionamento | ⬜ Pendente |
| 6   | WebSocket no Node                   | ⬜ Pendente |
| 7   | Serviço Python (câmera + OpenCV)    | ⬜ Pendente |
| 8   | Frontend Angular                    | ⬜ Pendente |
| 9   | Infraestrutura & Deploy (Docker)    | ⬜ Pendente |
| 10  | Polimento (portfólio-ready)         | ⬜ Pendente |

> Atualize a coluna **Status** manualmente (⬜ Pendente / 🟨 Em andamento / ✅ Concluído) conforme for avançando.

---

## Etapa 1 — Setup do projeto (monorepo)

**O que é:** organizar a base do repositório antes de escrever qualquer linha de código de negócio.
**Para que serve:** evita bagunça de pastas mais tarde e garante que backend, frontend e serviço Python fiquem isolados, mas versionados juntos.

- [ ] Criar a pasta raiz do monorepo
- [ ] Criar subpasta `backend/` (Node.js)
- [ ] Criar subpasta `frontend/` (Angular)
- [ ] Criar subpasta `camera-service/` (Python)
- [ ] Iniciar repositório Git (`git init`)
- [ ] Criar `.gitignore` (node_modules, dist, .env, **pycache**, venv, etc.)
- [ ] Criar README inicial com visão geral do projeto e link para o documento central
- [ ] Primeiro commit da estrutura base

---

## Etapa 2 — Backend Node.js (base)

**O que é:** deixar o servidor Node.js rodando com a esqueleto de pastas definido no padrão MVC + Repositories.
**Para que serve:** ter uma base sólida e organizada antes de implementar regra de negócio, autenticação ou WebSocket.

- [ ] Iniciar projeto Node (`npm init`)
- [ ] Instalar dependências principais: `express`, `prisma`, `zod`, `jsonwebtoken`, `ws`
- [ ] Instalar dependências de desenvolvimento (ex: `nodemon`, `typescript` se for usado)
- [ ] Criar estrutura de pastas: `controllers/`, `services/`, `repositories/`, `routes/`, `middlewares/`
- [ ] Configurar servidor Express básico (`app.js`/`server.js`)
- [ ] Configurar middleware de logger (auditoria de requisições)
- [ ] Configurar middleware global de tratamento de erro (o servidor nunca deve cair)
- [ ] Criar arquivo `.env` e `.env.example` com variáveis de ambiente do backend
- [ ] Testar servidor local com uma rota de health-check (ex: `GET /health`)

---

## Etapa 3 — Banco de dados (Postgres + Prisma)

**O que é:** configurar a persistência de dados do estacionamento.
**Para que serve:** guardar o estado do estacionamento, os eventos de entrada/saída e os usuários admin de forma confiável.

- [ ] Subir uma instância local de Postgres (via Docker, ver Etapa 9, ou instalação local)
- [ ] Instalar e configurar o Prisma no backend (`prisma init`)
- [ ] Definir `DATABASE_URL` no `.env`
- [ ] Modelar o schema Prisma: `Estacionamento`, `Evento`, `Usuario`
- [ ] Rodar a primeira migration (`prisma migrate dev`)
- [ ] Gerar o Prisma Client (`prisma generate`)
- [ ] Criar script de seed inicial (ex: 1 estacionamento de teste com `total_vagas` definido)
- [ ] Validar dados no banco (ex: via Prisma Studio)

---

## Etapa 4 — Autenticação (admin)

**O que é:** implementar o login exclusivo do admin usando JWT.
**Para que serve:** proteger as rotas administrativas, já que o cliente final não precisa (e não deve) logar.

- [ ] Criar model/tabela de usuário admin (já modelado na Etapa 3)
- [ ] Criar service de hash de senha (ex: bcrypt) para cadastro/seed do admin
- [ ] Criar rota de login (`POST /auth/login`) que valida credenciais e gera JWT
- [ ] Validar payload de login com Zod
- [ ] Criar middleware de autenticação JWT (verifica token nas rotas protegidas)
- [ ] Aplicar o middleware nas rotas administrativas
- [ ] Testar fluxo completo: login → token → acesso a rota protegida → bloqueio sem token

---

## Etapa 5 — Regras de negócio de estacionamento

**O que é:** a lógica central do sistema — controlar o contador de vagas ocupadas/livres.
**Para que serve:** é o coração do domínio: sem isso, câmera e frontend não têm o que exibir ou processar.

- [ ] Criar repository de acesso à tabela `Estacionamento`
- [ ] Criar repository de acesso à tabela `Evento`
- [ ] Criar service que processa um evento de entrada (incrementa `vagas_ocupadas`)
- [ ] Criar service que processa um evento de saída (decrementa `vagas_ocupadas`)
- [ ] Garantir que o contador nunca fique negativo nem ultrapasse `total_vagas`
- [ ] Criar endpoint público `GET /estacionamento/status` (vagas livres/ocupadas)
- [ ] Validar entrada de dados com Zod nos controllers dessa etapa
- [ ] Testar cenários: vaga cheia, vaga vazia, eventos fora de ordem

---

## Etapa 6 — WebSocket no Node

**O que é:** o canal de comunicação em tempo real entre o serviço Python, o backend e o frontend.
**Para que serve:** permitir que o status das vagas seja atualizado ao vivo, sem o cliente precisar dar refresh.

- [ ] Configurar servidor WebSocket (`ws`) integrado ao Express
- [ ] Definir o schema (Zod) do evento recebido do Python (tipo, timestamp, estacionamento_id)
- [ ] Validar todo payload recebido via WebSocket com esse schema
- [ ] Conectar o recebimento do evento à service da Etapa 5 (entrada/saída)
- [ ] Implementar broadcast do novo status para todos os clientes Angular conectados
- [ ] Tratar desconexão/reconexão de clientes WebSocket
- [ ] Testar com um cliente WebSocket simulado (ex: script de teste ou Postman) antes de integrar o Python real

---

## Etapa 7 — Serviço Python (câmera + OpenCV)

**O que é:** o serviço que fala diretamente com a câmera.
**Para que serve:** captar o vídeo em tempo real, detectar quando um veículo entra ou sai, e avisar o backend.

> **Fase de teste:** para evitar a complexidade de conexão com a câmera Aitek (RTSP/rede) logo no início, os frames serão capturados a partir da **câmera de um celular**. Toda a arquitetura (Python/OpenCV, WebSocket, Node) permanece igual — só a fonte da imagem muda. Ver [documento central](./documento-central-estacionamento-inteligente.md#fase-de-teste).

- [ ] Configurar ambiente Python (venv) e instalar dependências (`opencv-python`, cliente WebSocket, etc.)
- [ ] Fase de teste: definir a forma de captura de frames a partir da câmera do celular (ex: app que expõe a câmera na rede local, ou captura manual de frames)
- [ ] Implementar loop de leitura contínua de frames a partir da fonte de teste (câmera do celular)
- [ ] Implementar lógica de detecção de veículo (entrada/saída)
- [ ] Montar o payload do evento em JSON conforme schema definido na Etapa 6
- [ ] Implementar cliente WebSocket para enviar o evento ao Node.js
- [ ] Testar detecção manual (simular passagem de veículo) e validar chegada do evento no backend
- [ ] Quando o projeto crescer: confirmar a URL RTSP exata da câmera Aitek (manual/app do fabricante) e trocar a fonte de captura de frames pela câmera real

---

## Etapa 8 — Frontend Angular

**O que é:** a interface visual do sistema, com uma parte pública e uma parte administrativa.
**Para que serve:** dar visibilidade do status do estacionamento para clientes e permitir gestão para o admin.

- [ ] Criar projeto Angular
- [ ] Criar tela pública: status das vagas em tempo real (sem login)
- [ ] Consumir `GET /estacionamento/status` (REST) para o estado inicial
- [ ] Conectar ao WebSocket para atualizações ao vivo na tela pública
- [ ] Criar tela de login admin
- [ ] Implementar guarda de rota (route guard) para proteger a área admin
- [ ] Criar área admin: histórico de eventos
- [ ] Criar área admin: configuração do estacionamento (ex: total de vagas)
- [ ] Tratar estados de erro/loading nas telas

---

## Etapa 9 — Infraestrutura & Deploy (Docker)

**O que é:** empacotar cada parte do sistema (backend, frontend, serviço Python e banco) em containers Docker.
**Para que serve:** garantir que o ambiente rode igual em qualquer máquina, facilitar o setup local e viabilizar o deploy.

### 9.1 — Containerização de cada serviço

- [ ] Criar `Dockerfile` do backend Node.js
- [ ] Criar `Dockerfile` do frontend Angular (build + servidor estático, ex: Nginx)
- [ ] Criar `Dockerfile` do serviço Python (com dependências de OpenCV)
- [ ] Criar `.dockerignore` em cada serviço (node_modules, dist, **pycache**, .env, etc.)

### 9.2 — Orquestração local com Docker Compose

- [ ] Criar `docker-compose.yml` na raiz do monorepo
- [ ] Adicionar serviço `postgres` (com volume para persistência dos dados)
- [ ] Adicionar serviço `backend` (depende do `postgres`)
- [ ] Adicionar serviço `frontend`
- [ ] Adicionar serviço `camera-service` (depende do `backend` estar de pé)
- [ ] Configurar rede interna do Docker para comunicação entre os serviços
- [ ] Configurar variáveis de ambiente de cada serviço via `.env` referenciado no compose
- [ ] Subir tudo com `docker compose up -d` e validar que os serviços conversam entre si
- [ ] Rodar as migrations do Prisma dentro do container do backend (`docker compose exec backend ...`)

### 9.3 — Deploy

- [ ] Definir o ambiente de destino do deploy (ex: VPS, servidor local, nuvem) — **decisão a ser autorizada antes de seguir**
- [ ] Documentar passo a passo de build e subida das imagens em produção
- [ ] Configurar variáveis de ambiente de produção (segredos, JWT secret, URL do banco)
- [ ] Validar acesso externo à tela pública e à área admin após deploy

---

## Etapa 10 — Polimento (portfólio-ready)

**O que é:** os últimos ajustes de qualidade antes de considerar o projeto pronto para mostrar no portfólio.
**Para que serve:** deixar o projeto com cara profissional — não só funcionando, mas bem documentado e apresentável.

- [ ] Revisar logs estruturados em todos os serviços
- [ ] Escrever README completo (setup, como rodar com Docker, prints do sistema funcionando)
- [ ] Revisar tratamento de erros ponta a ponta (Python → Node → Angular)
- [ ] Revisar validações (Zod) em todos os controllers
- [ ] Conferir se rotas públicas e administrativas estão corretamente protegidas
- [ ] (Opcional, apenas com autorização) Avaliar funcionalidade de previsão de lotação

---

## 📌 Como usar este documento

1. Siga a ordem das etapas (ela reflete as dependências técnicas: banco antes de regra de negócio, WebSocket antes do serviço Python, etc.).
2. Marque cada passo como `[x]` assim que for concluído.
3. Atualize a tabela de **Visão geral do progresso** no topo conforme cada etapa avançar.
4. Qualquer decisão nova que surgir durante a execução (ex: onde fazer o deploy) deve ser registrada e autorizada no [documento central](./documento-central-estacionamento-inteligente.md) antes de ser aplicada aqui.
