"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

type DashboardFiltersProps = {
  allSegments: Array<{ id: string; label: string }>;
  searchParams: {
    segment?: string;
    minBalance?: string;
    maxBalance?: string;
    minPurchases?: string;
    maxPurchases?: string;
    minCreditLimit?: string;
    maxCreditLimit?: string;
    tenure?: string;
    prcFullPaymentMin?: string;
    prcFullPaymentMax?: string;
  };
};

export function DashboardFilters({ allSegments, searchParams }: DashboardFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState({
    segment: searchParams.segment ?? "",
    minBalance: searchParams.minBalance ?? "",
    maxBalance: searchParams.maxBalance ?? "",
    minPurchases: searchParams.minPurchases ?? "",
    maxPurchases: searchParams.maxPurchases ?? "",
    maxCreditLimit: searchParams.maxCreditLimit ?? "",
    tenure: searchParams.tenure ?? "",
    prcFullPaymentMin: searchParams.prcFullPaymentMin ?? "",
    prcFullPaymentMax: searchParams.prcFullPaymentMax ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (filters.segment) params.set("segment", filters.segment);
    if (filters.minBalance) params.set("minBalance", filters.minBalance);
    if (filters.maxBalance) params.set("maxBalance", filters.maxBalance);
    if (filters.minPurchases) params.set("minPurchases", filters.minPurchases);
    if (filters.maxPurchases) params.set("maxPurchases", filters.maxPurchases);
    if (filters.maxCreditLimit) params.set("maxCreditLimit", filters.maxCreditLimit);
    if (filters.tenure) params.set("tenure", filters.tenure);
    if (filters.prcFullPaymentMin) params.set("prcFullPaymentMin", filters.prcFullPaymentMin);
    if (filters.prcFullPaymentMax) params.set("prcFullPaymentMax", filters.prcFullPaymentMax);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(newUrl as any);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      <select
        name="segment"
        value={filters.segment}
        onChange={handleChange}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      >
        <option value="">Todos segmentos</option>
        {allSegments.map((item) => (
          <option key={item.id} value={item.label}>
            {item.label}
          </option>
        ))}
      </select>
      <input
        name="minBalance"
        type="number"
        min="0"
        step="0.01"
        placeholder="Saldo min"
        value={filters.minBalance}
        onChange={handleChange}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
      <input
        name="maxBalance"
        type="number"
        min="0"
        step="0.01"
        placeholder="Saldo máx"
        value={filters.maxBalance}
        onChange={handleChange}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
      <input
        name="minPurchases"
        type="number"
        min="0"
        step="0.01"
        placeholder="Compras min"
        value={filters.minPurchases}
        onChange={handleChange}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
      <input
        name="maxPurchases"
        type="number"
        min="0"
        step="0.01"
        placeholder="Compras máx"
        value={filters.maxPurchases}
        onChange={handleChange}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
      <input
        name="maxCreditLimit"
        type="number"
        min="0"
        step="0.01"
        placeholder="Limite máx"
        value={filters.maxCreditLimit}
        onChange={handleChange}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
      <select
        name="tenure"
        value={filters.tenure}
        onChange={handleChange}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      >
        <option value="">Tenure</option>
        {[6, 7, 8, 9, 10, 11, 12].map((t) => (
          <option key={t} value={t}>
            {t} meses
          </option>
        ))}
      </select>
      <input
        name="prcFullPaymentMin"
        type="number"
        min="0"
        max="1"
        step="0.01"
        placeholder="% Pagto min"
        value={filters.prcFullPaymentMin}
        onChange={handleChange}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
      <input
        name="prcFullPaymentMax"
        type="number"
        min="0"
        max="1"
        step="0.01"
        placeholder="% Pagto máx"
        value={filters.prcFullPaymentMax}
        onChange={handleChange}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
      <button
        type="submit"
        className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800"
      >
        Aplicar
      </button>
    </form>
  );
}
