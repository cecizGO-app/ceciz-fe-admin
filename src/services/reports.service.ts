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

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

class ReportsService {
  private kpis: FinancialKpiMetrics = { ...MOCK_FINANCIAL_KPIS };
  private history: ProfitPeriodHistoryItem[] = [...MOCK_PROFIT_HISTORY];
  private batches: BatchOptionForProfit[] = [...MOCK_AVAILABLE_BATCHES];
  private monthlyTrends: MonthlyProfitTrend[] = [...MOCK_MONTHLY_PROFIT_TREND];
  private adminFeePeriods: AdminFeePeriodRecord[] = [...MOCK_ADMIN_FEE_PERIODS];
  private paymentMethodSummaries: PaymentMethodSummary[] = [
    ...MOCK_PAYMENT_METHODS_SUMMARY,
  ];

  async hydrateFromBackend(): Promise<{
    kpis: FinancialKpiMetrics;
    batches: BatchOptionForProfit[];
    history: ProfitPeriodHistoryItem[];
    monthlyTrends: MonthlyProfitTrend[];
    adminFeePeriods: AdminFeePeriodRecord[];
    paymentMethodSummaries: PaymentMethodSummary[];
  }> {
    const [profitRes, feesRes, paySummaryRes] = await Promise.allSettled([
      fetch(`${BASE_URL}/api/v1/admin/reports/profit`, {
        method: "GET",
        credentials: "include",
      }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))),
      fetch(`${BASE_URL}/api/v1/admin/reports/admin-fees`, {
        method: "GET",
        credentials: "include",
      }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))),
      fetch(`${BASE_URL}/api/v1/admin/reports/payment-summary`, {
        method: "GET",
        credentials: "include",
      }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))),
    ]);

    if (profitRes.status === "fulfilled") {
      const pd = profitRes.value?.data || profitRes.value;
      if (pd?.summary) {
        this.kpis = {
          ...this.kpis,
          revenue: Number(pd.summary.revenue ?? this.kpis.revenue),
          cost: Number(pd.summary.cost ?? this.kpis.cost),
          grossProfit: Number(pd.summary.grossProfit ?? this.kpis.grossProfit),
          netProfit: Number(pd.summary.netProfit ?? this.kpis.netProfit),
        };
      } else if (pd?.kpis) {
        this.kpis = { ...this.kpis, ...pd.kpis };
      }
      if (Array.isArray(pd?.availableBatches) && pd.availableBatches.length > 0) {
        this.batches = pd.availableBatches.map((b: Record<string, unknown>) => ({
          id: String(b.id),
          batchNumber: String(b.code ?? b.batchCode ?? b.batchNumber ?? b.id),
          countryCode: String(
            b.countryCode ?? String(b.code ?? "CH").split("-")[0] ?? "CH",
          ) as BatchOptionForProfit["countryCode"],
          labaAmount: Number(b.labaBersih ?? b.labaAmount ?? 0),
          totalPc: Number(b.totalPc ?? b.totalPcs ?? 0),
          date: String(b.date ?? b.batchDate ?? "-"),
          status: String(b.status ?? "Open"),
        }));
      }
      if (Array.isArray(pd?.periods) && pd.periods.length > 0) {
        this.history = pd.periods.map((p: Record<string, unknown>) => ({
          id: String(p.id),
          periodName: String(p.periodName ?? "Periode"),
          startDate: String(p.startDate ?? "").split("T")[0],
          endDate: String(p.endDate ?? "").split("T")[0],
          dateRange: `${String(p.startDate ?? "").split("T")[0]} s/d ${String(p.endDate ?? "").split("T")[0]}`,
          batches: Array.isArray(p.batchCodes)
            ? (p.batchCodes as string[])
            : Array.isArray(p.batchIds)
              ? (p.batchIds as string[])
              : [],
          pemasukan: Number(p.totalRevenue ?? p.pemasukan ?? 0),
          modal: Number(p.totalCost ?? p.modal ?? 0),
          labaBersih: Number(p.netProfit ?? p.labaBersih ?? 0),
          notes: String(p.notes ?? "-"),
          createdAt: String(p.createdAt ?? new Date().toISOString()),
        }));
      }
      const rawTrend = Array.isArray(pd?.monthlyTrend)
        ? pd.monthlyTrend
        : Array.isArray(pd?.monthlyTrends)
          ? pd.monthlyTrends
          : [];
      if (rawTrend.length > 0) {
        this.monthlyTrends = rawTrend;
      }
    }

    if (feesRes.status === "fulfilled") {
      const fd = feesRes.value?.data || feesRes.value;
      const list = Array.isArray(fd?.records) ? fd.records : Array.isArray(fd) ? fd : [];
      if (list.length > 0) {
        this.adminFeePeriods = list.map((f: Record<string, unknown>) => ({
          id: String(f.id),
          periodName: String(f.periodName ?? "-"),
          adminName: String(f.adminName ?? "-"),
          batchCount: Number(f.batchCount ?? 0),
          feeNyelem: Number(f.feeNyelem ?? 0),
          feeRekap: Number(f.feeRekap ?? 0),
          totalFee: Number(f.totalFee ?? Number(f.feeNyelem ?? 0) + Number(f.feeRekap ?? 0)),
          notes: String(f.notes ?? ""),
        }));
      }
    }

    if (paySummaryRes.status === "fulfilled") {
      const sd = paySummaryRes.value?.data || paySummaryRes.value;
      const methods = Array.isArray(sd?.methods) ? sd.methods : Array.isArray(sd) ? sd : [];
      if (methods.length > 0) {
        this.paymentMethodSummaries = methods;
      }
    }

    return {
      kpis: this.kpis,
      batches: this.batches,
      history: this.history,
      monthlyTrends: this.monthlyTrends,
      adminFeePeriods: this.adminFeePeriods,
      paymentMethodSummaries: this.paymentMethodSummaries,
    };
  }

  getKpis(): FinancialKpiMetrics {
    return this.kpis;
  }

  getAvailableBatches(): BatchOptionForProfit[] {
    return this.batches;
  }

  getProfitHistory(): ProfitPeriodHistoryItem[] {
    return this.history;
  }

  getMonthlyProfitTrends(): MonthlyProfitTrend[] {
    return this.monthlyTrends;
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

    fetch(`${BASE_URL}/api/v1/admin/reports/admin-fees`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        periodName: data.periodName,
        adminName: data.adminName,
        batchCount: data.batchCount,
        feeNyelem: data.feeNyelem,
        feeRekap: data.feeRekap,
        notes: data.notes || undefined,
      }),
    }).catch(() => {});

    return newItem;
  }

  updateAdminFeePeriod(
    id: string,
    patch: Partial<AdminFeePeriodRecord>,
  ): AdminFeePeriodRecord | undefined {
    this.adminFeePeriods = this.adminFeePeriods.map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    );

    fetch(`${BASE_URL}/api/v1/admin/reports/admin-fees/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => {});

    return this.adminFeePeriods.find((item) => item.id === id);
  }

  deleteAdminFeePeriod(id: string): void {
    this.adminFeePeriods = this.adminFeePeriods.filter(
      (item) => item.id !== id,
    );

    fetch(`${BASE_URL}/api/v1/admin/reports/admin-fees/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).catch(() => {});
  }

  getPaymentMethodSummaries(): PaymentMethodSummary[] {
    return this.paymentMethodSummaries;
  }

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

    fetch(`${BASE_URL}/api/v1/admin/reports/profit/periods`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        periodName: formData.periodName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        batchIds: formData.selectedBatchIds,
        packingCost: formData.packingExpense,
        otherCost: formData.otherExpense,
        otherCostNote: formData.otherExpenseNotes || null,
        adminAPercent: formData.adminASplit,
        adminBPercent: formData.adminBSplit,
        goSavingsPercent: formData.savingsPercent,
        notes: formData.periodNotes || null,
      }),
    }).catch(() => {});

    return newItem;
  }

  deleteHistoryItem(id: string): void {
    this.history = this.history.filter((item) => item.id !== id);

    fetch(`${BASE_URL}/api/v1/admin/reports/profit/periods/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).catch(() => {});
  }
}

export const reportsService = new ReportsService();
export default reportsService;
