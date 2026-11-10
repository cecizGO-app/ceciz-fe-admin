import type { CountryCode } from "./common";

export type FinancialTab = "laba-go" | "gaji-admin" | "rekap-pembayaran";

export interface FinancialKpiMetrics {
  revenue: number;
  cost: number;
  grossProfit: number;
  netProfit: number;
  revenueTrend?: number; // e.g. -2.4%
  costTrend?: number; // e.g. +4.1%
  grossProfitTrend?: number;
  netProfitTrend?: number;
}

export interface BatchOptionForProfit {
  id: string;
  batchNumber: string;
  countryCode: CountryCode;
  labaAmount: number;
  totalPc: number;
  date: string;
  status: string;
}

export interface ProfitPeriodFormData {
  periodName: string;
  startDate: string;
  endDate: string;
  selectedBatchIds: string[];
  packingExpense: number;
  otherExpense: number;
  otherExpenseNotes: string;
  adminASplit: number; // Persentase Gaji Admin A (default 80%)
  adminBSplit: number; // Persentase Gaji Admin B (default 20%)
  savingsPercent: number; // Sisihan Tabungan GO (%)
  periodNotes: string;
}

export interface ProfitPeriodSummary {
  totalPackingExpense: number;
  totalOtherExpense: number;
  totalModal: number;
  totalLabaBatch: number;
  labaBersih: number;
  gajiAdminA: number;
  gajiAdminB: number;
  tabunganGO: number;
}

export interface ProfitPeriodHistoryItem {
  id: string;
  periodName: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  batches: string[];
  pemasukan: number;
  modal: number;
  labaBersih: number;
  notes: string;
  createdAt: string;
}

export interface MonthlyProfitTrend {
  month: string;
  revenue: number;
  profit: number;
  marginPercent?: number;
}

export interface AdminSalaryRecord {
  adminName: string;
  role: string;
  feeNyelem: number;
  feeRekap: number;
  profitShareAmount: number;
  totalGaji: number;
  period: string;
  paymentStatus: "PENDING" | "PAID";
}

export interface AdminFeeBatchRow {
  id: string;
  batchNumber: string;
  countryCode?: CountryCode | string;
  feeNyelem: number;
  feeRekap: number;
  notes?: string;
}

export interface AdminFeePeriodRecord {
  id: string;
  periodName: string;
  adminName: string;
  startDate: string;
  endDate: string;
  batchCount: number;
  batches?: AdminFeeBatchRow[];
  feeNyelem: number;
  feeRekap: number;
  totalFee: number;
  notes: string;
}

export interface PaymentMethodSummary {
  id: string;
  method: string;
  paymentCount: number;
  totalAmount: number;
  sharePercent: number;
  lastPaymentTime: string;
}

export interface PaymentSummaryRecord {
  invoiceId: string;
  buyerName: string;
  type: "BATCH" | "TAX";
  batchNumber: string;
  amount: number;
  status: "PAID" | "UNPAID" | "AWAITING_VERIFICATION";
  paymentMethod: string;
  paidAt?: string;
}
