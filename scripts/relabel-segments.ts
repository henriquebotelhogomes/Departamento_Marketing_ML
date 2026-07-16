import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const mappings = [
    { clusterId: 0, label: "Devedor Rotativo" },
    { clusterId: 1, label: "Comprador Ativo" },
    { clusterId: 2, label: "Bom Pagador" },
    { clusterId: 3, label: "Usuário de Adiantamento" },
  ];

  const config = await prisma.segmentationConfig.findUnique({ where: { id: "default" } });
  const modelVersion = config?.activeModelVersion ?? "v1";

  for (const mapping of mappings) {
    await prisma.segment.updateMany({
      where: { modelVersion, clusterId: mapping.clusterId },
      data: { label: mapping.label },
    });

    await prisma.customer.updateMany({
      where: { modelVersion, clusterId: mapping.clusterId },
      data: { segmentLabel: mapping.label },
    });
  }

  console.log("Relabel concluido.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
