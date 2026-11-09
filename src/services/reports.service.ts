import {
  MOCK_FINANCIAL_KPIS,
  MOCK_AVAILABLE_BATCHES,
  MOCK_PROFIT_HISTORY,
  MOCK_MONTHLY_PROFIT_TREND,
  MOCK_ADMIN_SALARIES,
  MOCK_PAYMENT_SUMMARIES,
  MOCK_ADMIN_FEE_PERIODS,
  MOCK_PAYMENT_METHODS_SUMMARY,
} from "@/mocks/mockReportsData";
import type {
  FinancialKpiMetrics,
  BatchOptionForProfit,
  ProfitPeriodFormData,
  ProfitPeriodSummary,
  ProfitPeriodHistoryItem,
  MonthlyProfitTrend,
  AdminSalaryRecord,
  PaymentSummaryRecord,
  AdminFeePeriodRecord,
  PaymentMethodSummary,
} from "@/types/reports";

class ReportsService {
  private history: ProfitPeriodHistoryItem[] = [...MOCK_PROFIT_HISTORY];
  private batches: BatchOptionForProfit[] = [...MOCK_AVAILABLE_BATCHES];
  private adminFeePeriods: AdminFeePeriodRecord[] = [...MOCK_ADMIN_FEE_PERIODS];
  private paymentMethodSummaries: PaymentMethodSummary[] = [
    ...MOCK_PAYMENT_METHODS_SUMMARY,
  ];

  getKpis(): FinancialKpiMetrics {
    return MOCK_FINANCIAL_KPIS;
  }

  getAvailableBatches(): BatchOptionForProfit[] {
    return this.batches;
  }

  getProfitHistory(): ProfitPeriodHistoryItem[] {
    return this.history;
  }

  getMonthlyProfitTrends(): MonthlyProfitTrend[] {
    return MOCK_MONTHLY_PROFIT_TREND;
  }

  getAdminSalaries(): AdminSalaryRecord[] {
    return MOCK_ADMIN_SALARIES;
  }

  getPaymentSummaries(): PaymentSummaryRecord[] {
    return MOCK_PAYMENT_SUMMARIES;
  }

  getAdminFeePeriods(): AdminFeePeriodRecord[] {
    return this.adminFeePeriods;
  }

  addAdminFeePeriod(
    data: Omit<AdminFeePeriodRecord, "id">,
  ): AdminFeePeriodRecord {
    const newItem: AdminFeePeriodRecord = {
      ...data,
      id: `fee-${Date.now()}`,
    };
    this.adminFeePeriods = [newItem, ...this.adminFeePeriods];
    return newItem;
  }

  deleteAdminFeePeriod(id: string): void {
    this.adminFeePeriods = this.adminFeePeriods.filter(
      (item) => item.id !== id,
    );
  }

  getPaymentMethodSummaries(): PaymentMethodSummary[] {
    return this.paymentMethodSummaries;
  }

  /**
   * Pure calculation logic for profit sharing:
   * Total Pemasukan = Sum(laba selected batches)
   * Total Modal = packing expense + other expense
   * Laba Bersih = Total Pemasukan - Total Modal
   * Tabungan GO = Laba Bersih * (savingsPercent / 100) (jika Laba Bersih > 0)
   * Net for Admins = Laba Bersih - Tabungan GO
   * Gaji Admin A = Net for Admins * (adminASplit / 100)
   * Gaji Admin B = Net for Admins * (adminBSplit / 100)
   */
  calculateSummary(
    formData: ProfitPeriodFormData,
    batches: BatchOptionForProfit[] = this.batches,
  ): ProfitPeriodSummary {
    const selectedBatches = batches.filter((b) =>
      formData.selectedBatchIds.includes(b.id),
    );

    const totalLabaBatch = selectedBatches.reduce(
      (sum, b) => sum + (b.labaAmount || 0),
      0,
    );

    const totalPackingExpense = Number(formData.packingExpense) || 0;
    const totalOtherExpense = Number(formData.otherExpense) || 0;
    const totalModal = totalPackingExpense + totalOtherExpense;

    const labaBersih = totalLabaBatch - totalModal;

    // Persentase perhitungan
    const savingsPct = Math.max(
      0,
      Math.min(100, Number(formData.savingsPercent) || 0),
    );
    const adminAPct = Math.max(
      0,
      Math.min(100, Number(formData.adminASplit) || 0),
    );
    const adminBPct = Math.max(
      0,
      Math.min(100, Number(formData.adminBSplit) || 0),
    );

    // Tabungan GO disisihkan jika laba bersih positif
    const tabunganGO =
      labaBersih > 0 ? Math.round((labaBersih * savingsPct) / 100) : 0;
    const baseForAdmins = Math.max(0, labaBersih - tabunganGO);

    const gajiAdminA = Math.round((baseForAdmins * adminAPct) / 100);
    const gajiAdminB = Math.round((baseForAdmins * adminBPct) / 100);

    return {
      totalPackingExpense,
      totalOtherExpense,
      totalModal,
      totalLabaBatch,
      labaBersih,
      gajiAdminA,
      gajiAdminB,
      tabunganGO,
    };
  }

  saveProfitPeriod(
    formData: ProfitPeriodFormData,
    summary: ProfitPeriodSummary,
  ): ProfitPeriodHistoryItem {
    const selectedBatches = this.batches.filter((b) =>
      formData.selectedBatchIds.includes(b.id),
    );
    const batchLabels = selectedBatches.map((b) => b.batchNumber);

    const newItem: ProfitPeriodHistoryItem = {
      id: `hist-${Date.now()}`,
      periodName: formData.periodName || "Periode Baru",
      startDate: formData.startDate,
      endDate: formData.endDate,
      dateRange: `${formData.startDate} s/d ${formData.endDate}`,
      batches: batchLabels.length > 0 ? batchLabels : ["Custom"],
      pemasukan: summary.totalLabaBatch,
      modal: summary.totalModal,
      labaBersih: summary.labaBersih,
      notes: formData.periodNotes || formData.otherExpenseNotes || "-",
      createdAt: new Date().toISOString(),
    };

    this.history = [newItem, ...this.history];
    return newItem;
  }

  deleteHistoryItem(id: string): void {
    this.history = this.history.filter((item) => item.id !== id);
  }
}

export const reportsService = new ReportsService();
export default reportsService;
