import type { BatchItem, BatchStatus } from "@/types/batch";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

export type BackendCountryCode = "CH" | "KR" | "TH" | "JP" | "INA";
export type BackendBatchStatus = "OPEN" | "CLOSED" | "ARCHIVED";

export interface BackendBatchItemInput {
  buyerId: string;
  buyerName?: string;
  description: string;
  hargaAsli: number;
  pcs: number;
  feeNyelem?: number;
  hargaPerBuyer?: number;
  hargaJualPerBuyer?: number;
}

export interface BackendCreateBatchInput {
  countryCode: BackendCountryCode;
  batchNumber: number;
  batchDate: string; // YYYY-MM-DD
  title: string;
  description?: string;
  shippingFee?: number;
  feeGo?: number;
  feeRekap?: number;
  feeNyelem?: number;
  rateHarian?: number;
  rateSeller?: number;
  feeWh?: number;
  feeProxy?: number;
  adminNyelemId?: string;
  proxyCoName?: string;
  items?: BackendBatchItemInput[];
}

export interface BackendBatch {
  id: string;
  countryCode: BackendCountryCode;
  batchNumber: number;
  batchDate: string;
  title: string;
  description?: string | null;
  shippingFee?: number | string | null;
  feeGo: number | string;
  feeRekap: number | string;
  feeNyelem: number | string;
  rateHarian?: number | string | null;
  feeWh?: number | string | null;
  feeProxy?: number | string | null;
  adminNyelemId?: string | null;
  adminNyelem?: { id: string; name: string; email?: string } | null;
  proxyCoName?: string | null;
  status: BackendBatchStatus;
  hargaTotal?: number | string | null;
  hargaTfSeller?: number | string | null;
  selisihHarga?: number | string | null;
  labaBersih?: number | string | null;
  createdAt: string;
  updatedAt: string;
  items?: Array<{
    id: string;
    batchId: string;
    buyerId: string;
    buyerName?: string | null;
    description: string;
    hargaAsli: number | string;
    pcs: number;
    feeNyelem?: number | string | null;
    hargaPerBuyer?: number | string | null;
    hargaJualPerBuyer?: number | string | null;
  }>;
  _count?: {
    items: number;
  };
}

/**
 * Konversi status dari format Backend ("OPEN" | "CLOSED" | "ARCHIVED")
 * ke format Frontend ("Open" | "Closed" | "Archived")
 */
export function mapBackendStatusToFrontend(
  status: BackendBatchStatus,
): BatchStatus {
  switch (status) {
    case "OPEN":
      return "Open";
    case "CLOSED":
      return "Closed";
    case "ARCHIVED":
      return "Archived";
    default:
      return "Open";
  }
}

/**
 * Konversi status dari format Frontend ("Open" | "Closed" | "Archived")
 * ke format Backend ("OPEN" | "CLOSED" | "ARCHIVED")
 */
export function mapFrontendStatusToBackend(
  status: BatchStatus,
): BackendBatchStatus {
  switch (status) {
    case "Open":
      return "OPEN";
    case "Closed":
      return "CLOSED";
    case "Archived":
      return "ARCHIVED";
    default:
      return "OPEN";
  }
}

/**
 * Mapping data Batch dari Backend Prisma ke BatchItem di Dashboard Table
 */
export function mapBackendBatchToFrontend(batch: BackendBatch): BatchItem {
  const currencyMap: Record<BackendCountryCode, string> = {
    CH: "Yuan",
    KR: "Won",
    TH: "Baht",
    JP: "Yen",
    INA: "Rupiah",
  };

  const formattedDate = batch.batchDate
    ? new Date(batch.batchDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  const formattedBatchNumber = `${batch.countryCode}-${String(batch.batchNumber).padStart(3, "0")}`;

  const totalPc =
    batch.items && batch.items.length > 0
      ? batch.items.reduce((sum, item) => sum + (Number(item.pcs) || 1), 0)
      : (batch._count?.items ?? 0);

  const buyerCount =
    batch.items && batch.items.length > 0
      ? new Set(batch.items.map((i) => i.buyerId)).size
      : (batch._count?.items ?? 0);

  return {
    id: batch.id,
    batchNumber: formattedBatchNumber,
    countryCode: batch.countryCode,
    countryCurrency: currencyMap[batch.countryCode] || batch.countryCode,
    date: formattedDate,
    warehouseProxy: batch.proxyCoName || batch.adminNyelem?.name || "-",
    buyerCount,
    totalPc,
    status: mapBackendStatusToFrontend(batch.status),
    labaAmount: batch.labaBersih != null ? Number(batch.labaBersih) : null,
    isHidden: false,
  };
}

/**
 * GET /api/v1/admin/batches
 * Mengambil daftar batch dengan filter countryCode dan status
 */
export async function getBatchesApi(params?: {
  countryCode?: BackendCountryCode;
  status?: BackendBatchStatus;
}): Promise<BackendBatch[]> {
  const url = new URL(`${BASE_URL}/api/v1/admin/batches`);
  if (params?.countryCode)
    url.searchParams.set("countryCode", params.countryCode);
  if (params?.status) url.searchParams.set("status", params.status);

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg =
      json?.error?.message ||
      (typeof json?.error === "string" ? json.error : null) ||
      json?.message ||
      (res.status === 500
        ? "Server backend mengalami crash (500 Internal Server Error). Periksa log backend / database Neon."
        : res.status === 401
          ? "Sesi login tidak valid atau telah berakhir (401 Unauthorized)."
          : res.status === 403
            ? "Akses ditolak: Akun Anda tidak memiliki role OWNER atau STAFF (403 Forbidden)."
            : `Gagal mengambil daftar batch dari backend (HTTP ${res.status})`);
    throw new Error(errorMsg);
  }
  return json?.data || [];
}

/**
 * GET /api/v1/admin/batches/stats
 * Mengambil ringkasan statistik batch dari backend
 */
export async function getBatchStatsApi(): Promise<{
  activeBatches: number;
  totalPc: number;
  waitingCalculation: number;
  archivedBatches: number;
}> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/batches/stats`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg =
      json?.error?.message ||
      (typeof json?.error === "string" ? json.error : null) ||
      json?.message ||
      `Gagal mengambil statistik batch (HTTP ${res.status})`;
    throw new Error(errorMsg);
  }

  const data = json?.data || {};
  return {
    activeBatches: Number(data.activeBatches ?? data.totalBatchAktif ?? 0),
    totalPc: Number(data.activePcs ?? data.totalPcDiproses ?? 0),
    waitingCalculation: Number(data.waitingCalculation ?? data.menungguKalkulasiLaba ?? 0),
    archivedBatches: Number(data.archivedBatches ?? data.batchDiarsipkan ?? 0),
  };
}

/**
 * GET /api/v1/admin/batches/:id
 * Mengambil detail batch by ID
 */
export async function getBatchByIdApi(id: string): Promise<BackendBatch> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/batches/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg =
      json?.error?.message ||
      (typeof json?.error === "string" ? json.error : null) ||
      json?.message ||
      `Gagal mengambil detail batch (HTTP ${res.status})`;
    throw new Error(errorMsg);
  }
  return json?.data;
}

/**
 * POST /api/v1/admin/batches
 * Membuat batch baru di backend
 */
export async function createBatchApi(
  payload: BackendCreateBatchInput,
): Promise<BackendBatch> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/batches`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    if (json?.errors && Array.isArray(json.errors)) {
      const details = json.errors
        .map(
          (e: { field: string; message: string }) => `${e.field}: ${e.message}`,
        )
        .join(", ");
      throw new Error(`${json.message || "Validasi gagal"}: ${details}`);
    }
    const errorMsg =
      json?.error?.message ||
      (typeof json?.error === "string" ? json.error : null) ||
      json?.message ||
      `Gagal membuat batch baru (HTTP ${res.status})`;
    throw new Error(errorMsg);
  }
  return json?.data;
}

/**
 * PATCH /api/v1/admin/batches/:id
 * Update status atau data batch by ID
 */
export async function patchBatchApi(
  id: string,
  payload: Partial<BackendCreateBatchInput> & { status?: BackendBatchStatus },
): Promise<BackendBatch> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/batches/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg =
      json?.error?.message ||
      (typeof json?.error === "string" ? json.error : null) ||
      json?.message ||
      `Gagal memperbarui status batch (HTTP ${res.status})`;
    throw new Error(errorMsg);
  }
  return json?.data;
}

/**
 * DELETE /api/v1/admin/batches/:id
 * Menghapus batch by ID (hanya bisa jika belum ada pesanan / items)
 */
export async function deleteBatchApi(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/batches/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg =
      json?.error?.message ||
      (typeof json?.error === "string" ? json.error : null) ||
      json?.message ||
      `Gagal menghapus batch (HTTP ${res.status})`;
    throw new Error(errorMsg);
  }
}


export interface BackendFormOptions {
  settings?: {
    dailyRate?: Record<string, number>;
    defaultFeeNyelem?: number;
    feeRekapTiers?: Array<{ min_pcs: number; max_pcs: number; fee: number; label: string }>;
    deadlineBatchHours?: number;
  };
  nextBatchNumbers?: Record<string, number>;
  buyers?: Array<{ id: string; name: string; email?: string }>;
  admins?: Array<{ id: string; name: string; email?: string; role?: string }>;
}

/**
 * GET /api/v1/admin/batches/form-options
 * Mengambil opsi form batch (buyers, admins, nextBatchNumbers, settings dailyRate)
 */
export async function getBatchFormOptionsApi(): Promise<BackendFormOptions> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/batches/form-options`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg =
      json?.error?.message ||
      (typeof json?.error === "string" ? json.error : null) ||
      json?.message ||
      `Gagal memuat opsi form batch (HTTP ${res.status})`;
    throw new Error(errorMsg);
  }
  return json?.data || json;
}

/**
 * GET /api/v1/admin/batches/next-number?countryCode=...
 * Mengambil nomor batch sekuensial berikutnya untuk negara tertentu dari database backend
 */
export async function getNextBatchNumberApi(
  countryCode: BackendCountryCode,
): Promise<{
  countryCode: BackendCountryCode;
  nextBatchNumber: number;
  formattedCode: string;
}> {
  const url = new URL(`${BASE_URL}/api/v1/admin/batches/next-number`);
  url.searchParams.set("countryCode", countryCode);

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg =
      json?.error?.message ||
      (typeof json?.error === "string" ? json.error : null) ||
      json?.message ||
      `Gagal mengambil nomor batch berikutnya (HTTP ${res.status})`;
    throw new Error(errorMsg);
  }
  return json?.data;
}

