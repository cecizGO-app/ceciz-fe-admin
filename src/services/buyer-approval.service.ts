import type {
  BuyerAccountRequest,
  BuyerApprovalFilter,
  BuyerApprovalStats,
  BuyerApprovalStatus,
  LineGroup,
} from "@/types/buyer-approval";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

const STORAGE_KEY = "ceciz_admin_buyer_approvals_v1";

const INITIAL_SIMULATION_REQUESTS: BuyerAccountRequest[] = [
  {
    id: "req_buyer_01",
    name: "Naya Azzahra",
    email: "naya.azzahra@gmail.com",
    dnLine: "Naya Azzahra",
    idLine: "naya_kpop",
    lineGroup: "GO_1",
    approvalStatus: "PENDING",
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "req_buyer_02",
    name: "Aulia Rahma",
    email: "aulia.rahma99@gmail.com",
    dnLine: "Aulia (Ciul Test)",
    idLine: "aulia_ciul",
    lineGroup: "GO_2",
    approvalStatus: "PENDING",
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "req_buyer_03",
    name: "Salsabila Putri",
    email: "salsa.putri@gmail.com",
    dnLine: "Salsa Carat",
    idLine: "salsa_svt17",
    lineGroup: "GO_1",
    approvalStatus: "APPROVED",
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    approvedBy: "Aurel (Owner)",
    approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
  },
  {
    id: "req_buyer_04",
    name: "Bintang Pratama",
    email: "bintang.p@gmail.com",
    dnLine: "Bintang NCTzen",
    idLine: "bintang_czn",
    lineGroup: "GO_2",
    approvalStatus: "APPROVED",
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    approvedBy: "Aurel (Owner)",
    approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
  {
    id: "req_buyer_05",
    name: "Akun Tidak Dikenal",
    email: "random.guest@gmail.com",
    dnLine: "Guest123",
    idLine: "guest_unknown",
    lineGroup: "GO_1",
    approvalStatus: "REJECTED",
    requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    rejectReason: "DN LINE / ID LINE tidak ditemukan di grup LINE Ceciz",
  },
];

function loadLocalRequests(): BuyerAccountRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore storage error
  }
  saveLocalRequests(INITIAL_SIMULATION_REQUESTS);
  return [...INITIAL_SIMULATION_REQUESTS];
}

function saveLocalRequests(items: BuyerAccountRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage error
  }
}

function normalizeBackendRequest(raw: Record<string, unknown>): BuyerAccountRequest {
  const statusRaw = String(
    raw.approvalStatus ?? raw.approval_status ?? raw.verificationStatus ?? raw.status ?? "PENDING",
  ).toUpperCase();
  const groupRaw = String(raw.lineGroup ?? raw.line_group ?? raw.group ?? "GO_1")
    .toUpperCase()
    .replace(/\s+/g, "_");
  const approverRaw = raw.approvedBy ?? raw.verifiedBy;
  const approvedByName =
    typeof approverRaw === "object" && approverRaw !== null
      ? String((approverRaw as { name?: unknown }).name ?? "") || null
      : approverRaw
        ? String(approverRaw)
        : null;

  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? raw.dnLine ?? raw.dn_line ?? "-"),
    email: String(raw.email ?? "-"),
    dnLine: String(raw.dnLine ?? raw.dn_line ?? raw.displayName ?? raw.name ?? "-"),
    idLine: String(raw.idLine ?? raw.id_line ?? raw.lineId ?? "-").replace(/^@/, ""),
    lineGroup: (groupRaw === "GO_2" ? "GO_2" : "GO_1") as LineGroup,
    approvalStatus: (["PENDING", "APPROVED", "REJECTED"].includes(statusRaw)
      ? statusRaw
      : "PENDING") as BuyerApprovalStatus,
    requestedAt: String(
      raw.requestedAt ?? raw.requested_at ?? raw.submittedAt ?? raw.createdAt ?? new Date().toISOString(),
    ),
    approvedBy: approvedByName,
    approvedAt: raw.approvedAt
      ? String(raw.approvedAt)
      : raw.verifiedAt
        ? String(raw.verifiedAt)
        : null,
    rejectReason: raw.rejectReason
      ? String(raw.rejectReason)
      : raw.reject_reason
        ? String(raw.reject_reason)
        : null,
    avatarUrl: raw.image ? String(raw.image) : null,
  };
}

function readNumericStat(val: unknown): number | undefined {
  if (typeof val === "number" && !Number.isNaN(val)) return val;
  if (typeof val === "string" && val.trim() !== "" && !Number.isNaN(Number(val))) {
    return Number(val);
  }
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    return readNumericStat(obj.count ?? obj.total ?? obj.value);
  }
  return undefined;
}

function normalizeBackendStats(
  sd: Record<string, unknown>,
  fallback: BuyerApprovalStats,
): BuyerApprovalStats {
  const tabCounts = (sd.tabCounts as Record<string, unknown> | undefined) ?? {};
  const groupCounts = (sd.groupCounts as Record<string, unknown> | undefined) ?? {};
  const memberAktif =
    typeof sd.totalMemberAktif === "object" && sd.totalMemberAktif !== null
      ? (sd.totalMemberAktif as Record<string, unknown>)
      : typeof sd.memberAktif === "object" && sd.memberAktif !== null
        ? (sd.memberAktif as Record<string, unknown>)
        : undefined;

  const pendingCount =
    readNumericStat(sd.pendingCount) ??
    readNumericStat(tabCounts.pending) ??
    readNumericStat(sd.menungguPersetujuan) ??
    readNumericStat(sd.pending) ??
    fallback.pendingCount;

  const approvedCount =
    readNumericStat(sd.approvedCount) ??
    readNumericStat(tabCounts.approved) ??
    readNumericStat(sd.akunDisetujui) ??
    readNumericStat(sd.disetujui) ??
    readNumericStat(sd.approved) ??
    fallback.approvedCount;

  const rejectedCount =
    readNumericStat(sd.rejectedCount) ??
    readNumericStat(tabCounts.rejected) ??
    readNumericStat(sd.pengajuanDitolak) ??
    readNumericStat(sd.ditolak) ??
    readNumericStat(sd.rejected) ??
    fallback.rejectedCount;

  const go1Count =
    readNumericStat(sd.go1Count) ??
    readNumericStat(memberAktif?.go1) ??
    readNumericStat(memberAktif?.GO_1) ??
    readNumericStat(groupCounts.GO_1) ??
    readNumericStat(groupCounts.go1) ??
    readNumericStat(sd.go1) ??
    fallback.go1Count;

  const go2Count =
    readNumericStat(sd.go2Count) ??
    readNumericStat(memberAktif?.go2) ??
    readNumericStat(memberAktif?.GO_2) ??
    readNumericStat(groupCounts.GO_2) ??
    readNumericStat(groupCounts.go2) ??
    readNumericStat(sd.go2) ??
    fallback.go2Count;

  const totalActiveMembers =
    readNumericStat(sd.totalActiveMembers) ??
    readNumericStat(sd.totalMemberAktif) ??
    readNumericStat(sd.memberAktif) ??
    (go1Count + go2Count > 0 ? go1Count + go2Count : approvedCount);

  return {
    pendingCount,
    approvedCount,
    rejectedCount,
    go1Count,
    go2Count,
    totalActiveMembers,
  };
}

export function computeBuyerApprovalStats(items: BuyerAccountRequest[]): BuyerApprovalStats {
  return {
    pendingCount: items.filter((i) => i.approvalStatus === "PENDING").length,
    approvedCount: items.filter((i) => i.approvalStatus === "APPROVED").length,
    rejectedCount: items.filter((i) => i.approvalStatus === "REJECTED").length,
    go1Count: items.filter((i) => i.lineGroup === "GO_1" && i.approvalStatus === "APPROVED").length,
    go2Count: items.filter((i) => i.lineGroup === "GO_2" && i.approvalStatus === "APPROVED").length,
  };
}

function applyLocalFilter(
  items: BuyerAccountRequest[],
  filter?: BuyerApprovalFilter,
): BuyerAccountRequest[] {
  return items
    .filter((item) => {
      if (filter?.status && filter.status !== "ALL" && item.approvalStatus !== filter.status) {
        return false;
      }
      if (filter?.lineGroup && filter.lineGroup !== "ALL" && item.lineGroup !== filter.lineGroup) {
        return false;
      }
      if (filter?.search?.trim()) {
        const q = filter.search.toLowerCase().trim();
        const hay = `${item.dnLine} ${item.idLine} ${item.email} ${item.name}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // PRD §6.12: Tab Pending diurutkan dari yang terlama agar antrean adil
      if (filter?.status === "PENDING") {
        return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
      }
      return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
    });
}

export interface BuyerRequestsResponse {
  items: BuyerAccountRequest[];
  stats: BuyerApprovalStats;
  source: "api" | "local";
}

/**
 * GET /api/v1/admin/buyer-approvals & GET /api/v1/admin/buyer-approvals/stats (PRD v1.5 §6.12)
 */
export async function getBuyerRequestsApi(
  filter?: BuyerApprovalFilter,
): Promise<BuyerRequestsResponse> {
  try {
    const url = new URL(`${BASE_URL}/api/v1/admin/buyer-approvals`);
    if (filter?.status && filter.status !== "ALL") url.searchParams.set("status", filter.status);
    if (filter?.lineGroup && filter.lineGroup !== "ALL") url.searchParams.set("lineGroup", filter.lineGroup);
    if (filter?.search?.trim()) url.searchParams.set("search", filter.search.trim());
    url.searchParams.set("limit", "100");

    const [listRes, statsRes] = await Promise.all([
      fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }),
      fetch(`${BASE_URL}/api/v1/admin/buyer-approvals/stats`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }).catch(() => null),
    ]);

    if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);
    const json = await listRes.json();
    const rawList: Array<Record<string, unknown>> = Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.data?.items)
        ? json.data.items
        : Array.isArray(json?.items)
          ? json.items
          : Array.isArray(json)
            ? json
            : [];
    const items = rawList.map(normalizeBackendRequest);

    let stats = computeBuyerApprovalStats(items);
    if (statsRes && statsRes.ok) {
      const sJson = await statsRes.json().catch(() => null);
      const sd = (sJson?.data || sJson) as Record<string, unknown> | null;
      if (sd && typeof sd === "object") {
        stats = normalizeBackendStats(sd, stats);
      }
    }

    return { items, stats, source: "api" };
  } catch {
    const allLocal = loadLocalRequests();
    return {
      items: applyLocalFilter(allLocal, filter),
      stats: computeBuyerApprovalStats(allLocal),
      source: "local",
    };
  }
}

/**
 * PATCH /api/v1/admin/buyer-approvals/:id/verify (PRD v1.5 §6.12)
 */
export async function verifyBuyerAccountApi(params: {
  id: string;
  action: "APPROVE" | "REJECT";
  rejectReason?: string;
  adminName?: string;
}): Promise<{ source: "api" | "local" }> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/buyer-approvals/${params.id}/verify`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: params.action === "APPROVE" ? "APPROVED" : "REJECTED",
        ...(params.rejectReason ? { rejectReason: params.rejectReason } : {}),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { source: "api" };
  } catch {
    const all = loadLocalRequests();
    const updated = all.map((item) => {
      if (item.id !== params.id) return item;
      if (params.action === "APPROVE") {
        return {
          ...item,
          approvalStatus: "APPROVED" as const,
          approvedBy: params.adminName || "Admin",
          approvedAt: new Date().toISOString(),
          rejectReason: null,
        };
      }
      return {
        ...item,
        approvalStatus: "REJECTED" as const,
        rejectReason: params.rejectReason || "Tidak ditemukan di grup LINE Ceciz",
      };
    });
    saveLocalRequests(updated);
    return { source: "local" };
  }
}

/**
 * POST /api/v1/admin/buyer-approvals/bulk-verify (PRD v1.5 §6.12)
 */
export async function bulkVerifyBuyerAccountsApi(params: {
  ids: string[];
  action: "APPROVE" | "REJECT";
  rejectReason?: string;
  adminName?: string;
}): Promise<{ source: "api" | "local" }> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/buyer-approvals/bulk-verify`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyerIds: params.ids,
        status: params.action === "APPROVE" ? "APPROVED" : "REJECTED",
        ...(params.rejectReason ? { rejectReason: params.rejectReason } : {}),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { source: "api" };
  } catch {
    const idSet = new Set(params.ids);
    const all = loadLocalRequests();
    const updated = all.map((item) => {
      if (!idSet.has(item.id)) return item;
      if (params.action === "APPROVE") {
        return {
          ...item,
          approvalStatus: "APPROVED" as const,
          approvedBy: params.adminName || "Admin",
          approvedAt: new Date().toISOString(),
          rejectReason: null,
        };
      }
      return {
        ...item,
        approvalStatus: "REJECTED" as const,
        rejectReason: params.rejectReason || "Tidak ditemukan di grup LINE Ceciz",
      };
    });
    saveLocalRequests(updated);
    return { source: "local" };
  }
}

