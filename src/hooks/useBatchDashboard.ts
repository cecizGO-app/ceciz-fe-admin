import { useState, useMemo, useEffect, useCallback } from "react";
import type {
  BatchItem,
  BatchStatus,
  CountryFilter,
} from "@/types/batch";
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

export function useBatchDashboard() {
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

  const showToast = (msg: string, duration = 3500) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

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
    loadBatches();
  }, [loadBatches]);

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
      showToast(
        `Status batch ${target?.batchNumber || ""} berhasil diubah menjadi ${newStatus}!`,
      );
    } catch (err: unknown) {
      if (oldStatus) {
        setBatches((prev) =>
          prev.map((b) => (b.id === batchId ? { ...b, status: oldStatus } : b)),
        );
      }
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal mengubah status di backend.";
      showToast(`Error: ${msg}`);
    }
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
      showToast(
        `Batch ${target?.batchNumber || ""} berhasil dihapus dari database!`,
        4000,
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal menghapus batch di backend.";
      showToast(`Error: ${msg}`, 4000);
    }
  };

  // Handler modal internal calculation
  const handleOpenCalcModal = (batch: BatchItem) => {
    setSelectedBatchForCalc(batch);
    setCalcModalOpen(true);
  };

  const handleSaveCalculation = (batchNumber: string, labaBersih: number) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.batchNumber === batchNumber ? { ...b, labaAmount: labaBersih } : b,
      ),
    );
    showToast(
      `Internal calculation untuk ${batchNumber} tersimpan! Laba bersih: Rp ${formatRupiah(labaBersih)}`,
    );
  };

  const handleCopyBatch = (batch: BatchItem) => {
    const textToCopy = `[Batch ${batch.batchNumber}] ${batch.warehouseProxy} - ${batch.buyerCount} buyer (${batch.totalPc} PC) - Status: ${batch.status}`;
    navigator.clipboard.writeText(textToCopy);
    showToast(
      `Info batch ${batch.batchNumber} berhasil disalin ke clipboard!`,
      2500,
    );
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

  return {
    batches,
    filteredBatches,
    isLoading,
    fetchError,
    loadBatches,
    stats,
    warehouses,
    hiddenCount,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    warehouseFilter,
    setWarehouseFilter,
    countryFilter,
    setCountryFilter,
    showHidden,
    setShowHidden,
    handleToggleHide,
    handleUpdateStatus,
    handleDeleteBatch,
    handleCopyBatch,
    calcModalOpen,
    setCalcModalOpen,
    selectedBatchForCalc,
    handleOpenCalcModal,
    handleSaveCalculation,
    toastMessage,
  };
}
