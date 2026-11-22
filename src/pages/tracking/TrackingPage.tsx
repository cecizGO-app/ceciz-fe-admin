import React from "react";
import { Package, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrackingStatsCards,
  TrackingFilterBar,
  TrackingDataView,
  TrackingDrawer,
} from "@/components/tracking";
import { useTracking } from "@/hooks";
import type { TrackingTab } from "@/types/tracking";

interface TrackingPageProps {
  onNavigateToBatch?: () => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({
  onNavigateToBatch,
}) => {
  const {
    tab,
    setTab,
    searchQuery,
    setSearchQuery,
    country,
    setCountry,
    warehouse,
    setWarehouse,
    stage,
    setStage,
    currentPage,
    setPage,
    totalPages,
    filteredRows,
    paginatedRows,
    editingPkg,
    setEditingPkg,
    warehouses,
    toastMessage,
    activeCount,
    doneCount,
    stats,
    isSyncing,
    refetch,
    resetPage,
    copyResi,
    handleSavePkg,
    handleAddWarehouse,
  } = useTracking();

  const tabs: { key: TrackingTab; label: string; count?: number }[] = [
    { key: "active", label: "Paket Aktif", count: activeCount },
    { key: "done", label: "Done Archive", count: doneCount },
    { key: "all", label: "Semua Pengiriman" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-[12px] bg-[#18181B] px-4 py-3 text-xs text-white shadow-xl border border-zinc-800 animate-in fade-in zoom-in-95 duration-150">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-[#71717A] mb-1">
            <span className="text-[#71717A]">Operasional</span>
            <span>&gt;</span>
            <span className="text-[#EC4899] font-medium">
              Tracking
            </span>
          </nav>
          <h1 className="text-[24px] sm:text-[30px] font-bold text-[#18181B] tracking-tight">
            Tracking Logistik &amp; Pengiriman
          </h1>
          <p className="mt-1 max-w-[680px] text-xs sm:text-[14px] text-[#71717A] leading-relaxed">
            Perbarui status 7 tahap pengiriman barang, kelola nomor resi
            multi-seller, dan pantau checklist internal admin.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={refetch}
            disabled={isSyncing}
            className="h-10 sm:h-11 px-3.5 gap-1.5 text-xs font-semibold rounded-[12px] border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#71717A] hover:text-[#EC4899] shadow-2xs cursor-pointer disabled:opacity-60"
            title="Muat ulang data tracking dari backend"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#EC4899] ${isSyncing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>

          {onNavigateToBatch && (
            <Button
              type="button"
              onClick={onNavigateToBatch}
              className="h-11 px-4 gap-2 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>+ Buat Batch Baru</span>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <TrackingStatsCards stats={stats} />

      {/* Main Table Card Section (Unified with Tabs + Search + Dropdowns) */}
      <Card className="p-5 sm:p-6 rounded-[24px] border border-[#FBCFE8]/50 bg-white shadow-2xs space-y-5">
        {/* Single Toolbar Row: [Tabs (Left)] — [Search (Center)] — [Dropdowns (Right)] */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-3">
          {/* Segmented Pill Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-[12px] bg-[#FFF5FA] border border-[#FCE7F3] overflow-x-auto no-scrollbar shrink-0">
            {tabs.map((t) => {
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setTab(t.key);
                    resetPage();
                  }}
                  className={cn(
                    "h-8 px-3 rounded-[9px] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer",
                    isActive
                      ? "bg-[#EC4899] text-white shadow-2xs"
                      : "text-[#71717A] hover:text-[#18181B] hover:bg-white/70",
                  )}
                >
                  <span>{t.label}</span>
                  {t.count !== undefined && (
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded-full text-[10px] font-bold tabular-nums",
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-[#FCE7F3] text-[#BE185D]",
                      )}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <TrackingFilterBar
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              resetPage();
            }}
            country={country}
            onCountryChange={(c) => {
              setCountry(c);
              resetPage();
            }}
            warehouse={warehouse}
            onWarehouseChange={(w) => {
              setWarehouse(w);
              resetPage();
            }}
            stage={stage}
            onStageChange={(s) => {
              setStage(s);
              resetPage();
            }}
            warehouses={warehouses}
            tab={tab}
          />
        </div>

        <TrackingDataView
          items={paginatedRows}
          totalFilteredCount={filteredRows.length}
          tab={tab}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onEdit={setEditingPkg}
          onCopyResi={copyResi}
        />
      </Card>

      {/* Edit Drawer Modal */}
      {editingPkg && (
        <TrackingDrawer
          pkg={editingPkg}
          warehouses={
            warehouses.includes(editingPkg.warehouse)
              ? warehouses
              : [...warehouses, editingPkg.warehouse]
          }
          onAddWarehouse={handleAddWarehouse}
          onClose={() => setEditingPkg(null)}
          onSave={handleSavePkg}
        />
      )}
    </div>
  );
};

export default TrackingPage;
