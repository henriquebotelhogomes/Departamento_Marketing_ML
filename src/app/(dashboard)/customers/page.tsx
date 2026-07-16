import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { SegmentBadge } from "@/components/customers/segment-badge";

type CustomersPageProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    segment?: string;
  }>;
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? "1");
  const pageSize = Number(resolvedSearchParams.pageSize ?? "25");
  const search = resolvedSearchParams.search?.trim();
  const segment = resolvedSearchParams.segment?.trim();

  const where = {
    ...(search
      ? {
          custId: {
            contains: search,
          },
        }
      : {}),
    ...(segment ? { segmentLabel: segment } : {}),
  };

  const [total, customers, segments] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      orderBy: { custId: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.segment.findMany({ orderBy: { label: "asc" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Clientes</h1>

      <form className="card grid gap-3 p-4 md:grid-cols-[1fr_220px_120px_auto]">
        <input
          name="search"
          defaultValue={search ?? ""}
          placeholder="Buscar por CUST_ID"
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <select
          name="segment"
          defaultValue={segment ?? ""}
          className="rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="">Todos os segmentos</option>
          {segments.map((item) => (
            <option key={item.id} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
        <select name="pageSize" defaultValue={String(pageSize)} className="rounded-md border border-slate-300 px-3 py-2">
          {[25, 50, 100, 200, 500, 1000].map((size) => (
            <option key={size} value={size}>
              {size}/pag
            </option>
          ))}
        </select>
        <button className="rounded-md bg-teal-700 px-4 py-2 font-medium text-white">Filtrar</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600 dark:bg-slate-800/90 dark:text-slate-200">
            <tr>
              <th className="px-3 py-2">CUST_ID</th>
              <th className="px-3 py-2">Segmento</th>
              <th className="px-3 py-2">Saldo</th>
              <th className="px-3 py-2">Compras</th>
              <th className="px-3 py-2">Cash Advance</th>
              <th className="px-3 py-2">Limite</th>
              <th className="px-3 py-2">% Fatura Integral</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="px-3 py-2 font-medium text-teal-800 dark:text-teal-300">
                  <Link href={`/customers/${customer.id}`}>{customer.custId}</Link>
                </td>
                <td className="px-3 py-2">
                  <SegmentBadge label={customer.segmentLabel} />
                </td>
                <td className="px-3 py-2">{formatCurrency(customer.balance)}</td>
                <td className="px-3 py-2">{formatCurrency(customer.purchases)}</td>
                <td className="px-3 py-2">{formatCurrency(customer.cashAdvance)}</td>
                <td className="px-3 py-2">{formatCurrency(customer.creditLimit)}</td>
                <td className="px-3 py-2">{formatPercent(customer.prcFullPayment)}</td>
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
            href={`?page=${Math.max(1, page - 1)}&pageSize=${pageSize}&search=${search ?? ""}&segment=${segment ?? ""}`}
            className="rounded-md border border-slate-300 px-3 py-1.5"
          >
            Anterior
          </Link>
          <span className="rounded-md border border-slate-300 px-3 py-1.5">
            Página {page} de {totalPages}
          </span>
          <Link
            href={`?page=${Math.min(totalPages, page + 1)}&pageSize=${pageSize}&search=${search ?? ""}&segment=${segment ?? ""}`}
            className="rounded-md border border-slate-300 px-3 py-1.5"
          >
            Próxima
          </Link>
        </div>
      </div>
    </section>
  );
}
