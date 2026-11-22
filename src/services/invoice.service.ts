import type {
  AdminInvoiceItem,
  AdminInvoiceStats,
  AdminInvoiceStatus,
} from "@/types/invoice";
import type { CountryCode } from "@/types/common";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

function normalizeInvoice(raw: Record<string, unknown>): AdminInvoiceItem {
  const buyer = (raw.buyer as Record<string, unknown> | undefined) || {};
  const batch = (raw.batch as Record<string, unknown> | undefined) || {};
  const cc = String(raw.countryCode ?? batch.countryCode ?? "CH").toUpperCase();
  const countryCode = (["CH", "KR", "TH", "JP", "INA"].includes(cc) ? cc : "CH") as CountryCode;
  const batchNumber = batch.batchNumber ?? raw.batchNumber ?? 1;
  const batchCode =
    String(raw.batchCode ?? "") ||
    `${countryCode}-${String(batchNumber).padStart(3, "0")}`;

  const statusRaw = String(raw.status ?? "UNPAID").toUpperCase();
  const status = ([
    "UNPAID",
    "AWAITING_VERIFICATION",
    "PAID",
    "OVERDUE",
  ].includes(statusRaw)
    ? statusRaw
    : "UNPAID") as AdminInvoiceStatus;

  const amount = Number(raw.totalAmount ?? raw.amount ?? 0);
  const penaltyAmount = Number(raw.computedPenalty ?? raw.penaltyAmount ?? 0);
  const penaltyWaived = Boolean(raw.penaltyWaived);
  const effectivePenalty = penaltyWaived ? 0 : penaltyAmount;

  return {
    id: String(raw.id ?? ""),
    invoiceCode: String(raw.invoiceNumber ?? raw.invoiceCode ?? raw.id ?? "-").slice(0, 18),
    batchId: String(raw.batchId ?? batch.id ?? ""),
    batchCode,
    batchTitle: String(batch.title ?? raw.batchTitle ?? "-"),
    countryCode,
    buyerId: String(raw.buyerId ?? buyer.id ?? ""),
    buyerName: String(buyer.dnLine ?? buyer.name ?? raw.buyerName ?? "Buyer"),
    buyerHandle: buyer.idLine
      ? `@${String(buyer.idLine).replace(/^@/, "")}`
      : String(buyer.email ?? raw.buyerEmail ?? "-"),
    itemCount: Number(raw.itemCount ?? raw.totalPcs ?? 1),
    amount,
    penaltyAmount,
    daysLate: Number(raw.daysLate ?? 0),
    penaltyWaived,
    penaltyWaiveReason: raw.penaltyWaiveReason ? String(raw.penaltyWaiveReason) : null,
    totalDue: Number(raw.totalDue ?? amount + effectivePenalty),
    deadlinePayment: String(raw.deadlinePayment ?? raw.dueDate ?? new Date().toISOString()),
    status,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
  };
}

/**
 * GET /api/v1/admin/invoices/stats
 */
export async function getAdminInvoiceStatsApi(): Promise<AdminInvoiceStats> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/invoices/stats`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Gagal memuat statistik invoice (HTTP ${res.status})`);
  }
  const d = json?.data || json || {};
  const totalInvObj = typeof d.totalInvoices === "object" ? d.totalInvoices : null;
  const outstandingObj = typeof d.outstanding === "object" ? d.outstanding : null;
  const awaitingObj = typeof d.awaitingVerification === "object" ? d.awaitingVerification : null;
  const paidObj = typeof d.paidThisMonth === "object" ? d.paidThisMonth : null;

  return {
    totalInvoices: Number(totalInvObj?.count ?? d.totalInvoices ?? d.total ?? 0),
    unpaidCount: Number(outstandingObj?.count ?? d.unpaidCount ?? d.unpaid ?? 0),
    awaitingVerificationCount: Number(
      awaitingObj?.count ?? d.awaitingVerificationCount ?? d.awaitingVerification ?? 0,
    ),
    paidCount: Number(paidObj?.count ?? d.paidCount ?? d.paid ?? 0),
    overdueCount: Number(outstandingObj?.overdueCount ?? d.overdueCount ?? d.overdue ?? 0),
    totalOutstandingAmount: Number(
      outstandingObj?.amount ?? d.totalOutstandingAmount ?? d.outstandingAmount ?? 0,
    ),
    totalPenaltyAmount: Number(
      outstandingObj?.runningPenalty ?? d.totalPenaltyAmount ?? d.penaltyAmount ?? 0,
    ),
  };
}

/**
 * GET /api/v1/admin/invoices
 */
export async function getAdminInvoicesApi(params?: {
  search?: string;
  status?: AdminInvoiceStatus | "ALL";
  country?: CountryCode | "ALL";
}): Promise<AdminInvoiceItem[]> {
  const url = new URL(`${BASE_URL}/api/v1/admin/invoices`);
  if (params?.search?.trim()) url.searchParams.set("search", params.search.trim());
  if (params?.status && params.status !== "ALL") url.searchParams.set("status", params.status);
  if (params?.country && params.country !== "ALL") url.searchParams.set("country", params.country);
  url.searchParams.set("limit", "100");

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Gagal memuat daftar invoice (HTTP ${res.status})`);
  }
  const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  return list.map(normalizeInvoice);
}

/**
 * POST /api/v1/admin/invoices/generate
 */
export async function generateBatchInvoicesApi(payload: {
  batchId: string;
  deadlinePayment?: string;
  updateExisting?: boolean;
  notifyBuyers?: boolean;
}): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/invoices/generate`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      batchId: payload.batchId,
      deadlinePayment: payload.deadlinePayment || undefined,
      updateExisting: payload.updateExisting ?? true,
      notifyBuyers: payload.notifyBuyers ?? true,
    }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Gagal generate invoice batch (HTTP ${res.status})`);
  }
  return json?.data || json;
}

/**
 * PATCH /api/v1/admin/invoices/:id/waive-penalty
 */
export async function waiveInvoicePenaltyApi(
  invoiceId: string,
  reason: string,
): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/invoices/${invoiceId}/waive-penalty`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Gagal waive denda invoice (HTTP ${res.status})`);
  }
  return json?.data || json;
}

