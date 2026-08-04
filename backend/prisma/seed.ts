import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/services/auth.service";

async function main() {
  const estacionamento = await prisma.estacionamento.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "Estacionamento Teste",
      localizacao: "Endereço de teste",
      totalVagas: 50,
      vagasOcupadas: 0,
    },
  });

  const adminEmail = process.env.ADMIN_SEED_EMAIL;
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_SEED_EMAIL/ADMIN_SEED_PASSWORD não definidos no .env");
  }

  const admin = await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: "Admin",
      email: adminEmail,
      senhaHash: await hashPassword(adminPassword),
      tipo: "admin",
    },
  });

  console.log("Seed concluído:", { estacionamento, admin: { ...admin, senhaHash: "[oculto]" } });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
