import "dotenv/config";
import { prisma } from "../src/lib/prisma";

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

  console.log("Seed concluído:", estacionamento);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
