import type { Pkg, Stage } from "@/types/tracking";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

export interface BackendTrackingBatchItem {
  id: string;
  description: string;
  pcs: number;
  buyer?: {
    id: string;
    name: string;
    idLine?: string | null;
  } | null;
}

export interface BackendTracking {
  id: string;
  batchId: string;
  countryCode: "CH" | "KR" | "TH" | "JP" | "INA" | string;
  trackingStatus:
    | "PO"
    | "ON_SELLER_HAND"
    | "ARRIVED_WH_LUAR"
    | "OTW_INA"
    | "ARRIVED_WH_INA"
    | "BISA_DI_CO"
    | "DONE"
    | string;
  resiNumber: string[];
  whName?: string | null;
  boxNo?: string | null;
  description?: string | null;
  checkedOut?: boolean;
  uploadedToAlbum?: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  batch?: {
    id: string;
    batchNumber: number;
    countryCode: string;
    status: string;
    items?: BackendTrackingBatchItem[];
  } | null;
}

export interface GetTrackingParams {
  countryCode?: string;
  trackingStatus?: string;
  whName?: string;
  search?: string;
}

export interface UpdateTrackingInput {
  trackingStatus?: string;
  resiNumber?: string[];
  whName?: string;
  boxNo?: string;
  description?: string;
  checkedOut?: boolean;
  uploadedToAlbum?: boolean;
  notes?: string;
}

/**
 * Mapping status tracking dari enum backend ke format tampilan label frontend
 */
export function mapBackendStageToFrontend(status: string): Stage {
  switch (status?.toUpperCase()) {
    case "PO":
      return "PO";
    case "ON_SELLER_HAND":
      return "On Seller Hand";
    case "ARRIVED_WH_LUAR":
      return "Arrived WH Luar";
    case "OTW_INA":
      return "OTW INA";
    case "ARRIVED_WH_INA":
      return "Arrived WH INA";
    case "BISA_DI_CO":
      return "Bisa di CO";
    case "DONE":
      return "Done";
    default:
      return "PO";
  }
}

/**
 * Mapping status tracking dari label frontend ke enum backend
 */
export function mapFrontendStageToBackend(stage: Stage | string): string {
  switch (stage) {
    case "PO":
      return "PO";
    case "On Seller Hand":
      return "ON_SELLER_HAND";
    case "Arrived WH Luar":
      return "ARRIVED_WH_LUAR";
    case "OTW INA":
      return "OTW_INA";
    case "Arrived WH INA":
      return "ARRIVED_WH_INA";
    case "Bisa di CO":
      return "BISA_DI_CO";
    case "Done":
      return "DONE";
    default:
      return "PO";
  }
}

/**
 * Konversi BackendTracking ke format Pkg untuk tabel logistik
 */
export function mapBackendTrackingToPkg(
  trk: BackendTracking,
  index = 0,
): Pkg {
  const d = new Date(trk.updatedAt || trk.createdAt);
  const updated = !isNaN(d.getTime())
    ? d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const batchCode = trk.batch
    ? `${trk.batch.countryCode}-${String(trk.batch.batchNumber).padStart(3, "0")}`
    : `${trk.countryCode}-BATCH`;

  const items = trk.batch?.items || [];
  const firstBuyer = items[0]?.buyer;
  const buyerName = firstBuyer?.name || "Seluruh Buyer";
  const handle = firstBuyer?.idLine ? `@${firstBuyer.idLine}` : "@buyer";
  const totalPcs = items.reduce((sum, it) => sum + (it.pcs || 1), 0);
  const itemDesc = items[0]?.description
    ? `${items[0].description} (${totalPcs} pcs)`
    : trk.description || `Merchandise (${totalPcs || 1} pcs)`;

  return {
    id: trk.id || `trk-${index + 1}`,
    batchId: trk.batchId,
    batch: batchCode,
    country: trk.countryCode,
    buyer: buyerName,
    handle,
    item: itemDesc,
    warehouse: trk.whName || "Warehouse",
    resi: Array.isArray(trk.resiNumber) ? trk.resiNumber : [],
    box: trk.boxNo || `BOX-${batchCode}`,
    stage: mapBackendStageToFrontend(trk.trackingStatus),
    co: Boolean(trk.checkedOut),
    album: Boolean(trk.uploadedToAlbum),
    updated,
    note: trk.notes || "",
  };
}

export interface BackendTrackingStats {
  totalPaketBerjalan: number;
  tibaDiWarehouseId: number;
  siapDiCoShopee: number;
  paketSelesai: number;
  activePackages?: number;
  arrivedWhIna?: number;
  readyToCheckout?: number;
  archivedPackages?: number;
}

/**
 * GET /api/v1/admin/tracking/stats
 * Mengambil ringkasan metrik statistik tracking logistik
 */
export async function getTrackingStatsApi(): Promise<BackendTrackingStats> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/tracking/stats`, {
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
        "Gagal memuat statistik tracking logistik",
    );
  }

  return json?.data || json;
}

/**
 * GET /api/v1/admin/tracking
 * Mengambil seluruh data tracking logistik dari backend
 */
export async function getAllTrackingApi(
  params?: GetTrackingParams,
): Promise<BackendTracking[]> {
  const url = new URL(`${BASE_URL}/api/v1/admin/tracking`);

  if (params?.countryCode && params.countryCode !== "Semua Negara")
    url.searchParams.set("countryCode", params.countryCode);
  if (params?.trackingStatus && params.trackingStatus !== "Semua Status")
    url.searchParams.set("trackingStatus", params.trackingStatus);
  if (params?.whName && params.whName !== "Semua Warehouse")
    url.searchParams.set("whName", params.whName);
  if (params?.search) url.searchParams.set("search", params.search);

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
        "Gagal memuat data tracking logistik dari server",
    );
  }

  return Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
}

/**
 * GET /api/v1/admin/tracking/:batchId
 * Mengambil detail logistik tracking berdasarkan batchId
 */
export async function getTrackingByBatchIdApi(
  batchId: string,
): Promise<BackendTracking> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/tracking/${batchId}`, {
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
        "Gagal memuat detail tracking batch",
    );
  }

  return json?.data || json;
}

/**
 * PATCH /api/v1/admin/tracking/:batchId
 * Memperbarui status 7 tahap, nomor resi, boxNo, atau checklist CO
 */
export async function updateTrackingApi(
  batchId: string,
  input: UpdateTrackingInput,
): Promise<BackendTracking> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/tracking/${batchId}`, {
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
        "Gagal memperbarui status tracking",
    );
  }

  return json?.data || json;
}
