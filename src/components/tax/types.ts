export type TaxStatus = "Pending" | "Unpaid" | "Approved" | "Overdue";

export type CountryCode = "CH" | "KR" | "TH" | "JP" | "INA";

export interface BatchItemRef {
  batchCode: string;
  country: CountryCode;
  itemName: string;
  qty: number;
  isPhotocard: boolean;
  itemTax: number;
}

export interface TaxInvoiceItem {
  id: string; // e.g. "TAX-023"
  buyerName: string;
  buyerHandle: string;
  buyerPhone: string;
  buyerLineId: string;
  status: TaxStatus;
  batches: BatchItemRef[];
  totalItemsCount?: number;
  itemSummary?: string;
  totalAmount: number;
  penaltyAmount: number;
  penaltyWaived: boolean;
  penaltyWaiveReason?: string;
  deadline: string; // e.g. "25 Sep 2026"
  rawDeadline: string; // ISO date for late calculations
  maxCheckoutDate: string; // e.g. "24 Nov 2026" (H+60)
  period: string; // "TAGIHAN TAX 2"
  periodMonth: string; // "September 2026"
  hasProof: boolean;
  proofStatus:
    | "none"
    | "pending"
    | "verified_bca"
    | "verified_shopeepay"
    | "verified_seabank"
    | "verified_qris";
  paymentMethod?: string;
  bankName?: string;
  refNumber?: string;
  transferDate?: string;
  notes?: string;
}

export interface TaxStats {
  activePeriodName: string;
  activePeriodMonth: string;
  unpaidAmount: number;
  unpaidCount: number;
  pendingCount: number;
  paidAmount: number;
}

export interface AvailableReleaseBatch {
  id: string;
  batchCode: string;
  title: string;
  country: CountryCode;
  warehouse: string;
  arrivedDate: string;
  totalPcs: number;
  totalBuyers: number;
  pcCount: number;
  nonPcCount: number;
  estimatedTax: number;
}

export function formatReadableDateTime(dtStr: string): string {
  if (!dtStr) return "-";
  try {
    const d = new Date(dtStr);
    if (isNaN(d.getTime())) return dtStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dtStr;
  }
}
