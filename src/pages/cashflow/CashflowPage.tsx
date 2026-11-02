import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  CashflowStatsCards,
  CashflowFilterBar,
  CashflowTable,
  CashflowModal,
  CashflowDeleteDialog,
} from "@/components/cashflow";
import {
  getCashflowEntries,
  getCashflowStats,
  createCashflowEntry,
  updateCashflowEntry,
  deleteCashflowEntry,
  exportCashflowToCsv,
} from "@/services/cashflow.service";
import type {
  CashflowEntry,
  CashflowFilterParams,
  CashflowStats,
  CreateCashflowInput,
} from "@/types/cashflow";

const PAGE_SIZE = 10;

export const CashflowPage: React.FC = () => {
  const [entries, setEntries] = useState<CashflowEntry[]>([]);
  const [stats, setStats] = useState<CashflowStats>({
    currentBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<CashflowFilterParams>({
    type: "ALL",
    period: "ALL",
    paymentMethod: "ALL",
    search: "",
  });
  const [page, setPage] = useState<number>(1);

  // Modal States
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [entryToEdit, setEntryToEdit] = useState<CashflowEntry | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [entryToDelete, setEntryToDelete] = useState<CashflowEntry | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback(
    (text: string, type: "success" | "error" = "success") => {
      setToastMessage({ text, type });
      setTimeout(() => setToastMessage(null), 3500);
    },
    []
  );

  // Load Data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedEntries, fetchedStats] = await Promise.all([
        getCashflowEntries(filters),
        getCashflowStats(filters),
      ]);
      setEntries(fetchedEntries);
      setStats(fetchedStats);
    } catch (err: unknown) {
      console.error("Gagal memuat data cashflow:", err);
      showToast("Gagal menyinkronkan data cashflow", "error");
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler Filter
  const handleFilterChange = (newFilters: CashflowFilterParams) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      type: "ALL",
      period: "ALL",
      paymentMethod: "ALL",
      search: "",
    });
    setPage(1);
  };

  // Handler Create / Edit
  const handleOpenCreate = () => {
    setEntryToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (entry: CashflowEntry) => {
    setEntryToEdit(entry);
    setModalOpen(true);
  };

  const handleSaveEntry = async (input: CreateCashflowInput) => {
    try {
      if (entryToEdit) {
        await updateCashflowEntry({ id: entryToEdit.id, ...input });
        showToast("Transaksi cashflow berhasil diperbarui!");
      } else {
        await createCashflowEntry(input);
        showToast("Transaksi baru berhasil dicatat ke buku kas!");
      }
      await loadData();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan";
      showToast(msg, "error");
      throw err;
    }
  };

  // Handler Delete
  const handleOpenDelete = (entry: CashflowEntry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteCashflowEntry(id);
      showToast("Transaksi cashflow berhasil dihapus!");
      await loadData();
    } catch {
      showToast("Gagal menghapus transaksi", "error");
    }
  };

  // Export CSV
  const handleExport = () => {
    if (entries.length === 0) {
      showToast("Tidak ada data untuk diekspor", "error");
      return;
    }
    exportCashflowToCsv(entries);
    showToast(`Berhasil mengekspor ${entries.length} data transaksi ke CSV!`);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.type && filters.type !== "ALL") count++;
    if (filters.category) count++;
    if (filters.paymentMethod && filters.paymentMethod !== "ALL") count++;
    if (filters.period && filters.period !== "ALL") count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-5 sm:space-y-6 pb-14">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-[16px] text-xs font-semibold shadow-lg flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 border bg-white ${
            toastMessage.type === "success"
              ? "text-emerald-900 border-emerald-200/80 shadow-emerald-500/10"
              : "text-rose-900 border-rose-200/80 shadow-rose-500/10"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Section dengan Standarisasi Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-[#71717A] mb-1">
            <span className="text-[#71717A]">Operasional</span>
            <span>&gt;</span>
            <span className="text-[#EC4899] font-medium">Cashflow</span>
          </nav>
          <h1 className="text-[24px] sm:text-[30px] font-bold text-[#18181B] tracking-tight">
            Cashflow &amp; Buku Kas
          </h1>
          <p className="text-xs sm:text-[14px] text-[#71717A] mt-1 leading-relaxed max-w-xl">
            Pencatatan arus kas operasional manual (pemasukan &amp; pengeluaran),
            pemantauan saldo riil, biaya packing, transfer seller, dan fee admin.
          </p>
        </div>

        {/* Action Buttons: Single neat horizontal row */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0 flex-wrap sm:flex-nowrap">
          <Button
            type="button"
            variant="outline"
            onClick={loadData}
            disabled={loading}
            title="Muat ulang data transaksi"
            className="h-10 sm:h-11 px-3 sm:px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#71717A] hover:text-[#EC4899] text-xs font-semibold gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#EC4899] ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            className="h-10 sm:h-11 px-3 sm:px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#71717A] hover:text-[#EC4899] text-xs font-semibold gap-1.5 transition-colors cursor-pointer"
            title="Ekspor data ke file CSV / Excel"
          >
            <Download className="w-3.5 h-3.5 text-[#EC4899]" />
            <span>Ekspor CSV</span>
          </Button>

          <Button
            type="button"
            onClick={handleOpenCreate}
            className="h-10 sm:h-11 px-4 sm:px-5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Catat Transaksi</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards Grid (Aligned identically with other pages) */}
      <CashflowStatsCards stats={stats} loading={loading} />

      {/* Main Content: Filter Bar & Table Panel */}
      <Card className="p-0 gap-0 rounded-[24px] bg-white border border-[#FBCFE8]/40 shadow-card overflow-hidden">
        {/* Filter Bar */}
        <CashflowFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Info filter aktif jika ada */}
        {activeFilterCount > 0 && (
          <div className="px-4 py-2 bg-[#FFF5FA]/40 border-b border-[#FBCFE8]/30 flex items-center justify-between text-xs text-[#71717A]">
            <span>
              Menyaring dengan <strong>{activeFilterCount}</strong> parameter aktif
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[#EC4899] font-medium hover:underline cursor-pointer"
            >
              Hapus semua filter
            </button>
          </div>
        )}

        {/* Data Table / Mobile Card List */}
        <CashflowTable
          entries={entries}
          loading={loading}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onAddNew={handleOpenCreate}
        />
      </Card>

      {/* Modal Catat / Edit Transaksi */}
      <CashflowModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        entryToEdit={entryToEdit}
        onSave={handleSaveEntry}
      />

      {/* Dialog Konfirmasi Hapus */}
      <CashflowDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        entry={entryToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
