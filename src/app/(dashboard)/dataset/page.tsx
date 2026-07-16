import Link from "next/link";

import { prisma } from "@/lib/prisma";

type DatasetPageProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
  }>;
};

export default async function DatasetPage({ searchParams }: DatasetPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? "1");
  const pageSize = Number(resolvedSearchParams.pageSize ?? "50");
  const search = resolvedSearchParams.search?.trim();

  const where = search
    ? {
        custId: {
          contains: search,
        },
      }
    : undefined;

  const [total, rows] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      orderBy: { custId: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Dataset</h1>

      <form className="card grid gap-3 p-4 md:grid-cols-[1fr_140px_auto_auto]">
        <input
          name="search"
          defaultValue={search ?? ""}
          placeholder="Buscar por CUST_ID"
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <select name="pageSize" defaultValue={String(pageSize)} className="rounded-md border border-slate-300 px-3 py-2">
          {[25, 50, 100, 200, 500, 1000].map((size) => (
            <option key={size} value={size}>
              {size}/pag
            </option>
          ))}
        </select>
        <button className="rounded-md bg-teal-700 px-4 py-2 font-medium text-white">Filtrar</button>
        <a
          href="/api/dataset/download"
          className="rounded-md border border-slate-300 px-4 py-2 text-center font-medium"
        >
          Baixar CSV
        </a>
      </form>

      <div className="card overflow-x-auto">
        <table className="min-w-[1400px] text-sm">
          <thead className="sticky top-0 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-3 py-2">CUST_ID</th>
              <th className="px-3 py-2">BALANCE</th>
              <th className="px-3 py-2">PURCHASES</th>
              <th className="px-3 py-2">ONEOFF_PURCHASES</th>
              <th className="px-3 py-2">INSTALLMENTS_PURCHASES</th>
              <th className="px-3 py-2">CASH_ADVANCE</th>
              <th className="px-3 py-2">CREDIT_LIMIT</th>
              <th className="px-3 py-2">PAYMENTS</th>
              <th className="px-3 py-2">MINIMUM_PAYMENTS</th>
              <th className="px-3 py-2">PRC_FULL_PAYMENT</th>
              <th className="px-3 py-2">TENURE</th>
              <th className="px-3 py-2">clusterId</th>
              <th className="px-3 py-2">segmentLabel</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-3 py-2">{row.custId}</td>
                <td className="px-3 py-2">{row.balance.toFixed(2)}</td>
                <td className="px-3 py-2">{row.purchases.toFixed(2)}</td>
                <td className="px-3 py-2">{row.oneoffPurchases.toFixed(2)}</td>
                <td className="px-3 py-2">{row.installmentsPurchases.toFixed(2)}</td>
                <td className="px-3 py-2">{row.cashAdvance.toFixed(2)}</td>
                <td className="px-3 py-2">{row.creditLimit?.toFixed(2) ?? ""}</td>
                <td className="px-3 py-2">{row.payments.toFixed(2)}</td>
                <td className="px-3 py-2">{row.minimumPayments?.toFixed(2) ?? ""}</td>
                <td className="px-3 py-2">{row.prcFullPayment.toFixed(4)}</td>
                <td className="px-3 py-2">{row.tenure}</td>
                <td className="px-3 py-2">{row.clusterId ?? ""}</td>
                <td className="px-3 py-2">{row.segmentLabel ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card flex flex-col gap-3 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
        <p>
          Exibindo {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} de {total}
        </p>
        <div className="flex gap-2">
          <Link
            href={`?page=${Math.max(1, page - 1)}&pageSize=${pageSize}&search=${search ?? ""}`}
            className="rounded-md border border-slate-300 px-3 py-1.5"
          >
            Anterior
          </Link>
          <span className="rounded-md border border-slate-300 px-3 py-1.5">
            Página {page} de {totalPages}
          </span>
          <Link
            href={`?page=${Math.min(totalPages, page + 1)}&pageSize=${pageSize}&search=${search ?? ""}`}
            className="rounded-md border border-slate-300 px-3 py-1.5"
          >
            Próxima
          </Link>
        </div>
      </div>
    </section>
  );
}
