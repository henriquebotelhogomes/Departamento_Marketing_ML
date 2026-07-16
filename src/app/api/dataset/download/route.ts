import { prisma } from "@/lib/prisma";

const header = [
  "custId",
  "balance",
  "balanceFrequency",
  "purchases",
  "oneoffPurchases",
  "installmentsPurchases",
  "cashAdvance",
  "purchasesFrequency",
  "oneoffPurchasesFrequency",
  "purchasesInstallmentsFrequency",
  "cashAdvanceFrequency",
  "cashAdvanceTrx",
  "purchasesTrx",
  "creditLimit",
  "payments",
  "minimumPayments",
  "prcFullPayment",
  "tenure",
  "clusterId",
  "segmentLabel",
  "pca1",
  "pca2",
  "modelVersion",
];

export async function GET(): Promise<Response> {
  const rows = await prisma.customer.findMany({ orderBy: { custId: "asc" } });

  const csvLines = [header.join(",")];
  for (const row of rows) {
    csvLines.push(
      [
        row.custId,
        row.balance,
        row.balanceFrequency,
        row.purchases,
        row.oneoffPurchases,
        row.installmentsPurchases,
        row.cashAdvance,
        row.purchasesFrequency,
        row.oneoffPurchasesFrequency,
        row.purchasesInstallmentsFrequency,
        row.cashAdvanceFrequency,
        row.cashAdvanceTrx,
        row.purchasesTrx,
        row.creditLimit ?? "",
        row.payments,
        row.minimumPayments ?? "",
        row.prcFullPayment,
        row.tenure,
        row.clusterId ?? "",
        row.segmentLabel ?? "",
        row.pca1 ?? "",
        row.pca2 ?? "",
        row.modelVersion ?? "",
      ].join(","),
    );
  }

  const csv = csvLines.join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="marketing_customers_segmented.csv"',
    },
  });
}
