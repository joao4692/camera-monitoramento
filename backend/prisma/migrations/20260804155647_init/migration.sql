-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('entrada', 'saida');

-- CreateTable
CREATE TABLE "estacionamentos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "total_vagas" INTEGER NOT NULL,
    "vagas_ocupadas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "estacionamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoEvento" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estacionamento_id" INTEGER NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_estacionamento_id_fkey" FOREIGN KEY ("estacionamento_id") REFERENCES "estacionamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
