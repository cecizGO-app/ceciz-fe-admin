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
  type ExchangeRates,
  type RecentBatch,
  type CountryDistribution,
  type TeamActivityItem,
  type PaymentReviewStats,
  type DashboardMetricStats,
} from "@/components/dashboard";

interface DashboardPageProps {
  onCreateBatch?: () => void;
  onViewAllBatches?: () => void;
  onNavigate?: (menu: string) => void;
}

const DEFAULT_RATES: ExchangeRates = {
  yuan: "2.350",
  won: "12,40",
  baht: "475",
  yen: "108",
  checkedTime: "08:30 WIB",
};

const DEFAULT_METRIC_STATS: DashboardMetricStats = {
  activeBatches: 7,
  activeBatchesDiff: "+2 dari kemarin",
  pendingVerifications: 12,
  pendingVerificationsDiff: "+5 hari ini",
  overduePenaltyBuyers: 2,
  activeTrackingPackages: 31,
  arrivedWarehousePackages: 5,
  pendingTaxAmount: "Rp 4.250.000",
  pendingTaxInvoicesCount: 8,
  taxPeriodCutoff: "30 Sep",
};

// Batch Terbaru mewakili 5 Negara PRD (CH, KR, JP, TH, INA) dengan struktur data asli
const DEFAULT_RECENT_BATCHES: RecentBatch[] = [
  {
    id: "batch-1",
    batchNumber: "CN-2509-017",
    countryCode: "CH",
    countryName: "China",
    date: "30 Sep",
    buyerCount: 3,
    totalAmount: "Rp 1.060.720",
    status: "Open",
  },
  {
    id: "batch-2",
    batchNumber: "KR-2509-015",
    countryCode: "KR",
    countryName: "Korea",
    date: "28 Sep",
    buyerCount: 5,
    totalAmount: "Rp 2.340.000",
    status: "Closed",
  },
  {
    id: "batch-3",
    batchNumber: "JP-2509-012",
    countryCode: "JP",
    countryName: "Jepang",
    date: "25 Sep",
    buyerCount: 2,
    totalAmount: "Rp 890.000",
    status: "Open",
  },
  {
    id: "batch-4",
    batchNumber: "TH-2509-009",
    countryCode: "TH",
    countryName: "Thailand",
    date: "22 Sep",
    buyerCount: 4,
    totalAmount: "Rp 1.275.500",
    status: "Closed",
  },
  {
    id: "batch-5",
    batchNumber: "INA-2509-001",
    countryCode: "INA",
    countryName: "Indonesia",
    date: "20 Sep",
    buyerCount: 3,
    totalAmount: "Rp 450.000",
    status: "Open",
  },
  {
    id: "batch-6",
    batchNumber: "KR-2509-008",
    countryCode: "KR",
    countryName: "Korea",
    date: "18 Sep",
    buyerCount: 6,
    totalAmount: "Rp 2.850.000",
    status: "Closed",
  },
  {
    id: "batch-7",
    batchNumber: "CN-2509-004",
    countryCode: "CH",
    countryName: "China",
    date: "16 Sep",
    buyerCount: 4,
    totalAmount: "Rp 1.480.000",
    status: "Closed",
  },
];

// Data Distribusi 5 Negara Sesuai PRD §4
const DEFAULT_COUNTRY_DISTRIBUTIONS: CountryDistribution[] = [
  { code: "CH", name: "China", count: 9, percentage: 90 },
  { code: "KR", name: "Korea", count: 7, percentage: 70 },
  { code: "JP", name: "Jepang", count: 4, percentage: 40 },
  { code: "TH", name: "Thailand", count: 3, percentage: 30 },
  { code: "INA", name: "Indonesia", count: 1, percentage: 10 },
];

const DEFAULT_PAYMENT_STATS: PaymentReviewStats = {
  pending: 8,
  approved: 5,
  rejected: 1,
  total: 14,
};

const DEFAULT_TEAM_ACTIVITIES: TeamActivityItem[] = [
  {
    id: "act-1",
    title: "Bukti bayar diupload",
    subtitle: "Maya Putri (CH-025) · 8 mnt lalu",
    iconType: "check",
  },
  {
    id: "act-2",
    title: "Status tracking diupdate: OTW Indonesia",
    subtitle: "Salsa · 24 mnt lalu",
    iconType: "truck",
  },
  {
    id: "act-3",
    title: "Batch JP-014 dibuat",
    subtitle: "Nadia · 1 jam lalu",
    iconType: "package",
  },
  {
    id: "act-4",
    title: "Tagihan Tax dirilis",
    subtitle: "Aurel · 3 jam lalu",
    iconType: "receipt",
  },
];

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
