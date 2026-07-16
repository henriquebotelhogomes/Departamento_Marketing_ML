type CustomerDetailPageProps = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

import { notFound } from "next/navigation";

import { SegmentBadge } from "@/components/customers/segment-badge";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatPercent, maskCustId } from "@/lib/utils";

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });

  if (!customer) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Cliente {maskCustId(customer.custId)}</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-semibold">Perfil financeiro</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Saldo</dt>
              <dd className="font-medium">{formatCurrency(customer.balance)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Compras</dt>
              <dd className="font-medium">{formatCurrency(customer.purchases)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Cash Advance</dt>
              <dd className="font-medium">{formatCurrency(customer.cashAdvance)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Limite de crédito</dt>
              <dd className="font-medium">{formatCurrency(customer.creditLimit)}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-semibold">Segmentação</h2>
          <div className="mb-3">
            <SegmentBadge label={customer.segmentLabel} />
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Taxa de pagamento integral</dt>
              <dd className="font-medium">{formatPercent(customer.prcFullPayment)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Tenure</dt>
              <dd className="font-medium">{customer.tenure} meses</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">PCA</dt>
              <dd className="font-medium">
                ({customer.pca1?.toFixed(3) ?? "-"}, {customer.pca2?.toFixed(3) ?? "-"})
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}
