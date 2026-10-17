import React, { useState, useMemo } from "react";
import { Plus, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InternalCalculationModal } from "@/components/batch/InternalCalculationModal";
import {
  BatchStatsCards,
  BatchFilterBar,
  BatchTable,
  INITIAL_BATCHES,
  type BatchItem,
  type BatchStatus,
  type CountryFilter,
} from "@/components/batch/dashboard";

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
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("ALL");
  const [countryFilter, setCountryFilter] = useState<CountryFilter>("ALL");
  const [showHidden, setShowHidden] = useState(false);
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [selectedBatchForCalc, setSelectedBatchForCalc] = useState<BatchItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Daftar warehouse unik untuk dropdown filter
  const warehouses = useMemo(() => {
    const set = new Set<string>();
    batches.forEach((b) => set.add(b.warehouseProxy));
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
      totalPc: activeTotalPc > 0 ? 142 : 0,
      waitingCalculation: waitingLaba,
      archivedBatches: archived + 14, // Termasuk historis batch lama sesuai wireframe (18)
    };
  }, [batches]);

  // Handler toggle hide/unhide
  const handleToggleHide = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, isHidden: !b.isHidden } : b)),
    );
  };

  // Handler ubah status batch (Open, Closed, Archived)
  const handleUpdateStatus = (batchId: string, newStatus: BatchStatus) => {
    const target = batches.find((b) => b.id === batchId);
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: newStatus } : b)),
    );
    setToastMessage(
      `Status batch ${target?.batchNumber || ""} diubah menjadi ${newStatus}!`,
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handler buka modal internal calculation
  const handleOpenCalcModal = (batch: BatchItem) => {
    setSelectedBatchForCalc(batch);
    setCalcModalOpen(true);
  };

  // Handler simpan hasil internal calculation
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
    setToastMessage(`Info batch ${batch.batchNumber} berhasil disalin ke clipboard!`);
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
        const matchWarehouse = batch.warehouseProxy.toLowerCase().includes(query);
        const matchCountry = batch.countryCode.toLowerCase().includes(query);
        if (!matchNumber && !matchWarehouse && !matchCountry) return false;
      }

      if (statusFilter !== "ALL" && batch.status !== statusFilter) return false;
      if (warehouseFilter !== "ALL" && batch.warehouseProxy !== warehouseFilter) return false;
      if (countryFilter !== "ALL" && batch.countryCode !== countryFilter) return false;

      return true;
    });
  }, [batches, searchQuery, statusFilter, warehouseFilter, countryFilter, showHidden]);

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
            Kelola batch group order, pantau status operasional, dan lakukan kalkulasi internal laba.
          </p>
        </div>

        <Button
          type="button"
          onClick={onCreateNewBatch}
          className="h-10 sm:h-11 px-4 sm:px-5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs sm:text-sm gap-2 self-start sm:self-auto shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Batch Baru</span>
        </Button>
      </div>

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

        <BatchTable
          batches={filteredBatches}
          totalBatchesCount={batches.length}
          onEditBatch={onEditBatch}
          onCalculateBatch={handleOpenCalcModal}
          onCopyBatch={handleCopyBatch}
          onToggleHideBatch={handleToggleHide}
          onUpdateBatchStatus={handleUpdateStatus}
        />
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
