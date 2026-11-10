import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { FileSpreadsheet, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FinancialKpiCards,
  FinancialFilterBar,
  LabaGoFormCard,
  LabaGoSummaryCard,
  LabaGoHistoryTable,
  ProfitOverviewChart,
  AdminSalaryTab,
  PaymentSummaryTab,
} from "@/components/reports";
import { reportsService } from "@/services/reports.service";
import type {
  FinancialTab,
  ProfitPeriodFormData,
  AdminFeePeriodRecord,
} from "@/types/reports";

export const FinancialReportsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state sync for tab (defaults to 'laba-go')
  const activeTab = (searchParams.get("tab") as FinancialTab) || "laba-go";

  // Filter state for Laba GO
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState("ALL");
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [batchFilter, setBatchFilter] = useState("ALL");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Form input data for Laba per Periode (populated initially with screenshot data)
  const [formData, setFormData] = useState<ProfitPeriodFormData>({
    periodName: "TAX 1-3",
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    selectedBatchIds: ["batch-ch-022", "batch-kr-017"],
    packingExpense: 304506,
    otherExpense: 57697,
    otherExpenseNotes: "desain logo commis",
    adminASplit: 80,
    adminBSplit: 20,
    savingsPercent: 0,
    periodNotes: "",
  });

  // History state for Laba GO
  const [history, setHistory] = useState(() =>
    reportsService.getProfitHistory(),
  );

  // State for Gaji Admin fee periods
  const [adminFeePeriods, setAdminFeePeriods] = useState(() =>
    reportsService.getAdminFeePeriods(),
  );

  // Master data
  const availableBatches = useMemo(
    () => reportsService.getAvailableBatches(),
    [],
  );
  const kpis = useMemo(() => reportsService.getKpis(), []);
  const monthlyTrends = useMemo(
    () => reportsService.getMonthlyProfitTrends(),
    [],
  );
  const paymentMethodsSummary = useMemo(
    () => reportsService.getPaymentMethodSummaries(),
    [],
  );

  // Live calculation preview for Laba GO
  const summary = useMemo(() => {
    return reportsService.calculateSummary(formData, availableBatches);
  }, [formData, availableBatches]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleFormChange = (patch: Partial<ProfitPeriodFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleSavePeriod = async () => {
    if (!formData.periodName.trim()) {
      showToast("Mohon masukkan nama periode terlebih dahulu");
      return;
    }
    if (formData.selectedBatchIds.length === 0) {
      showToast("Pilih minimal satu batch untuk dihitung labanya");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const savedItem = reportsService.saveProfitPeriod(formData, summary);
      setHistory(reportsService.getProfitHistory());
      setIsSaving(false);
      showToast(
        `Periode "${savedItem.periodName}" berhasil disimpan ke riwayat!`,
      );
    }, 400);
  };

  const handleDeleteHistory = (id: string) => {
    reportsService.deleteHistoryItem(id);
    setHistory(reportsService.getProfitHistory());
    showToast("Riwayat periode dihapus.");
  };

  const handleAddAdminPeriod = (data: Omit<AdminFeePeriodRecord, "id">) => {
    const newItem = reportsService.addAdminFeePeriod(data);
    setAdminFeePeriods(reportsService.getAdminFeePeriods());
    showToast(`Periode fee untuk "${newItem.adminName}" berhasil ditambahkan!`);
  };

  const handleUpdateAdminPeriod = (
    id: string,
    data: Partial<AdminFeePeriodRecord>,
  ) => {
    reportsService.updateAdminFeePeriod(id, data);
    setAdminFeePeriods(reportsService.getAdminFeePeriods());
    showToast(`Periode fee "${data.periodName || id}" berhasil diperbarui!`);
  };

  const handleDeleteAdminPeriod = (id: string) => {
    reportsService.deleteAdminFeePeriod(id);
    setAdminFeePeriods(reportsService.getAdminFeePeriods());
    showToast("Periode fee admin dihapus.");
  };

  const handleExportXLSX = () => {
    showToast("Mengunduh laporan keuangan format XLSX (Excel)...");
  };

  const handleExportPDF = () => {
    showToast("Menyiapkan dokumen rekap keuangan format PDF...");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setPeriodFilter("ALL");
    setCountryFilter("ALL");
    setBatchFilter("ALL");
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Toast Notifikasi Ringkas */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#18181B] text-white px-4 py-2.5 rounded-[12px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Halaman Sesuai Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight">
            Financial Reports
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Review profit, admin compensation, and payment summaries from one
            workspace.
          </p>
        </div>

        {/* Action Buttons Top Right: XLSX & PDF */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportXLSX}
            className="h-9 px-3 rounded-[10px] text-xs font-semibold border-[#FBCFE8] hover:bg-[#FFF5FA] hover:text-[#EC4899] shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            XLSX
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="h-9 px-3 rounded-[10px] text-xs font-semibold border-[#FBCFE8] hover:bg-[#FFF5FA] hover:text-[#EC4899] shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
            PDF
          </Button>
        </div>
      </div>

      {/* Tabs Level 2 Sesuai Opsi 1 */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="bg-[#FFF5FA]/60 p-1 rounded-[14px] border border-[#FBCFE8]/80 shadow-2xs h-auto">
            <TabsTrigger
              value="laba-go"
              className="px-4 py-2 rounded-[10px] text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#EC4899] data-[state=active]:shadow-xs data-[state=active]:font-bold data-[state=active]:border data-[state=active]:border-[#FBCFE8]/50 cursor-pointer"
            >
              Laba GO
            </TabsTrigger>
            <TabsTrigger
              value="gaji-admin"
              className="px-4 py-2 rounded-[10px] text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#EC4899] data-[state=active]:shadow-xs data-[state=active]:font-bold data-[state=active]:border data-[state=active]:border-[#FBCFE8]/50 cursor-pointer"
            >
              Gaji Admin
            </TabsTrigger>
            <TabsTrigger
              value="rekap-pembayaran"
              className="px-4 py-2 rounded-[10px] text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#EC4899] data-[state=active]:shadow-xs data-[state=active]:font-bold data-[state=active]:border data-[state=active]:border-[#FBCFE8]/50 cursor-pointer"
            >
              Rekap Pembayaran
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Laba GO */}
        <TabsContent value="laba-go" className="space-y-4 outline-none">
          {/* Laba GO Filter Bar */}
          <FinancialFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            periodFilter={periodFilter}
            onPeriodChange={setPeriodFilter}
            countryFilter={countryFilter}
            onCountryChange={setCountryFilter}
            batchFilter={batchFilter}
            onBatchChange={setBatchFilter}
            onReset={handleResetFilters}
          />

          {/* KPI Summary Cards (Compact, No Blank Space) */}
          <FinancialKpiCards stats={kpis} />

          {/* 2-Column Split: Form Input (Left) & Live Preview Calculation (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4.5">
            <LabaGoFormCard
              formData={formData}
              onChange={handleFormChange}
              availableBatches={availableBatches}
            />

            <LabaGoSummaryCard
              formData={formData}
              summary={summary}
              onSave={handleSavePeriod}
              isSaving={isSaving}
            />
          </div>

          {/* Riwayat Laba per Periode (Tabel) */}
          <LabaGoHistoryTable
            history={history}
            onDelete={handleDeleteHistory}
          />

          {/* Profit Overview (Grafik Trend Bulanan) */}
          <ProfitOverviewChart trends={monthlyTrends} />
        </TabsContent>

        {/* Tab 2: Gaji Admin (Matching Images 1 & 2) */}
        <TabsContent value="gaji-admin" className="outline-none">
          <AdminSalaryTab
            periods={adminFeePeriods}
            onAddPeriod={handleAddAdminPeriod}
            onUpdatePeriod={handleUpdateAdminPeriod}
            onDeletePeriod={handleDeleteAdminPeriod}
          />
        </TabsContent>

        {/* Tab 3: Rekap Pembayaran (Matching Image 3) */}
        <TabsContent value="rekap-pembayaran" className="outline-none">
          <PaymentSummaryTab methodSummaries={paymentMethodsSummary} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReportsPage;
