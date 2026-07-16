type CustomerMetricInput = {
  balance: number;
  purchases: number;
  creditLimit: number | null;
  payments: number;
  prcFullPayment: number;
  tenure: number;
  cashAdvance: number;
};

export function aggregateMetrics(rows: CustomerMetricInput[]) {
  const total = rows.length;
  if (total === 0) {
    return {
      totalCustomers: 0,
      avgBalance: 0,
      avgPurchases: 0,
      avgCreditLimit: 0,
      avgPayments: 0,
      avgPrcFullPayment: 0,
      avgTenure: 0,
      cashAdvanceUsersPct: 0,
    };
  }

  const sum = rows.reduce(
    (acc, row) => {
      acc.balance += row.balance;
      acc.purchases += row.purchases;
      acc.creditLimit += row.creditLimit ?? 0;
      acc.payments += row.payments;
      acc.prcFullPayment += row.prcFullPayment;
      acc.tenure += row.tenure;
      if (row.cashAdvance > 0) acc.cashAdvanceUsers += 1;
      return acc;
    },
    {
      balance: 0,
      purchases: 0,
      creditLimit: 0,
      payments: 0,
      prcFullPayment: 0,
      tenure: 0,
      cashAdvanceUsers: 0,
    },
  );

  return {
    totalCustomers: total,
    avgBalance: sum.balance / total,
    avgPurchases: sum.purchases / total,
    avgCreditLimit: sum.creditLimit / total,
    avgPayments: sum.payments / total,
    avgPrcFullPayment: sum.prcFullPayment / total,
    avgTenure: sum.tenure / total,
    cashAdvanceUsersPct: sum.cashAdvanceUsers / total,
  };
}
