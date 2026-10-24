import React from "react";
import { Plus, Check, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BatchStatsCards,
  BatchFilterBar,
  BatchTable,
  InternalCalculationModal,
} from "@/components/batch";
import { useBatchDashboard } from "@/hooks";

interface BatchDashboardPageProps {
  onCreateNewBatch?: () => void;
  onEditBatch?: (batchId: string) => void;
}

export const BatchDashboardPage: React.FC<BatchDashboardPageProps> = ({
  onCreateNewBatch,
  onEditBatch,
}) => {
  const {
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
  } = useBatchDashboard();

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
