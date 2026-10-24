import type {
  ExchangeRates,
  DashboardMetricStats,
  RecentBatch,
  CountryDistribution,
  PaymentReviewStats,
  TeamActivityItem,
} from "@/types/dashboard";

export const DEFAULT_RATES: ExchangeRates = {
  yuan: "2.350",
  won: "12,40",
  baht: "475",
  yen: "108",
  checkedTime: "08:30 WIB",
};

export const DEFAULT_METRIC_STATS: DashboardMetricStats = {
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
export const DEFAULT_RECENT_BATCHES: RecentBatch[] = [
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
export const DEFAULT_COUNTRY_DISTRIBUTIONS: CountryDistribution[] = [
  { code: "CH", name: "China", count: 9, percentage: 90 },
  { code: "KR", name: "Korea", count: 7, percentage: 70 },
  { code: "JP", name: "Jepang", count: 4, percentage: 40 },
  { code: "TH", name: "Thailand", count: 3, percentage: 30 },
  { code: "INA", name: "Indonesia", count: 1, percentage: 10 },
];

export const DEFAULT_PAYMENT_STATS: PaymentReviewStats = {
  pending: 8,
  approved: 5,
  rejected: 1,
  total: 14,
};

export const DEFAULT_TEAM_ACTIVITIES: TeamActivityItem[] = [
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
