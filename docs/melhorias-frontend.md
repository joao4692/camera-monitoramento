# 🎨 Melhorias Frontend — Tela do Usuário (Prototipagem)

> Desdobramento operacional focado na tela pública (lado do usuário/cliente), sem login. Objetivo: deixar mais bonita, responsiva pra celular, e prototipar visualmente conceitos futuros (reserva, busca por estacionamento) **sem construir back-end real pra eles** — são elementos de interface pra demonstração/portfólio, não funcionalidade de produção.
>
> Ligação com o resto do projeto: não altera nada do [documento central](./documento-central-estacionamento-inteligente.md) nem do [checklist principal](./plano-de-execucao-checklist.md) — é um refinamento visual da Etapa 8 (Frontend Angular), feito em conjunto com o usuário aprendendo Angular na prática.

## Decisões desta frente de trabalho

- **Busca por estacionamento** (topo da página) e **fluxo de reserva** (vaga/horário/pagamento) são **protótipos visuais** — sem chamada a endpoint novo, sem persistência no banco, sem lógica de negócio real. Servem pra mostrar a ideia de produto, não pra funcionar de verdade.
- **Modo de trabalho**: código é entregue em blocos (Lógica/`.ts`, Marcação/`.html`, Estilo/`.css`) com comentários explicando o que faz — o usuário mesmo cola nos arquivos, aprendendo Angular na prática.
- Escopo restrito à **tela pública** (`features/public-status`) — painel admin não entra nessa rodada.

## Passos planejados

- [ ] 1. Cabeçalho — header com identidade visual, título e (futuramente) navegação
- [ ] 2. Blocos separados de vagas — cards distintos pra "Vagas livres", "Total de vagas" e "Ocupadas" (hoje é um card só)
- [ ] 3. Barra de busca (protótipo, não funcional) — visual de "buscar estacionamento", preparando terreno pra ideia futura de múltiplos estacionamentos
- [ ] 4. Botão "Fazer reserva"
- [ ] 5. Fluxo de reserva (modal/tela): selecionar vaga, selecionar horário, forma de pagamento (Pix / Cartão crédito / Cartão débito) — tudo simulado, sem back-end
- [ ] 6. Responsividade/otimização para celular em toda a tela

Cada passo marcado como concluído aqui conforme formos implementando juntos.
