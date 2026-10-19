import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Plus, Check, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InternalCalculationModal } from "@/components/batch/InternalCalculationModal";
import {
  BatchStatsCards,
  BatchFilterBar,
  BatchTable,
  type BatchItem,
  type BatchStatus,
  type CountryFilter,
} from "@/components/batch/dashboard";
import {
  getBatchesApi,
  patchBatchApi,
  deleteBatchApi,
  mapBackendBatchToFrontend,
  mapFrontendStatusToBackend,
  type BackendCountryCode,
} from "@/services/batch.service";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount);
}

interface BatchDashboardPageProps {
  onCreateNewBatch?: () => void;
  onEditBatch?: (batchId: string) => void;
}

export const BatchDashboardPage: React.FC<BatchDashboardPageProps> = ({
  onCreateNewBatch,
  onEditBatch,
}) => {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("ALL");
  const [countryFilter, setCountryFilter] = useState<CountryFilter>("ALL");
  const [showHidden, setShowHidden] = useState(false);
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [selectedBatchForCalc, setSelectedBatchForCalc] =
    useState<BatchItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch data dari Backend API
  const loadBatches = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);

      const countryParam =
        countryFilter !== "ALL"
          ? (countryFilter as BackendCountryCode)
          : undefined;
      const statusParam =
        statusFilter !== "ALL"
          ? mapFrontendStatusToBackend(statusFilter as BatchStatus)
          : undefined;

      const data = await getBatchesApi({
        countryCode: countryParam,
        status: statusParam,
      });

      const mapped = data.map(mapBackendBatchToFrontend);
      setBatches(mapped);
    } catch (err: unknown) {
      console.error("Gagal memuat batch:", err);
      const msg =
        err instanceof Error ? err.message : "Gagal memuat daftar batch.";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [countryFilter, statusFilter]);

  useEffect(() => {
    let ignore = false;

    const countryParam =
      countryFilter !== "ALL"
        ? (countryFilter as BackendCountryCode)
        : undefined;
    const statusParam =
      statusFilter !== "ALL"
        ? mapFrontendStatusToBackend(statusFilter as BatchStatus)
        : undefined;

    getBatchesApi({
      countryCode: countryParam,
      status: statusParam,
    })
      .then((data) => {
        if (!ignore) {
          setBatches(data.map(mapBackendBatchToFrontend));
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          console.error("Gagal memuat batch:", err);
          const msg =
            err instanceof Error ? err.message : "Gagal memuat daftar batch.";
          setFetchError(msg);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [countryFilter, statusFilter]);

  // Daftar warehouse unik untuk dropdown filter
  const warehouses = useMemo(() => {
    const set = new Set<string>();
    batches.forEach((b) => {
      if (b.warehouseProxy && b.warehouseProxy !== "-") {
        set.add(b.warehouseProxy);
      }
    });
    return Array.from(set);
  }, [batches]);

  // Hitung jumlah batch tersembunyi
  const hiddenCount = useMemo(() => {
    return batches.filter((b) => b.isHidden).length;
  }, [batches]);

  // Summary Stats dinamis mengikuti status batch
  const stats = useMemo(() => {
    const activeCount = batches.filter(
      (b) => (b.status === "Open" || b.status === "Closed") && !b.isHidden,
    ).length;
    const activeTotalPc = batches
      .filter((b) => b.status !== "Archived" && !b.isHidden)
      .reduce((sum, b) => sum + b.totalPc, 0);
    const waitingLaba = batches.filter(
      (b) => b.status === "Closed" && b.labaAmount === null && !b.isHidden,
    ).length;
    const archived = batches.filter((b) => b.status === "Archived").length;

    return {
      activeBatches: activeCount,
      totalPc: activeTotalPc,
      waitingCalculation: waitingLaba,
      archivedBatches: archived,
    };
  }, [batches]);

  // Handler toggle hide/unhide
  const handleToggleHide = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, isHidden: !b.isHidden } : b)),
    );
  };

  // Handler ubah status batch via PATCH API Backend
  const handleUpdateStatus = async (
    batchId: string,
    newStatus: BatchStatus,
  ) => {
    const target = batches.find((b) => b.id === batchId);
    const oldStatus = target?.status;

    // Optimistic update di UI
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: newStatus } : b)),
    );

    try {
      await patchBatchApi(batchId, {
        status: mapFrontendStatusToBackend(newStatus),
      });
      setToastMessage(
        `Status batch ${target?.batchNumber || ""} berhasil diubah menjadi ${newStatus}!`,
      );
    } catch (err: unknown) {
      // Rollback jika request backend gagal
      if (oldStatus) {
        setBatches((prev) =>
          prev.map((b) => (b.id === batchId ? { ...b, status: oldStatus } : b)),
        );
      }
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal mengubah status di backend.";
      setToastMessage(`Error: ${msg}`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handler hapus batch via DELETE API Backend
  const handleDeleteBatch = async (batchId: string) => {
    const target = batches.find((b) => b.id === batchId);
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus batch "${target?.batchNumber || ""}"? Tindakan ini tidak dapat dibatalkan.`,
    );
    if (!confirmed) return;

    try {
      await deleteBatchApi(batchId);
      setBatches((prev) => prev.filter((b) => b.id !== batchId));
      setToastMessage(
        `Batch ${target?.batchNumber || ""} berhasil dihapus dari database!`,
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal menghapus batch di backend.";
      setToastMessage(`Error: ${msg}`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handler buka modal internal calculation
  const handleOpenCalcModal = (batch: BatchItem) => {
    setSelectedBatchForCalc(batch);
    setCalcModalOpen(true);
  };

  // Handler simpan hasil internal calculation (state lokal)
  const handleSaveCalculation = (batchNumber: string, labaBersih: number) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.batchNumber === batchNumber ? { ...b, labaAmount: labaBersih } : b,
      ),
    );
    setToastMessage(
      `Internal calculation untuk ${batchNumber} tersimpan! Laba bersih: Rp ${formatRupiah(labaBersih)}`,
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handler copy batch info
  const handleCopyBatch = (batch: BatchItem) => {
    const textToCopy = `[Batch ${batch.batchNumber}] ${batch.warehouseProxy} - ${batch.buyerCount} buyer (${batch.totalPc} PC) - Status: ${batch.status}`;
    navigator.clipboard.writeText(textToCopy);
    setToastMessage(
      `Info batch ${batch.batchNumber} berhasil disalin ke clipboard!`,
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Filter Data
  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      if (!showHidden && batch.isHidden) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNumber = batch.batchNumber.toLowerCase().includes(query);
        const matchWarehouse = batch.warehouseProxy
          .toLowerCase()
          .includes(query);
        const matchCountry = batch.countryCode.toLowerCase().includes(query);
        if (!matchNumber && !matchWarehouse && !matchCountry) return false;
      }

      if (statusFilter !== "ALL" && batch.status !== statusFilter) return false;
      if (warehouseFilter !== "ALL" && batch.warehouseProxy !== warehouseFilter)
        return false;
      if (countryFilter !== "ALL" && batch.countryCode !== countryFilter)
        return false;

      return true;
    });
  }, [
    batches,
    searchQuery,
    statusFilter,
    warehouseFilter,
    countryFilter,
    showHidden,
  ]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notifikasi Berhasil */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#18181B] text-white px-4 py-2.5 rounded-[12px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-[#EC4899] tracking-wider uppercase mb-1">
            DASHBOARD - BATCH
          </div>
          <h1 className="text-[24px] sm:text-[30px] font-bold text-[#18181B] tracking-tight">
            Batch &amp; Kalkulasi Harga
          </h1>
          <p className="text-xs sm:text-[14px] text-[#71717A] mt-1 leading-relaxed">
            Kelola batch group order, pantau status operasional, dan lakukan
            kalkulasi internal laba.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={loadBatches}
            disabled={isLoading}
            className="h-10 sm:h-11 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#71717A] hover:text-[#EC4899] text-xs font-semibold gap-1.5 transition-colors cursor-pointer"
            title="Muat ulang data dari backend"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-[#EC4899]" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            type="button"
            onClick={onCreateNewBatch}
            className="h-10 sm:h-11 px-4 sm:px-5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs sm:text-sm gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Batch Baru</span>
          </Button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {fetchError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>Tidak dapat terhubung ke server backend: {fetchError}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadBatches}
            className="h-8 text-xs font-semibold text-rose-700 border-rose-300 hover:bg-rose-100 self-start sm:self-auto cursor-pointer"
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Summary Stat Cards Grid */}
      <BatchStatsCards stats={stats} />

      {/* Main Content: Filter Bar & Table Panel */}
      <Card className="p-0 gap-0 rounded-[24px] bg-white border border-[#FBCFE8]/40 shadow-card overflow-hidden">
        <BatchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          warehouseFilter={warehouseFilter}
          onWarehouseFilterChange={setWarehouseFilter}
          countryFilter={countryFilter}
          onCountryFilterChange={setCountryFilter}
          showHidden={showHidden}
          onShowHiddenChange={setShowHidden}
          hiddenCount={hiddenCount}
          warehouses={warehouses}
        />

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[#FFF5FA] border border-[#FBCFE8] flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[#EC4899] animate-spin" />
            </div>
            <p className="text-xs text-[#71717A] font-medium">
              Memuat data batch dari backend...
            </p>
          </div>
        ) : (
          <BatchTable
            batches={filteredBatches}
            totalBatchesCount={batches.length}
            onEditBatch={onEditBatch}
            onCalculateBatch={handleOpenCalcModal}
            onCopyBatch={handleCopyBatch}
            onToggleHideBatch={handleToggleHide}
            onUpdateBatchStatus={handleUpdateStatus}
            onDeleteBatch={handleDeleteBatch}
          />
        )}
      </Card>

      {/* Internal Calculation Modal Dialog */}
      {selectedBatchForCalc && (
        <InternalCalculationModal
          key={selectedBatchForCalc.id}
          open={calcModalOpen}
          onOpenChange={setCalcModalOpen}
          batchNumber={selectedBatchForCalc.batchNumber}
          initialLaba={selectedBatchForCalc.labaAmount}
          isArrivedINA={
            selectedBatchForCalc.status === "Closed" ||
            selectedBatchForCalc.status === "Archived"
          }
          onSave={handleSaveCalculation}
        />
      )}
    </div>
  );
};

export default BatchDashboardPage;
