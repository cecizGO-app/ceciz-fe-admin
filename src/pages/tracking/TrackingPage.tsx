import React from "react";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    resetPage,
    copyResi,
    handleSavePkg,
    handleAddWarehouse,
  } = useTracking();

  const tabs: { key: TrackingTab; label: string; count?: number }[] = [
    { key: "active", label: "Paket Aktif", count: activeCount },
    { key: "done", label: "Arsip Selesai / Done", count: doneCount },
    { key: "all", label: "Semua Pengiriman" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6">
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
            <span className="text-[#EC4899] font-medium">Tracking Logistik</span>
          </nav>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-[#18181B] tracking-tight">
            Tracking Logistik &amp; Pengiriman
          </h1>
          <p className="mt-1 max-w-[680px] text-xs sm:text-sm text-[#71717A]">
            Perbarui status 7 tahap pengiriman barang, kelola nomor resi multi-seller, dan pantau checklist internal admin.
          </p>
        </div>

        {onNavigateToBatch && (
          <Button
            type="button"
            onClick={onNavigateToBatch}
            className="h-11 px-4 gap-2 text-xs font-semibold self-start sm:self-auto shrink-0 shadow-xs cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>+ Buat Batch Baru</span>
          </Button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <TrackingStatsCards stats={stats} />

      {/* Tab Navigasi */}
      <div className="-mb-2 flex gap-1 overflow-x-auto border-b border-[#FBCFE8]/50">
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
                "relative flex h-11 shrink-0 items-center gap-2 px-3 text-xs sm:text-sm transition-colors duration-150 cursor-pointer",
                isActive
                  ? "text-primary font-bold"
                  : "text-[#71717A] hover:text-[#18181B]"
              )}
            >
              <span>{t.label}</span>
              {t.count !== undefined && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={cn(
                    "h-5 min-w-5 px-1.5 text-[10px] tabular-nums",
                    !isActive && "bg-zinc-100 text-[#71717A] border-transparent"
                  )}
                >
                  {t.count}
                </Badge>
              )}
              {isActive && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Table Card Section */}
      <Card className="overflow-hidden p-0 gap-0 border-[#FBCFE8]/60 bg-white shadow-card rounded-[24px]">
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
