import type { Pkg, Stage, TrackingBuyerItem } from "@/types/tracking";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

export interface BackendTrackingBatchItem {
  id: string;
  description: string;
  pcs: number;
  buyerId?: string;
  buyerName?: string | null;
  buyer?: {
    id: string;
    name: string;
    idLine?: string | null;
    contact?: string | null;
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

const KNOWN_BUYERS_MAP: Record<string, { name: string; username: string }> = {
  b_01: { name: "Nadia Putri", username: "@b_01" },
  b_02: { name: "Raka Mahendra", username: "@b_02" },
  b_03: { name: "Alya Rahman", username: "@b_03" },
  b_04: { name: "Dimas Anggara", username: "@b_04" },
  b_05: { name: "Siti Rahma", username: "@b_05" },
  "b-01": { name: "Nadia Putri", username: "@b_01" },
  "b-02": { name: "Raka Mahendra", username: "@b_02" },
  "b-03": { name: "Alya Rahman", username: "@b_03" },
  "b-04": { name: "Dimas Anggara", username: "@b_04" },
  "b-05": { name: "Siti Rahma", username: "@b_05" },
};

function resolveBuyerNameAndUsername(
  rawId?: string,
  rawName?: string | null,
  rawIdLine?: string | null,
): { name: string; username: string } {
  const lowerId = (rawId || "").toLowerCase().trim();
  const lowerName = (rawName || "").toLowerCase().trim();

  // 1. Cek dari ID known mapping (b_01, b_02, etc.)
  if (KNOWN_BUYERS_MAP[lowerId]) {
    return KNOWN_BUYERS_MAP[lowerId];
  }
  if (KNOWN_BUYERS_MAP[lowerName]) {
    return KNOWN_BUYERS_MAP[lowerName];
  }

  // 2. Resolve nama asli
  let name = rawName?.trim() || "";
  if (!name || /^b[-_]0\d$/i.test(name)) {
    name = rawId || "Buyer";
  }

  // 3. Resolve username/handle
  let username = "";
  if (lowerId && /^b[-_]0\d$/i.test(lowerId)) {
    username = `@${lowerId.replace("-", "_")}`;
  } else if (rawIdLine && !rawIdLine.includes("@buyer.ceciz")) {
    username = rawIdLine.startsWith("@") ? rawIdLine : `@${rawIdLine}`;
  } else if (name && name !== "Buyer") {
    username = `@${name.toLowerCase().replace(/\s+/g, "")}`;
  } else {
    username = lowerId ? `@${lowerId}` : "@buyer";
  }

  return { name, username };
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

  // Group unique buyers from batch items
  const buyersMap = new Map<
    string,
    {
      id: string;
      name: string;
      username: string;
      pcs: number;
      itemDescriptions: string[];
    }
  >();

  for (const it of items) {
    const rawId = it.buyerId || it.buyer?.id || "";
    const rawName = it.buyer?.name || it.buyerName || rawId;
    const rawLine = it.buyer?.idLine;

    const { name, username } = resolveBuyerNameAndUsername(rawId, rawName, rawLine);
    const key = rawId || name || "unknown";

    if (!buyersMap.has(key)) {
      buyersMap.set(key, {
        id: rawId,
        name,
        username,
        pcs: Number(it.pcs) || 1,
        itemDescriptions: it.description ? [it.description] : [],
      });
    } else {
      const existing = buyersMap.get(key)!;
      existing.pcs += Number(it.pcs) || 1;
      if (it.description && !existing.itemDescriptions.includes(it.description)) {
        existing.itemDescriptions.push(it.description);
      }
    }
  }

  const buyersList: TrackingBuyerItem[] = Array.from(buyersMap.values()).map(
    (b) => ({
      id: b.id,
      name: b.name,
      username: b.username,
      pcs: b.pcs,
      itemDescription: b.itemDescriptions.join(", ") || undefined,
    }),
  );

  let buyerName = "Seluruh Buyer";
  let handle = "@batch";

  if (buyersList.length === 1) {
    buyerName = buyersList[0].name;
    handle = buyersList[0].username;
  } else if (buyersList.length > 1) {
    const remaining = buyersList.length - 1;
    buyerName = `${buyersList[0].name} (+${remaining} buyer)`;
    handle = `${buyersList[0].username} • ${buyersList.length} Buyer`;
  }

  const totalPcs = items.reduce((sum, it) => sum + (it.pcs || 1), 0);
  const itemDesc = items[0]?.description
    ? `${items[0].description}${items.length > 1 ? ` (+${items.length - 1} item)` : ""} (${totalPcs} pcs)`
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
    buyersList,
    totalBuyers: buyersList.length,
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
