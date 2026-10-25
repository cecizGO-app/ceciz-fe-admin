import type {
  PaymentItem,
  PaymentMethod,
  ProofDetail,
  VerificationStats,
} from "@/types/verification";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

export interface BackendPayment {
  id: string;
  invoiceId: string;
  buyerId: string;
  amount: number | string;
  paymentMethod: "BCA" | "QRIS" | "SEABANK" | "SPAY" | "CASH" | string;
  paymentProofUrl?: string | null;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  verifiedAt?: string | null;
  verifiedById?: string | null;
  rejectReason?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  buyer?: {
    id: string;
    name: string;
    email?: string | null;
    contact?: string | null;
    idLine?: string | null;
    image?: string | null;
  } | null;
  invoice?: {
    id: string;
    totalAmount: number | string;
    invoiceStatus: string;
    batchId?: string;
    batch?: {
      id: string;
      countryCode: string;
      batchNumber: number;
      title: string;
    } | null;
  } | null;
  verifiedBy?: {
    id: string;
    name: string;
    email?: string;
  } | null;
}

export interface BackendPaymentStats {
  menungguVerifikasi: {
    count: number;
    diunggahHariIni: number;
  };
  disetujuiHariIni: {
    count: number;
    totalNominal: number;
  };
  ditolakHariIni: {
    count: number;
  };
  totalTerverifikasiBulanIni: {
    totalNominal: number;
    labelBulan: string;
  };
  tabCounts?: {
    pending: number;
    approved: number;
    rejected: number;
    all: number;
  };
}

export interface GetPaymentsParams {
  status?: "PENDING" | "APPROVED" | "REJECTED";
  paymentMethod?: string;
  batchId?: string;
  search?: string;
  timeRange?: "today" | "this_week" | "this_month" | "all";
  page?: number;
  limit?: number;
}

export interface CreateManualPaymentInput {
  invoiceId: string;
  buyerId: string;
  amount: number;
  paymentMethod: string;
  paymentDate?: string;
  paymentProofUrl?: string;
  notes?: string;
}

/**
 * Mapping nama payment method dari enum backend ke tampilan frontend
 */
export function mapBackendMethodToFrontend(method: string): PaymentMethod {
  switch (method?.toUpperCase()) {
    case "BCA":
      return "BCA";
    case "QRIS":
      return "QRIS";
    case "SEABANK":
      return "SeaBank";
    case "SPAY":
    case "SHOPEEPAY":
      return "ShopeePay";
    case "MANDIRI":
    case "BANK MANDIRI":
      return "Bank Mandiri";
    case "BNI":
      return "BNI";
    case "CASH":
      return "Tunai / Cash";
    default:
      return "Lainnya";
  }
}

/**
 * Mapping nama payment method dari frontend ke enum backend (BCA, QRIS, SEABANK, SPAY, CASH)
 */
export function mapFrontendMethodToBackend(method: PaymentMethod): string {
  switch (method) {
    case "BCA":
      return "BCA";
    case "QRIS":
      return "QRIS";
    case "SeaBank":
      return "SEABANK";
    case "ShopeePay":
      return "SPAY";
    case "Tunai / Cash":
      return "CASH";
    default:
      return "BCA";
  }
}

/**
 * Konversi BackendPayment ke PaymentItem yang digunakan oleh tabel frontend
 */
export function mapBackendPaymentToFrontend(p: BackendPayment): PaymentItem {
  const d = new Date(p.createdAt);
  const uploadDate = !isNaN(d.getTime())
    ? d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
  const uploadTime = !isNaN(d.getTime())
    ? d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const batchCode = p.invoice?.batch
    ? `${p.invoice.batch.countryCode}-${String(p.invoice.batch.batchNumber).padStart(3, "0")}`
    : "-";

  const buyerUsername = p.buyer?.idLine
    ? `@${p.buyer.idLine}`
    : p.buyer?.email
      ? `@${p.buyer.email.split("@")[0]}`
      : "@buyer";

  const proofDetail: ProofDetail = {
    bankSender: mapBackendMethodToFrontend(p.paymentMethod),
    senderName: p.buyer?.name || "Anonim",
    accountNumberMasked: "•••• ••••",
    targetAccount: "Rekening Resmi Ceciz GO",
    referenceNumber: p.id.slice(-8).toUpperCase(),
    transferTime: `${uploadDate} ${uploadTime}`,
    notes: p.notes || undefined,
  };

  return {
    id: p.id,
    buyerName: p.buyer?.name || "Anonim",
    buyerUsername,
    batchCode,
    nominal: Number(p.amount) || 0,
    denda: 0,
    paymentMethod: mapBackendMethodToFrontend(p.paymentMethod),
    uploadDate,
    uploadTime,
    status: p.verificationStatus,
    source: p.notes?.toLowerCase().includes("manual") ? "Admin" : "Buyer",
    proofImageUrl: p.paymentProofUrl || "",
    proofDetail,
    keterangan: p.notes || undefined,
    rejectReason: p.rejectReason || undefined,
    verifiedAt: p.verifiedAt
      ? new Date(p.verifiedAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : undefined,
    verifiedBy: p.verifiedBy?.name || undefined,
  };
}

/**
 * Konversi BackendPaymentStats ke VerificationStats
 */
export function mapBackendStatsToFrontend(
  s: BackendPaymentStats,
): VerificationStats {
  return {
    waitingCount: s.menungguVerifikasi?.count ?? 0,
    waitingTodayCount: s.menungguVerifikasi?.diunggahHariIni ?? 0,
    approvedTodayCount: s.disetujuiHariIni?.count ?? 0,
    approvedTodayAmount: s.disetujuiHariIni?.totalNominal ?? 0,
    rejectedTodayCount: s.ditolakHariIni?.count ?? 0,
    totalMonthlyVerifiedAmount:
      s.totalTerverifikasiBulanIni?.totalNominal ?? 0,
    monthName: s.totalTerverifikasiBulanIni?.labelBulan ?? "Bulan Ini",
  };
}

/**
 * GET /api/v1/admin/payments/stats
 * Mengambil ringkasan metrik 4 kartu dan jumlah antrean
 */
export async function getPaymentStatsApi(): Promise<BackendPaymentStats> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/payments/stats`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.error?.message ||
        json?.message ||
        "Gagal memuat statistik pembayaran dari server",
    );
  }

  return json?.data || json;
}

/**
 * GET /api/v1/admin/payments
 * Mengambil daftar bukti pembayaran dengan filter tab, pencarian, dan paginasi
 */
export async function getPaymentsApi(
  params?: GetPaymentsParams,
): Promise<{ data: BackendPayment[]; meta?: { total: number; totalPages: number } }> {
  const url = new URL(`${BASE_URL}/api/v1/admin/payments`);

  if (params?.status) url.searchParams.set("status", params.status);
  if (params?.paymentMethod && params.paymentMethod !== "ALL")
    url.searchParams.set("paymentMethod", params.paymentMethod);
  if (params?.batchId && params.batchId !== "ALL")
    url.searchParams.set("batchId", params.batchId);
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.timeRange && params.timeRange !== "all")
    url.searchParams.set("timeRange", params.timeRange);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.error?.message ||
        json?.message ||
        "Gagal memuat daftar pembayaran dari server",
    );
  }

  return {
    data: Array.isArray(json?.data) ? json.data : [],
    meta: json?.meta,
  };
}

/**
 * PATCH /api/v1/admin/payments/:id/verify
 * Menyetujui atau menolak 1 bukti pembayaran
 */
export async function verifyPaymentApi(
  id: string,
  input: { status: "APPROVED" | "REJECTED"; rejectReason?: string },
): Promise<BackendPayment> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/payments/${id}/verify`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.error?.message ||
        json?.message ||
        "Gagal memverifikasi status pembayaran",
    );
  }

  return json?.data || json;
}

/**
 * POST /api/v1/admin/payments/bulk-verify
 * Verifikasi massal beberapa pembayaran sekaligus
 */
export async function bulkVerifyPaymentsApi(input: {
  paymentIds: string[];
  status: "APPROVED" | "REJECTED";
  rejectReason?: string;
}): Promise<{ count: number }> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/payments/bulk-verify`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.error?.message ||
        json?.message ||
        "Gagal memverifikasi massal pembayaran",
    );
  }

  return json?.data || json;
}

/**
 * POST /api/v1/admin/payments
 * Mencatat pembayaran manual oleh admin
 */
export async function createManualPaymentApi(
  input: CreateManualPaymentInput,
): Promise<BackendPayment> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/payments`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.error?.message ||
        json?.message ||
        "Gagal menambahkan pembayaran manual",
    );
  }

  return json?.data || json;
}

/**
 * POST /api/v1/upload
 * Mengunggah gambar bukti bayar ke Cloudflare R2
 */
export async function uploadPaymentProofApi(
  file: File,
): Promise<{ url: string; fileName: string; size: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/api/v1/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.error?.message ||
        json?.message ||
        "Gagal mengunggah file bukti pembayaran ke Cloudflare R2",
    );
  }

  return json?.data || json;
}
