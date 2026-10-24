import React, { useState } from "react";
import { Check } from "lucide-react";
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

interface DashboardPageProps {
  onCreateBatch?: () => void;
  onViewAllBatches?: () => void;
  onNavigate?: (menu: string) => void;
}

import {
  DEFAULT_RATES,
  DEFAULT_METRIC_STATS,
  DEFAULT_RECENT_BATCHES,
  DEFAULT_COUNTRY_DISTRIBUTIONS,
  DEFAULT_PAYMENT_STATS,
  DEFAULT_TEAM_ACTIVITIES,
} from "@/mocks/mockDashboardData";


export const DashboardPage: React.FC<DashboardPageProps> = ({
  onCreateBatch,
  onViewAllBatches,
  onNavigate,
}) => {
  const [rates, setRates] = useState<ExchangeRates>(DEFAULT_RATES);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveRates = (newRates: ExchangeRates) => {
    setRates(newRates);
    showToast("Kurs harian berhasil diperbarui!");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <h1 className="text-[26px] sm:text-[30px] font-bold text-[#18181B] tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs text-[#71717A]">Diperbarui: 17:45 WIB</p>
      </div>

      {/* Widget: Kurs Hari Ini (Rate Harian — 1 klik update sesuai PRD §5) */}
      <KursBanner
        rates={rates}
        onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
      />

      {/* Widget: Statistik Hari Ini (PRD §5: total batch aktif, bayar pending, denda, dll) */}
      <DashboardStatsGrid
        stats={DEFAULT_METRIC_STATS}
        onNavigateBatch={onViewAllBatches}
        onNavigateVerifikasi={() => onNavigate?.("verifikasi")}
        onNavigateTracking={() => onNavigate?.("tracking")}
        onNavigateTax={() => onNavigate?.("tax")}
      />

      {/* Main Grid: Kolom Kiri & Kanan Sejajar Alami Tanpa Space Kosong */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4.5">
        {/* Kolom Kiri (7 Kolom) */}
        <div className="lg:col-span-7 space-y-4.5">
          <RecentBatchesCard
            batches={DEFAULT_RECENT_BATCHES}
            totalBatchesMonth={24}
            onViewAllBatches={onViewAllBatches}
          />

          <CountryDistributionCard
            distributions={DEFAULT_COUNTRY_DISTRIBUTIONS}
            periodLabel="September · 24 batch"
          />
        </div>

        {/* Kolom Kanan (5 Kolom) */}
        <div className="lg:col-span-5 space-y-4">
          <QuickActionsCard
            pendingVerificationCount={DEFAULT_METRIC_STATS.pendingVerifications}
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
            stats={DEFAULT_PAYMENT_STATS}
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
