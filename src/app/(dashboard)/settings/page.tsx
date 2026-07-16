import { SettingsForm } from "@/components/settings/settings-form";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const config = await prisma.segmentationConfig.findUnique({ where: { id: "default" } });
  const activeModelVersion = config?.activeModelVersion ?? "v1";
  const segments = await prisma.segment.findMany({
    where: { modelVersion: activeModelVersion },
    orderBy: { clusterId: "asc" },
    select: {
      id: true,
      clusterId: true,
      label: true,
      description: true,
    },
  });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Configurações</h1>
      <p className="text-sm text-slate-600">
        Ajuste rótulos de segmento e versão ativa de modelo sem re-treino.
      </p>
      <SettingsForm activeModelVersion={activeModelVersion} segments={segments} />
    </section>
  );
}
