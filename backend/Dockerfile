# Roda via ts-node em vez de node+tsc compilado: o client TypeScript
# gerado pelo Prisma 7 importa seus próprios arquivos internos com
# extensão ".ts" explícita (ex: require("./internal/class.ts")), o que
# só resolve corretamente via ts-node — com `tsc` + `node` puro dá
# "Cannot find module './internal/class.ts'" porque o .js compilado
# mantém a extensão original no require(). Rodar via ts-node é
# exatamente o que já usamos em todo o desenvolvimento local (`npm run
# dev`), então é o caminho comprovado. Migrar pra um build compilado de
# verdade (ex: com esbuild/tsup, que reescrevem essas extensões) é uma
# melhoria pra Etapa 10, não bloqueia agora.
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

COPY . .
RUN npx prisma generate

EXPOSE 3000

# migrate deploy aplica as migrations pendentes no banco de produção;
# db seed é idempotente (usa upsert), seguro rodar em todo start.
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npx ts-node src/server.ts"]
