import { readFileSync } from "node:fs";
import { join } from "node:path";

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import Papa from "papaparse";

type MarketingRow = {
  CUST_ID: string;
  BALANCE: string;
  BALANCE_FREQUENCY: string;
  PURCHASES: string;
  ONEOFF_PURCHASES: string;
  INSTALLMENTS_PURCHASES: string;
  CASH_ADVANCE: string;
  PURCHASES_FREQUENCY: string;
  ONEOFF_PURCHASES_FREQUENCY: string;
  PURCHASES_INSTALLMENTS_FREQUENCY: string;
  CASH_ADVANCE_FREQUENCY: string;
  CASH_ADVANCE_TRX: string;
  PURCHASES_TRX: string;
  CREDIT_LIMIT: string;
  PAYMENTS: string;
  MINIMUM_PAYMENTS: string;
  PRC_FULL_PAYMENT: string;
  TENURE: string;
};

type SegmentRow = {
  CUST_ID: string;
  clusterId: string;
  pca1: string;
  pca2: string;
  segmentLabel: string;
  modelVersion: string;
};

type SegmentProfile = {
  clusterId: number;
  label: string;
  description: string;
  customerCount: number;
  sharePct: number;
  dominantFeatures: unknown;
  avgBalance: number;
  avgPurchases: number;
  avgCashAdvance: number;
  avgCreditLimit: number;
  avgPrcFullPayment: number;
  recommendation: unknown;
};

type SegmentProfilesFile = {
  modelVersion: string;
  segments: SegmentProfile[];
};

const prisma = new PrismaClient();

const toFloat = (value: string): number | null => {
  if (value === "" || value == null) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toInt = (value: string): number => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseCsv = <T>(filePath: string): T[] => {
  const content = readFileSync(filePath, "utf-8");
  const parsed = Papa.parse<T>(content, {
    header: true,
    skipEmptyLines: true,
  });
  if (parsed.errors.length > 0) {
    throw new Error(`Falha ao parsear CSV ${filePath}: ${parsed.errors[0]?.message ?? "erro"}`);
  }
  return parsed.data;
};

async function main(): Promise<void> {
  const root = process.cwd();
  const marketingPath = join(root, "data", "Marketing_data.csv");
  const segmentsPath = join(root, "data", "segments.csv");
  const profilesPath = join(root, "data", "segment_profiles.json");

  const marketingRows = parseCsv<MarketingRow>(marketingPath);

  let segmentByCustId = new Map<string, SegmentRow>();
  let profiles: SegmentProfilesFile | null = null;

  try {
    const segmentRows = parseCsv<SegmentRow>(segmentsPath);
    segmentByCustId = new Map(segmentRows.map((row) => [row.CUST_ID, row]));
  } catch {
    console.warn("[seed] data/segments.csv nao encontrado. Clientes serao importados sem segmentacao.");
  }

  try {
    const profilesContent = readFileSync(profilesPath, "utf-8");
    profiles = JSON.parse(profilesContent) as SegmentProfilesFile;
  } catch {
    console.warn("[seed] data/segment_profiles.json nao encontrado. Segmentos de negocio nao serao carregados.");
  }

  const demoHash = await bcrypt.hash("demo123", 12);
  await prisma.user.upsert({
    where: { email: "demo123" },
    update: { name: "Usuario Demo", password: demoHash },
    create: { name: "Usuario Demo", email: "demo123", password: demoHash },
  });

  if (profiles) {
    for (const seg of profiles.segments) {
      await prisma.segment.upsert({
        where: {
          modelVersion_clusterId: {
            modelVersion: profiles.modelVersion,
            clusterId: seg.clusterId,
          },
        },
        update: {
          label: seg.label,
          description: seg.description,
          customerCount: seg.customerCount,
          sharePct: seg.sharePct,
          dominantFeatures: JSON.stringify(seg.dominantFeatures),
          avgBalance: seg.avgBalance,
          avgPurchases: seg.avgPurchases,
          avgCashAdvance: seg.avgCashAdvance,
          avgCreditLimit: seg.avgCreditLimit,
          avgPrcFullPayment: seg.avgPrcFullPayment,
          recommendation: JSON.stringify(seg.recommendation),
        },
        create: {
          modelVersion: profiles.modelVersion,
          clusterId: seg.clusterId,
          label: seg.label,
          description: seg.description,
          customerCount: seg.customerCount,
          sharePct: seg.sharePct,
          dominantFeatures: JSON.stringify(seg.dominantFeatures),
          avgBalance: seg.avgBalance,
          avgPurchases: seg.avgPurchases,
          avgCashAdvance: seg.avgCashAdvance,
          avgCreditLimit: seg.avgCreditLimit,
          avgPrcFullPayment: seg.avgPrcFullPayment,
          recommendation: JSON.stringify(seg.recommendation),
        },
      });
    }

    await prisma.segmentationConfig.upsert({
      where: { id: "default" },
      update: { activeModelVersion: profiles.modelVersion },
      create: { id: "default", activeModelVersion: profiles.modelVersion },
    });
  }

  for (const row of marketingRows) {
    const segment = segmentByCustId.get(row.CUST_ID);

    await prisma.customer.upsert({
      where: { custId: row.CUST_ID },
      update: {
        balance: toFloat(row.BALANCE) ?? 0,
        balanceFrequency: toFloat(row.BALANCE_FREQUENCY) ?? 0,
        purchases: toFloat(row.PURCHASES) ?? 0,
        oneoffPurchases: toFloat(row.ONEOFF_PURCHASES) ?? 0,
        installmentsPurchases: toFloat(row.INSTALLMENTS_PURCHASES) ?? 0,
        cashAdvance: toFloat(row.CASH_ADVANCE) ?? 0,
        purchasesFrequency: toFloat(row.PURCHASES_FREQUENCY) ?? 0,
        oneoffPurchasesFrequency: toFloat(row.ONEOFF_PURCHASES_FREQUENCY) ?? 0,
        purchasesInstallmentsFrequency:
          toFloat(row.PURCHASES_INSTALLMENTS_FREQUENCY) ?? 0,
        cashAdvanceFrequency: toFloat(row.CASH_ADVANCE_FREQUENCY) ?? 0,
        cashAdvanceTrx: toInt(row.CASH_ADVANCE_TRX),
        purchasesTrx: toInt(row.PURCHASES_TRX),
        creditLimit: toFloat(row.CREDIT_LIMIT),
        payments: toFloat(row.PAYMENTS) ?? 0,
        minimumPayments: toFloat(row.MINIMUM_PAYMENTS),
        prcFullPayment: toFloat(row.PRC_FULL_PAYMENT) ?? 0,
        tenure: toInt(row.TENURE),
        clusterId: segment ? toInt(segment.clusterId) : null,
        segmentLabel: segment?.segmentLabel ?? null,
        pca1: segment ? toFloat(segment.pca1) : null,
        pca2: segment ? toFloat(segment.pca2) : null,
        modelVersion: segment?.modelVersion ?? null,
        scoredAt: segment ? new Date() : null,
      },
      create: {
        custId: row.CUST_ID,
        balance: toFloat(row.BALANCE) ?? 0,
        balanceFrequency: toFloat(row.BALANCE_FREQUENCY) ?? 0,
        purchases: toFloat(row.PURCHASES) ?? 0,
        oneoffPurchases: toFloat(row.ONEOFF_PURCHASES) ?? 0,
        installmentsPurchases: toFloat(row.INSTALLMENTS_PURCHASES) ?? 0,
        cashAdvance: toFloat(row.CASH_ADVANCE) ?? 0,
        purchasesFrequency: toFloat(row.PURCHASES_FREQUENCY) ?? 0,
        oneoffPurchasesFrequency: toFloat(row.ONEOFF_PURCHASES_FREQUENCY) ?? 0,
        purchasesInstallmentsFrequency:
          toFloat(row.PURCHASES_INSTALLMENTS_FREQUENCY) ?? 0,
        cashAdvanceFrequency: toFloat(row.CASH_ADVANCE_FREQUENCY) ?? 0,
        cashAdvanceTrx: toInt(row.CASH_ADVANCE_TRX),
        purchasesTrx: toInt(row.PURCHASES_TRX),
        creditLimit: toFloat(row.CREDIT_LIMIT),
        payments: toFloat(row.PAYMENTS) ?? 0,
        minimumPayments: toFloat(row.MINIMUM_PAYMENTS),
        prcFullPayment: toFloat(row.PRC_FULL_PAYMENT) ?? 0,
        tenure: toInt(row.TENURE),
        clusterId: segment ? toInt(segment.clusterId) : null,
        segmentLabel: segment?.segmentLabel ?? null,
        pca1: segment ? toFloat(segment.pca1) : null,
        pca2: segment ? toFloat(segment.pca2) : null,
        modelVersion: segment?.modelVersion ?? null,
        scoredAt: segment ? new Date() : null,
      },
    });
  }

  const metricsPath = join(root, "analysis", "models", "metrics_v1.json");
  try {
    const metricsContent = readFileSync(metricsPath, "utf-8");
    const metrics = JSON.parse(metricsContent) as Record<string, unknown>;
    const modelVersion = String(metrics.modelVersion ?? "v1");
    await prisma.clusterRun.upsert({
      where: { modelVersion },
      update: {
        algorithm: String(metrics.algorithm ?? "Autoencoder+KMeans"),
        nClusters: Number(metrics.nClusters ?? 4),
        silhouette: Number(metrics.silhouette ?? 0),
        daviesBouldin: Number(metrics.daviesBouldin ?? 0),
        calinskiHarabasz: Number(metrics.calinskiHarabasz ?? 0),
        inertia: Number(metrics.inertia ?? 0),
        usedAutoencoder: Boolean(metrics.usedAutoencoder ?? true),
        nComponentsPca: Number(metrics.nComponentsPca ?? 2),
        trainedAt: new Date(String(metrics.trainedAt ?? new Date().toISOString())),
        notes: "Importado automaticamente do metrics_v1.json",
      },
      create: {
        modelVersion,
        algorithm: String(metrics.algorithm ?? "Autoencoder+KMeans"),
        nClusters: Number(metrics.nClusters ?? 4),
        silhouette: Number(metrics.silhouette ?? 0),
        daviesBouldin: Number(metrics.daviesBouldin ?? 0),
        calinskiHarabasz: Number(metrics.calinskiHarabasz ?? 0),
        inertia: Number(metrics.inertia ?? 0),
        usedAutoencoder: Boolean(metrics.usedAutoencoder ?? true),
        nComponentsPca: Number(metrics.nComponentsPca ?? 2),
        trainedAt: new Date(String(metrics.trainedAt ?? new Date().toISOString())),
        notes: "Importado automaticamente do metrics_v1.json",
      },
    });
  } catch {
    console.warn("[seed] analysis/models/metrics_v1.json nao encontrado.");
  }

  const customers = await prisma.customer.count();
  const segments = await prisma.segment.count();
  console.log(`[seed] concluido: ${customers} clientes, ${segments} segmentos, usuario demo pronto.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
