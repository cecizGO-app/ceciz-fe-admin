import {
  getBatchStatsApi,
  getBatchesApi,
  getBatchFormOptionsApi,
  type BackendBatch,
} from "./batch.service";
import { getPaymentStatsApi } from "./payment.service";
import { getTrackingStatsApi } from "./tracking.service";
import type {
  DashboardMetricStats,
  RecentBatch,
  CountryDistribution,
  PaymentReviewStats,
  ExchangeRates,
  CountryCode,
} from "@/types/dashboard";
import {
  DEFAULT_RATES,
  DEFAULT_METRIC_STATS,
  DEFAULT_RECENT_BATCHES,
  DEFAULT_COUNTRY_DISTRIBUTIONS,
  DEFAULT_PAYMENT_STATS,
} from "@/mocks/mockDashboardData";

const COUNTRY_NAMES: Record<string, string> = {
  CH: "China",
  KR: "Korea",
  JP: "Jepang",
  TH: "Thailand",
  INA: "Indonesia",
};

export interface DashboardDataResult {
  metricStats: DashboardMetricStats;
  recentBatches: RecentBatch[];
  countryDistributions: CountryDistribution[];
  paymentStats: PaymentReviewStats;
  rates: ExchangeRates;
  totalBatchesMonth: number;
  periodLabel: string;
  isLiveBackend: boolean;
  errors: string[];
}

/**
 * Mengambil dan menggabungkan seluruh data statistik Dashboard dari Backend API secara live:
 * 1. GET /api/v1/admin/batches/stats (Batch Aktif, PC Berjalan)
 * 2. GET /api/v1/admin/payments/stats (Menunggu Verifikasi, Disetujui, Ditolak)
 * 3. GET /api/v1/admin/tracking/stats (Tracking Paket Berjalan, Tiba di WH ID)
 * 4. GET /api/v1/admin/batches (Tabel 5 Batch Terbaru & Distribusi per Negara)
 * 5. GET /api/v1/admin/batches/form-options (Kurs Harian Valas)
 */
export async function fetchDashboardDataApi(): Promise<DashboardDataResult> {
  const errors: string[] = [];
  let isLiveBackend = false;

  // Jalankan pemanggilan 5 endpoint secara paralel menggunakan Promise.allSettled
  const [
    batchStatsRes,
    paymentStatsRes,
    trackingStatsRes,
    batchesListRes,
    formOptionsRes,
  ] = await Promise.allSettled([
    getBatchStatsApi(),
    getPaymentStatsApi(),
    getTrackingStatsApi(),
    getBatchesApi(),
    getBatchFormOptionsApi(),
  ]);

  // 1. Parsing Batch Stats
  let activeBatches = DEFAULT_METRIC_STATS.activeBatches;
  let activeBatchesDiff = DEFAULT_METRIC_STATS.activeBatchesDiff;
  if (batchStatsRes.status === "fulfilled") {
    isLiveBackend = true;
    activeBatches = batchStatsRes.value.activeBatches ?? 0;
    activeBatchesDiff = `+${batchStatsRes.value.activeBatches ?? 0} aktif`;
  } else {
    errors.push(`Batches Stats: ${batchStatsRes.reason?.message || "Error"}`);
  }

  // 2. Parsing Payment Stats Live dari Backend
  let pendingVerifications = 0;
  let pendingVerificationsDiff = "+0 hari ini";
  let paymentStats: PaymentReviewStats = {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  };

  if (paymentStatsRes.status === "fulfilled") {
    isLiveBackend = true;
    const pStats = paymentStatsRes.value;
    const waiting = pStats.menungguVerifikasi?.count ?? 0;
    const waitingToday = pStats.menungguVerifikasi?.diunggahHariIni ?? 0;
    const approvedToday = pStats.disetujuiHariIni?.count ?? 0;
    const rejectedToday = pStats.ditolakHariIni?.count ?? 0;
    const totalPayments = waiting + approvedToday + rejectedToday;

    pendingVerifications = waiting;
    pendingVerificationsDiff = `+${waitingToday} hari ini`;
    paymentStats = {
      pending: waiting,
      approved: approvedToday,
      rejected: rejectedToday,
      total: totalPayments,
    };
  } else {
    errors.push(`Payment Stats: ${paymentStatsRes.reason?.message || "Error"}`);
    // Jika backend offline/error, gunakan fallback aman
    pendingVerifications = DEFAULT_METRIC_STATS.pendingVerifications;
    pendingVerificationsDiff = DEFAULT_METRIC_STATS.pendingVerificationsDiff;
    paymentStats = { ...DEFAULT_PAYMENT_STATS };
  }

  // 3. Parsing Tracking Stats Live dari Backend
  let activeTrackingPackages = DEFAULT_METRIC_STATS.activeTrackingPackages;
  let arrivedWarehousePackages = DEFAULT_METRIC_STATS.arrivedWarehousePackages;

  if (trackingStatsRes.status === "fulfilled") {
    isLiveBackend = true;
    const tStats = trackingStatsRes.value;
    activeTrackingPackages = tStats.totalPaketBerjalan ?? tStats.activePackages ?? 0;
    arrivedWarehousePackages = tStats.tibaDiWarehouseId ?? tStats.arrivedWhIna ?? 0;
  } else {
    errors.push(`Tracking Stats: ${trackingStatsRes.reason?.message || "Error"}`);
  }

  // 4. Parsing Batches List Live dari Backend (Recent Batches & Country Distribution)
  let recentBatches: RecentBatch[] = [...DEFAULT_RECENT_BATCHES];
  let countryDistributions: CountryDistribution[] = [...DEFAULT_COUNTRY_DISTRIBUTIONS];
  let totalBatchesMonth = DEFAULT_RECENT_BATCHES.length;
  const now = new Date();
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  let periodLabel = `${monthNames[now.getMonth()]} · ${totalBatchesMonth} batch`;

  if (batchesListRes.status === "fulfilled" && Array.isArray(batchesListRes.value)) {
    isLiveBackend = true;
    const allBatches: BackendBatch[] = batchesListRes.value;
    totalBatchesMonth = allBatches.length;
    periodLabel = `${monthNames[now.getMonth()]} · ${totalBatchesMonth} batch`;

    if (allBatches.length > 0) {
      // Sort batch terbaru descending berdasarkan tanggal / createdAt
      const sortedBatches = [...allBatches].sort((a, b) => {
        const timeA = new Date(a.batchDate || a.createdAt).getTime();
        const timeB = new Date(b.batchDate || b.createdAt).getTime();
        return timeB - timeA;
      });

      // Ambil 5 batch teratas
      recentBatches = sortedBatches.slice(0, 5).map((b) => {
        const cCode = (b.countryCode as CountryCode) || "CH";
        const dateStr = b.batchDate
          ? new Date(b.batchDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            })
          : "-";

        const buyerCount = Array.isArray(b.items)
          ? new Set(b.items.map((i) => i.buyerId)).size
          : 0;

        const totalNominal = b.hargaTotal
          ? Number(b.hargaTotal)
          : Array.isArray(b.items)
            ? b.items.reduce(
                (sum, it) => sum + (Number(it.hargaJualPerBuyer || it.hargaPerBuyer) || 0),
                0,
              )
            : 0;

        return {
          id: b.id,
          batchNumber: `${b.countryCode === "CH" ? "CN" : b.countryCode}-${String(
            b.batchNumber,
          ).padStart(3, "0")}`,
          countryCode: cCode,
          countryName: COUNTRY_NAMES[b.countryCode] || b.countryCode,
          date: dateStr,
          buyerCount: buyerCount > 0 ? buyerCount : 1,
          totalAmount: `Rp ${totalNominal.toLocaleString("id-ID")}`,
          status: b.status === "OPEN" ? "Open" : "Closed",
        };
      });

      // Hitung Distribusi per Negara (5 Negara PRD: CH, KR, JP, TH, INA)
      const countryCounts: Record<CountryCode, number> = {
        CH: 0,
        KR: 0,
        JP: 0,
        TH: 0,
        INA: 0,
      };

      for (const b of allBatches) {
        const code = b.countryCode as CountryCode;
        if (code in countryCounts) {
          countryCounts[code]++;
        }
      }

      countryDistributions = (
        ["CH", "KR", "JP", "TH", "INA"] as CountryCode[]
      ).map((code) => {
        const count = countryCounts[code] || 0;
        const percentage =
          allBatches.length > 0 ? Math.round((count / allBatches.length) * 100) : 0;
        return {
          code,
          name: COUNTRY_NAMES[code] || code,
          count,
          percentage,
        };
      });
    }
  } else if (batchesListRes.status === "rejected") {
    errors.push(`Batches List: ${batchesListRes.reason?.message || "Error"}`);
  }

  // 5. Parsing Kurs Valas Live dari Settings Backend
  let rates: ExchangeRates = { ...DEFAULT_RATES };
  if (formOptionsRes.status === "fulfilled" && formOptionsRes.value?.settings?.dailyRate) {
    isLiveBackend = true;
    const dRate = formOptionsRes.value.settings.dailyRate;
    rates = {
      yuan: Number(dRate.yuan || 2350).toLocaleString("id-ID"),
      won: Number(dRate.won || 12.4).toLocaleString("id-ID"),
      baht: Number(dRate.baht || 475).toLocaleString("id-ID"),
      yen: Number(dRate.yen || 108).toLocaleString("id-ID"),
      checkedTime: "Hari ini (Live)",
    };
  } else if (formOptionsRes.status === "rejected") {
    errors.push(`Form Options: ${formOptionsRes.reason?.message || "Error"}`);
  }

  return {
    metricStats: {
      activeBatches,
      activeBatchesDiff,
      pendingVerifications,
      pendingVerificationsDiff,
      overduePenaltyBuyers: DEFAULT_METRIC_STATS.overduePenaltyBuyers,
      activeTrackingPackages,
      arrivedWarehousePackages,
      pendingTaxAmount: DEFAULT_METRIC_STATS.pendingTaxAmount,
      pendingTaxInvoicesCount: DEFAULT_METRIC_STATS.pendingTaxInvoicesCount,
      taxPeriodCutoff: DEFAULT_METRIC_STATS.taxPeriodCutoff,
    },
    recentBatches,
    countryDistributions,
    paymentStats,
    rates,
    totalBatchesMonth,
    periodLabel,
    isLiveBackend,
    errors,
  };
}
