import type {
  BatchItemRef,
  CountryCode,
  TaxInvoiceItem,
  TaxStats,
  TaxStatus,
} from "@/types/tax";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

function formatShortDate(iso?: string | null): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(iso);
  }
}

function mapBackendTaxStatus(rawStatus: string, hasPendingPayment: boolean): TaxStatus {
  const s = (rawStatus || "").toUpperCase();
  if (s === "PAID" || s === "APPROVED") return "Approved";
  if (s === "OVERDUE") return "Overdue";
  if (s === "PENDING" || hasPendingPayment) return "Pending";
  return "Unpaid";
}

function mapProofStatus(
  status: TaxStatus,
  method?: string | null,
): TaxInvoiceItem["proofStatus"] {
  if (status === "Pending") return "pending";
  if (status === "Approved") {
    const m = (method || "").toUpperCase();
    if (m.includes("SPAY") || m.includes("SHOPEE")) return "verified_shopeepay";
    if (m.includes("SEABANK")) return "verified_seabank";
    if (m.includes("QRIS")) return "verified_qris";
    return "verified_bca";
  }
  return "none";
}

export interface BackendTaxInvoiceWithMeta extends TaxInvoiceItem {
  backendPaymentId?: string;
}

function normalizeTaxInvoice(raw: Record<string, unknown>): BackendTaxInvoiceWithMeta {
  const buyer = (raw.buyer as Record<string, unknown> | undefined) || {};
  const payments = Array.isArray(raw.taxPayments)
    ? (raw.taxPayments as Array<Record<string, unknown>>)
    : Array.isArray(raw.payments)
      ? (raw.payments as Array<Record<string, unknown>>)
      : [];
  const latestPayment = payments[0];
  const hasPendingPayment =
    Boolean(raw.pendingPaymentsCount && Number(raw.pendingPaymentsCount) > 0) ||
    (latestPayment &&
      String(
        latestPayment.taxVerificationStatus ?? latestPayment.status ?? "",
      ).toUpperCase() === "PENDING");

  const status = mapBackendTaxStatus(
    String(raw.displayStatus ?? raw.status ?? "UNPAID"),
    Boolean(hasPendingPayment),
  );

  const rawItems = Array.isArray(raw.breakdownDetail)
    ? (raw.breakdownDetail as Array<Record<string, unknown>>)
    : Array.isArray(raw.items)
      ? (raw.items as Array<Record<string, unknown>>)
      : Array.isArray(raw.breakdown)
        ? (raw.breakdown as Array<Record<string, unknown>>)
        : [];

  let batches: BatchItemRef[] = rawItems.map((it) => {
    const batchObj = (it.batch as Record<string, unknown> | undefined) || {};
    const rawCode = String(
      it.batchCode ??
        it.batch_code ??
        batchObj.batchCode ??
        batchObj.code ??
        "",
    ).trim();
    const ccFromCode = rawCode.includes("-") ? rawCode.split("-")[0] : "";
    const cc = String(
      it.countryCode ?? it.country ?? batchObj.countryCode ?? ccFromCode ?? "CH",
    ).toUpperCase();
    const country = (
      ["CH", "KR", "TH", "JP", "INA"].includes(cc) ? cc : "CH"
    ) as CountryCode;
    const batchNum =
      it.batch_number ?? it.batchNumber ?? batchObj.batchNumber;
    const batchCode =
      rawCode ||
      (batchNum !== undefined && batchNum !== null
        ? `${country}-${String(batchNum).padStart(3, "0")}`
        : Array.isArray(raw.coveredBatches) && raw.coveredBatches[0]
          ? String(raw.coveredBatches[0])
          : `${country}-001`);

    return {
      batchCode,
      country,
      itemName: String(
        it.item_desc ??
          it.item ??
          it.itemName ??
          it.description ??
          it.title ??
          "Item",
      ),
      qty: Number(it.qty ?? it.pcs ?? 1),
      isPhotocard: String(it.category ?? "PC").toUpperCase() === "PC",
      itemTax: Number(it.subtotal_tax ?? it.subtotal ?? it.itemTax ?? 0),
    };
  });

  // Fallback: jika breakdownDetail kosong tapi backend mengirim coveredBatches (mis. ["KR-001", "CH-002"])
  if (batches.length === 0 && Array.isArray(raw.coveredBatches)) {
    batches = (raw.coveredBatches as unknown[])
      .map((code) => String(code || "").trim())
      .filter(Boolean)
      .map((batchCode) => {
        const prefix = batchCode.split("-")[0]?.toUpperCase() || "CH";
        const country = (
          ["CH", "KR", "TH", "JP", "INA"].includes(prefix) ? prefix : "CH"
        ) as CountryCode;
        return {
          batchCode,
          country,
          itemName: String(raw.itemSummary ?? `Batch ${batchCode}`),
          qty: 1,
          isPhotocard: true,
          itemTax: 0,
        };
      });
  }

  const rawId = String(raw.id ?? raw.invoiceCode ?? `TAX-${Date.now()}`);
  const rawInvoiceNumber = String(
    raw.invoiceNumber ?? raw.invoiceCode ?? "",
  ).trim();
  const formattedInvoiceNumber =
    rawInvoiceNumber ||
    (rawId.length > 16
      ? `TAX-${rawId.slice(-6).toUpperCase()}`
      : rawId);

  const rawIdLine = buyer.idLine ? String(buyer.idLine).trim() : "";
  const isPhoneLike = (val: string) =>
    /^(?:\+?62|0)?\d{8,15}$/.test(val.replace(/^@/, "").replace(/[\s\-()]/g, ""));
  const buyerName = String(buyer.dnLine ?? buyer.name ?? raw.buyerName ?? "Buyer");
  const buyerHandle =
    rawIdLine && !isPhoneLike(rawIdLine)
      ? `@${rawIdLine.replace(/^@/, "")}`
      : buyer.email
        ? `@${String(buyer.email).split("@")[0]}`
        : String(raw.buyerHandle ?? `@${buyerName.toLowerCase().replace(/\s+/g, "_")}`);

  const rawDeadline = String(raw.deadlinePayment ?? raw.deadline ?? new Date().toISOString());
  const rawMaxCo = String(raw.maxCheckoutDate ?? rawDeadline);
  const paymentMethod = latestPayment?.paymentMethod
    ? String(latestPayment.paymentMethod)
    : undefined;

  return {
    id: rawId,
    invoiceNumber: formattedInvoiceNumber,
    buyerName,
    buyerHandle,
    buyerPhone: String(buyer.contact ?? raw.buyerPhone ?? "-"),
    buyerLineId: rawIdLine || String(raw.buyerLineId ?? "-"),
    status,
    batches,
    totalItemsCount:
      Number(raw.totalItem ?? raw.totalPcs ?? 0) ||
      batches.reduce((acc, b) => acc + b.qty, 0) ||
      1,
    itemSummary:
      (raw.itemSummary ? String(raw.itemSummary) : undefined) ||
      batches.map((b) => b.itemName).slice(0, 2).join(", ") ||
      undefined,
    totalAmount: Number(raw.totalTax ?? raw.totalAmount ?? 0),
    penaltyAmount: Number(raw.penaltyAmount ?? 0),
    penaltyWaived: Boolean(raw.penaltyWaived),
    penaltyWaiveReason: raw.penaltyWaiveReason ? String(raw.penaltyWaiveReason) : undefined,
    deadline: formatShortDate(rawDeadline),
    rawDeadline,
    maxCheckoutDate: formatShortDate(rawMaxCo),
    period: String(raw.releaseName ?? raw.period ?? "TAGIHAN TAX"),
    periodMonth: String(raw.releasePeriod ?? raw.periodMonth ?? "-"),
    hasProof: Boolean(
      raw.hasPaymentProof ||
        latestPayment?.proofImageUrl ||
        latestPayment?.proofUrl ||
        hasPendingPayment,
    ),
    proofStatus: mapProofStatus(status, paymentMethod),
    paymentMethod,
    bankName: paymentMethod,
    transferDate: latestPayment?.paidAt ? formatShortDate(String(latestPayment.paidAt)) : undefined,
    notes: raw.notes ? String(raw.notes) : undefined,
    backendPaymentId: latestPayment?.id ? String(latestPayment.id) : undefined,
  };
}

/**
 * GET /api/v1/admin/taxes/stats
 */
export async function getTaxStatsApi(): Promise<TaxStats> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/taxes/stats`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Gagal memuat statistik tax (HTTP ${res.status})`);
  }
  const d = json?.data || json || {};
  return {
    activePeriodName: String(
      d.activePeriod ?? d.activePeriodName ?? d.latestReleaseName ?? "TAGIHAN TAX",
    ),
    activePeriodMonth: String(
      d.activePeriodMonth ?? d.latestReleasePeriod ?? "-",
    ),
    unpaidAmount: Number(d.outstandingAmount ?? d.unpaidAmount ?? 0),
    unpaidCount: Number(
      d.outstandingInvoicesCount ?? d.unpaidCount ?? d.outstandingCount ?? 0,
    ),
    pendingCount: Number(
      d.pendingVerificationCount ?? d.pendingCount ?? 0,
    ),
    paidAmount: Number(
      d.paidThisMonthAmount ?? d.paidAmount ?? d.collectedAmount ?? 0,
    ),
  };
}

/**
 * GET /api/v1/admin/taxes/invoices
 */
export async function getTaxInvoicesApi(params?: {
  search?: string;
  status?: string;
  period?: string;
  country?: string;
}): Promise<BackendTaxInvoiceWithMeta[]> {
  const url = new URL(`${BASE_URL}/api/v1/admin/taxes/invoices`);
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.status && params.status !== "ALL") url.searchParams.set("status", params.status);
  if (params?.period && params.period !== "ALL") url.searchParams.set("period", params.period);
  if (params?.country && params.country !== "ALL") url.searchParams.set("country", params.country);

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Gagal memuat daftar tagihan tax (HTTP ${res.status})`);
  }
  const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  return list.map(normalizeTaxInvoice);
}

/**
 * GET /api/v1/admin/taxes/preview
 * Mengambil daftar item yang belum ditagih tax dari backend untuk Release Wizard
 */
export interface TaxPreviewItem {
  itemId: string;
  buyerId: string;
  buyerName: string;
  buyerHandle: string;
  batchId: string;
  batchCode: string;
  country: CountryCode;
  itemName: string;
  category: "PC" | "Non-PC";
  rateAcuan: string;
  qty: number;
  subtotal: number;
}

export async function getTaxPreviewApi(): Promise<TaxPreviewItem[]> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/taxes/preview`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Gagal memuat preview tax (HTTP ${res.status})`);
  }
  const rawList = Array.isArray(json?.data?.items)
    ? json.data.items
    : Array.isArray(json?.data)
      ? json.data
      : [];

  return rawList.map((it: Record<string, unknown>) => {
    const cc = String(it.countryCode ?? it.country ?? "CH").toUpperCase();
    const country = (["CH", "KR", "TH", "JP", "INA"].includes(cc) ? cc : "CH") as CountryCode;
    return {
      itemId: String(it.itemId ?? it.id ?? ""),
      buyerId: String(it.buyerId ?? ""),
      buyerName: String(it.buyerName ?? "Buyer"),
      buyerHandle: it.buyerIdLine
        ? `@${String(it.buyerIdLine).replace(/^@/, "")}`
        : String(it.buyerHandle ?? "-"),
      batchId: String(it.batchId ?? ""),
      batchCode: String(it.batchCode ?? "-"),
      country,
      itemName: String(it.item ?? it.itemName ?? "Item"),
      category: String(it.category ?? "PC") === "Non-PC" ? "Non-PC" : "PC",
      rateAcuan: String(it.rateLabel ?? `Rp ${Number(it.rateAcuan ?? 7000).toLocaleString("id-ID")} / pcs`),
      qty: Number(it.pcs ?? it.qty ?? 1),
      subtotal: Number(it.subtotal ?? 0),
    };
  });
}

/**
 * POST /api/v1/admin/taxes/releases
 */
export async function releaseTaxApi(payload: {
  releaseName: string;
  releasePeriod: string;
  deadlinePayment?: string;
  maxCheckoutDate?: string;
  notes?: string;
}): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/taxes/releases`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Gagal merilis tagihan tax (HTTP ${res.status})`);
  }
  return json?.data || json;
}

/**
 * PATCH /api/v1/admin/taxes/payments/:id/verify
 */
export async function verifyTaxPaymentApi(
  paymentId: string,
  payload: { status: "APPROVED" | "REJECTED"; rejectReason?: string },
): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/taxes/payments/${paymentId}/verify`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Gagal memverifikasi pembayaran tax (HTTP ${res.status})`);
  }
  return json?.data || json;
}

