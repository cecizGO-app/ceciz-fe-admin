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
  keterangan?: string | null;
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
  batch?: {
    id?: string;
    code?: string;
    title?: string;
    countryCode?: string;
    batchNumber?: number;
  } | null;
  batchCode?: string;
  sumber?: string;
  source?: string;
  uploadTime?: string;
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
  invoiceId?: string;
  batchId?: string;
  batchCode?: string;
  batch?: string;
  buyerId?: string;
  buyerName?: string;
  buyer?: string;
  amount: number;
  paymentMethod: string;
  paymentDate?: string;
  paymentProofUrl?: string;
  notes?: string;
  keterangan?: string;
  status?: "PENDING" | "APPROVED";
  verificationStatus?: "PENDING" | "APPROVED";
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
  const d = new Date(p.createdAt || p.uploadTime || Date.now());
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

  // 1. Resolve Batch Code: baca dari p.batch.code atau p.invoice.batch atau regex notes
  let batchCode = "-";
  if (p.batch?.code && p.batch.code !== "-") {
    batchCode = p.batch.code;
  } else if (p.batchCode && p.batchCode !== "-") {
    batchCode = p.batchCode;
  } else if (p.invoice?.batch) {
    batchCode = `${p.invoice.batch.countryCode}-${String(p.invoice.batch.batchNumber).padStart(3, "0")}`;
  } else if (p.notes) {
    const match = p.notes.match(/\b([A-Z]{2,3}-\d{2,3})\b/i);
    if (match) batchCode = match[1].toUpperCase();
  }

  // 2. Resolve Clean Buyer Name & Username
  let rawName = p.buyer?.name || "Anonim";
  const rawId = (p.buyerId || p.buyer?.id || "").toLowerCase();
  const lowerName = rawName.toLowerCase().trim();

  // Resolve dummy database IDs to real buyer names
  if (rawId === "b_01" || rawId === "b-01" || lowerName === "b_01" || lowerName === "b-01") {
    rawName = "Nadia Putri";
  } else if (rawId === "b_02" || rawId === "b-02" || lowerName === "b_02" || lowerName === "b-02") {
    rawName = "Raka Mahendra";
  } else if (rawId === "b_03" || rawId === "b-03" || lowerName === "b_03" || lowerName === "b-03") {
    rawName = "Alya Rahman";
  } else if (rawId === "b_04" || rawId === "b-04" || lowerName === "b_04" || lowerName === "b-04") {
    rawName = "Dimas Anggara";
  } else if (rawId === "b_05" || rawId === "b-05" || lowerName === "b_05" || lowerName === "b-05") {
    rawName = "Siti Rahma";
  }

  const rawIdLine = p.buyer?.idLine;
  const rawEmail = p.buyer?.email;
  const rawHandle = (p.buyer as unknown as { handle?: string })?.handle;

  let buyerUsername = "";
  if (rawId && /^b[-_]0\d$/i.test(rawId)) {
    buyerUsername = `@${rawId.toLowerCase().replace("-", "_")}`;
  } else if (rawIdLine && /^b[-_]0\d$/i.test(rawIdLine)) {
    buyerUsername = `@${rawIdLine.toLowerCase().replace("-", "_")}`;
  } else if (rawIdLine && !rawIdLine.includes("@buyer.ceciz")) {
    buyerUsername = `@${rawIdLine.replace(/^@/, "")}`;
  } else if (rawHandle && !rawHandle.includes("@buyer.ceciz") && !/_\d{10,}/.test(rawHandle)) {
    buyerUsername = rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`;
  } else if (rawName && rawName !== "Anonim" && !/^b[-_]0\d$/i.test(rawName)) {
    const firstWord = rawName.trim().toLowerCase().split(/\s+/)[0];
    buyerUsername = `@${firstWord}`;
  } else if (rawEmail) {
    const prefix = rawEmail.split("@")[0].replace(/_\d{10,}$/, "");
    buyerUsername = `@${prefix}`;
  } else {
    buyerUsername = "@buyer";
  }

  // 3. Resolve Sumber (Source: Admin vs Buyer)
  const isFromAdmin =
    p.source === "Admin" ||
    p.sumber === "Admin" ||
    p.notes?.includes("[Input Admin]") ||
    p.notes?.toLowerCase().includes("manual") ||
    p.notes?.toLowerCase().includes("admin") ||
    p.id?.startsWith("pay-manual-");

  const cleanNotes = (p.notes || p.keterangan || "")
    .replace("[Input Admin] ", "")
    .replace("[Input Admin]", "")
    .trim();

  const proofDetail: ProofDetail = {
    bankSender: mapBackendMethodToFrontend(p.paymentMethod),
    senderName: rawName,
    accountNumberMasked: "•••• ••••",
    targetAccount: "Rekening Resmi Ceciz GO",
    referenceNumber: p.id.slice(-8).toUpperCase(),
    transferTime: `${uploadDate} ${uploadTime}`,
    notes: cleanNotes || undefined,
  };

  return {
    id: p.id,
    buyerName: rawName,
    buyerUsername,
    batchCode,
    nominal: Number(p.amount) || 0,
    denda: 0,
    paymentMethod: mapBackendMethodToFrontend(p.paymentMethod),
    uploadDate,
    uploadTime,
    status: p.verificationStatus,
    source: isFromAdmin ? "Admin" : "Buyer",
    proofImageUrl: p.paymentProofUrl || "",
    proofDetail,
    keterangan: cleanNotes || undefined,
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
 * GET /api/v1/admin/payments/:id
 * Mengambil detail bukti pembayaran lengkap berdasarkan ID
 */
export async function getPaymentByIdApi(id: string): Promise<BackendPayment> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/payments/${encodeURIComponent(id)}`, {
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
        `Gagal memuat detail pembayaran ${id} dari server`,
    );
  }

  return json?.data || json;
}

export interface PaymentBatchOption {
  id: string;
  code: string;
  title: string;
  countryCode: string;
  batchNumber: number;
}

/**
 * GET /api/v1/admin/payments/batch-options
 * Mengambil daftar opsi batch yang memiliki invoice
 */
export async function getPaymentBatchOptionsApi(): Promise<PaymentBatchOption[]> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/payments/batch-options`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    return [];
  }

  return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
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

export interface InvoiceLookupResult {
  invoiceId: string;
  buyerId: string;
  batch: {
    id: string;
    code: string;
    title: string;
  };
  invoiceStatus: string;
  totalAmount: number;
  penaltyAmount: number;
  totalPaid: number;
  remainingAmount: number;
  deadlinePayment?: string;
}

/**
 * GET /api/v1/admin/payments/invoice-lookup
 * Mencari nominal tagihan buyer untuk batch tertentu
 */
export async function lookupInvoiceApi(
  buyerId: string,
  batchId: string,
): Promise<InvoiceLookupResult | null> {
  try {
    const params = new URLSearchParams({ buyerId, batchId });
    const url = `${BASE_URL}/api/v1/admin/payments/invoice-lookup?${params.toString()}`;
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return json?.data || json;
  } catch {
    return null;
  }
}
