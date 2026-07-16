export type DashboardMetrics = {
  totalCustomers: number;
  nSegments: number;
  avgBalance: number;
  avgPurchases: number;
  avgCreditLimit: number;
  avgPayments: number;
  avgPrcFullPayment: number;
  avgTenure: number;
  cashAdvanceUsersPct: number;
};

export type SegmentSummary = {
  clusterId: number;
  label: string;
  customerCount: number;
  sharePct: number;
  avgBalance: number;
  avgPurchases: number;
  avgCashAdvance: number;
  avgCreditLimit: number;
  avgPrcFullPayment: number;
};

export type InsightItem = {
  key: string;
  title: string;
  text: string;
  value: number;
};
