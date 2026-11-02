import React, { useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import {
  KursBanner,
  DashboardStatsGrid,
  RecentBatchesCard,
  CountryDistributionCard,
  QuickActionsCard,
  PaymentReviewCard,
  TeamActivityCard,
  UpdateKursModal,
} from "@/components/dashboard";
import type { ExchangeRates } from "@/types/dashboard";
import { useDashboard } from "@/hooks";
import { DEFAULT_TEAM_ACTIVITIES } from "@/mocks/mockDashboardData";
import { cn } from "@/lib/utils";

interface DashboardPageProps {
  onCreateBatch?: () => void;
  onViewAllBatches?: () => void;
  onNavigate?: (menu: string) => void;
  pendingVerificationCount?: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onCreateBatch,
  onViewAllBatches,
  onNavigate,
  pendingVerificationCount: propPendingCount,
}) => {
  const {
    metricStats,
    recentBatches,
    countryDistributions,
    paymentStats,
    rates,
    totalBatchesMonth,
    periodLabel,
    isSyncing,
    isLiveBackend,
    lastUpdated,
    refetch,
    updateRates,
  } = useDashboard();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notifikasi badge hanya muncul jika ada aksi/bukti baru yang belum dicek (> 0)
  const pendingVerificationBadge =
    propPendingCount !== undefined
      ? propPendingCount
      : (metricStats.pendingVerifications ?? 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveRates = (newRates: ExchangeRates) => {
    updateRates(newRates);
    showToast("Kurs harian berhasil diperbarui!");
  };

  const handleManualSync = async () => {
    await refetch();
    showToast(
      isLiveBackend
        ? "Dashboard berhasil disinkronkan dengan backend!"
        : "Data dashboard diperbarui.",
    );
  };

  return (
    <div className="space-y-4.5 pb-12">
      {/* Toast Notifikasi Ringkas */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#18181B] text-white px-4 py-2.5 rounded-[12px] shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Halaman Sesuai PRD §5 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <h1 className="text-[24px] sm:text-[30px] font-bold text-[#18181B] tracking-tight">
          Dashboard
        </h1>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <p className="text-xs text-[#71717A]">Diperbarui: {lastUpdated}</p>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            title="Sinkronkan data dengan backend Vercel"
            className="h-8 px-2.5 rounded-[10px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#71717A] hover:text-[#EC4899] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw
              className={cn(
                "w-3.5 h-3.5 text-[#EC4899]",
                isSyncing && "animate-spin",
              )}
            />
            <span className="text-[11px]">
              {isSyncing ? "Sinkron..." : "Sinkronkan"}
            </span>
          </button>
        </div>
      </div>

      {/* Widget: Kurs Hari Ini (Rate Harian — 1 klik update sesuai PRD §5) */}
      <KursBanner
        rates={rates}
        onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
      />

      {/* Widget: Statistik Hari Ini (PRD §5: total batch aktif, bayar pending, denda, dll) */}
      <DashboardStatsGrid
        stats={metricStats}
        onNavigateBatch={onViewAllBatches}
        onNavigateVerifikasi={() => onNavigate?.("verifikasi")}
        onNavigateTracking={() => onNavigate?.("tracking")}
        onNavigateTax={() => onNavigate?.("tax")}
      />

      {/* Main Grid: Posisi Asli Tetap Sama (Kolom Kiri 7 Kolom & Kolom Kanan 5 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5 items-start">
        {/* Kolom Kiri (7 Kolom) */}
        <div className="lg:col-span-7 space-y-4.5 flex flex-col">
          <RecentBatchesCard
            batches={recentBatches}
            totalBatchesMonth={totalBatchesMonth}
            onViewAllBatches={onViewAllBatches}
          />

          <CountryDistributionCard
            distributions={countryDistributions}
            periodLabel={periodLabel}
          />
        </div>

        {/* Kolom Kanan (5 Kolom) */}
        <div className="lg:col-span-5 space-y-4.5 flex flex-col">
          <QuickActionsCard
            pendingVerificationCount={pendingVerificationBadge}
            onCreateBatch={onCreateBatch}
            onNavigateVerifikasi={() => onNavigate?.("verifikasi")}
            onNavigateTracking={() => onNavigate?.("tracking")}
            onNavigateTax={() => onNavigate?.("tax")}
            onNavigateLaporan={() =>
              showToast(
                "Modul Laporan Keuangan (Laba & Gaji) dijadwalkan pada Sprint 3.",
              )
            }
          />

          <PaymentReviewCard
            stats={paymentStats}
            onNavigateVerifikasi={() => onNavigate?.("verifikasi")}
          />

          <TeamActivityCard activities={DEFAULT_TEAM_ACTIVITIES} />
        </div>
      </div>

      {/* Modal Dialog: Update Kurs Harian */}
      <UpdateKursModal
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        currentRates={rates}
        onSaveRates={handleSaveRates}
      />
    </div>
  );
};

export default DashboardPage;
