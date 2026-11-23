import {
  getBatchStatsApi,
  getBatchesApi,
  getBatchFormOptionsApi,
  type BackendBatch,
} from "./batch.service";
import { getPaymentStatsApi } from "./payment.service";
import { getTrackingStatsApi } from "./tracking.service";
import { getTaxStatsApi } from "./tax.service";
import type {
  DashboardMetricStats,
  RecentBatch,
  CountryDistribution,
  PaymentReviewStats,
  ExchangeRates,
  CountryCode,
  TeamActivityItem,
} from "@/types/dashboard";
import {
  DEFAULT_RATES,
  DEFAULT_METRIC_STATS,
  DEFAULT_RECENT_BATCHES,
  DEFAULT_COUNTRY_DISTRIBUTIONS,
  DEFAULT_PAYMENT_STATS,
  DEFAULT_TEAM_ACTIVITIES,
} from "@/mocks/mockDashboardData";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

function formatRelativeTimeId(dateVal?: unknown): string {
  if (!dateVal) return "";
  const d = new Date(String(dateVal));
  if (Number.isNaN(d.getTime())) return String(dateVal);
  const diffSec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (diffSec < 60) return "Baru saja";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function resolveActivityIconType(raw: Record<string, unknown>): TeamActivityItem["iconType"] {
  const rawIcon = String(raw.iconType ?? raw.icon ?? "").toLowerCase();
  if (rawIcon === "check" || rawIcon === "truck" || rawIcon === "package" || rawIcon === "receipt") {
    return rawIcon;
  }
  const hint = `${raw.type ?? ""} ${raw.category ?? ""} ${raw.eventType ?? ""} ${raw.title ?? ""}`.toLowerCase();
  if (hint.includes("track") || hint.includes("ship") || hint.includes("otw") || hint.includes("wh") || hint.includes("kirim")) {
    return "truck";
  }
  if (hint.includes("tax") || hint.includes("pajak") || hint.includes("invoice") || hint.includes("tagihan")) {
    return "receipt";
  }
  if (hint.includes("pay") || hint.includes("bayar") || hint.includes("bukti") || hint.includes("verif") || hint.includes("approve")) {
    return "check";
  }
  return "package";
}

/**
 * GET /api/v1/admin/dashboard/activities
 * Mengambil log aktivitas tim terbaru dari backend live
 */
export async function getDashboardActivitiesApi(limit = 10): Promise<TeamActivityItem[]> {
  const url = new URL(`${BASE_URL}/api/v1/admin/dashboard/activities`);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  const rawList: Array<Record<string, unknown>> = Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json?.data?.items)
      ? json.data.items
      : Array.isArray(json?.activities)
        ? json.activities
        : Array.isArray(json)
          ? json
          : [];

  return rawList.map((raw, idx) => {
    const title = String(raw.title ?? raw.action ?? raw.message ?? "Aktivitas tim");
    const directSubtitle = raw.subtitle ? String(raw.subtitle).trim() : "";
    const actor = String(
      raw.actorName ?? raw.actor ?? raw.userName ?? raw.buyerName ?? raw.description ?? "",
    ).trim();
    const relTime =
      raw.timeAgo && String(raw.timeAgo).trim()
        ? String(raw.timeAgo).trim()
        : formatRelativeTimeId(raw.createdAt ?? raw.timestamp ?? raw.updatedAt);

    const subtitle =
      directSubtitle ||
      [actor, relTime].filter(Boolean).join(" · ") ||
      "Baru saja";

    return {
      id: String(raw.id ?? raw.referenceId ?? `act-${idx}`),
      title,
      subtitle,
      iconType: resolveActivityIconType(raw),
    };
  });
}

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
  teamActivities: TeamActivityItem[];
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
 * 6. GET /api/v1/admin/taxes/stats (Statistik Tagihan Tax)
 * 7. GET /api/v1/admin/dashboard/activities (Aktivitas Tim Terbaru)
 */
export async function fetchDashboardDataApi(): Promise<DashboardDataResult> {
  const errors: string[] = [];
  let isLiveBackend = false;

  // Jalankan pemanggilan 7 endpoint secara paralel menggunakan Promise.allSettled
  const [
    batchStatsRes,
    paymentStatsRes,
    trackingStatsRes,
    batchesListRes,
    formOptionsRes,
    taxStatsRes,
    activitiesRes,
  ] = await Promise.allSettled([
    getBatchStatsApi(),
    getPaymentStatsApi(),
    getTrackingStatsApi(),
    getBatchesApi(),
    getBatchFormOptionsApi(),
    getTaxStatsApi(),
    getDashboardActivitiesApi(6),
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

  // 5. Parsing Kurs Valas Live dari Settings Backend (dukung key CH/KR/TH/JP & yuan/won/baht/yen)
  let rates: ExchangeRates = { ...DEFAULT_RATES };
  if (formOptionsRes.status === "fulfilled" && formOptionsRes.value?.settings?.dailyRate) {
    isLiveBackend = true;
    const dRate = formOptionsRes.value.settings.dailyRate as Record<string, number | undefined>;
    const yuanVal = Number(dRate.CH ?? dRate.yuan ?? 2250);
    const wonVal = Number(dRate.KR ?? dRate.won ?? 11.8);
    const bahtVal = Number(dRate.TH ?? dRate.baht ?? 450);
    const yenVal = Number(dRate.JP ?? dRate.yen ?? 108);
    rates = {
      yuan: yuanVal.toLocaleString("id-ID", { maximumFractionDigits: 2 }),
      won: wonVal.toLocaleString("id-ID", { maximumFractionDigits: 2 }),
      baht: bahtVal.toLocaleString("id-ID", { maximumFractionDigits: 2 }),
      yen: yenVal.toLocaleString("id-ID", { maximumFractionDigits: 2 }),
      checkedTime: "Hari ini (Live)",
    };
  } else if (formOptionsRes.status === "rejected") {
    errors.push(`Form Options: ${formOptionsRes.reason?.message || "Error"}`);
  }

  // 6. Parsing Tax Stats Live dari Backend
  let pendingTaxAmount = DEFAULT_METRIC_STATS.pendingTaxAmount;
  let pendingTaxInvoicesCount = DEFAULT_METRIC_STATS.pendingTaxInvoicesCount;
  let taxPeriodCutoff = DEFAULT_METRIC_STATS.taxPeriodCutoff;
  if (taxStatsRes.status === "fulfilled") {
    isLiveBackend = true;
    const tx = taxStatsRes.value;
    pendingTaxAmount = `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(tx.unpaidAmount)}`;
    pendingTaxInvoicesCount = tx.unpaidCount;
    taxPeriodCutoff = tx.activePeriodMonth || tx.activePeriodName || DEFAULT_METRIC_STATS.taxPeriodCutoff;
  }

  // 7. Parsing Aktivitas Tim Terbaru Live dari Backend
  let teamActivities: TeamActivityItem[] = [...DEFAULT_TEAM_ACTIVITIES];
  if (activitiesRes.status === "fulfilled") {
    isLiveBackend = true;
    teamActivities = activitiesRes.value;
  } else {
    errors.push(`Dashboard Activities: ${activitiesRes.reason?.message || "Error"}`);
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
      pendingTaxAmount,
      pendingTaxInvoicesCount,
      taxPeriodCutoff,
    },
    recentBatches,
    countryDistributions,
    paymentStats,
    rates,
    teamActivities,
    totalBatchesMonth,
    periodLabel,
    isLiveBackend,
    errors,
  };
}
