import type { CountryCode } from "./common";

export type AdminInvoiceStatus =
  | "UNPAID"
  | "AWAITING_VERIFICATION"
  | "PAID"
  | "OVERDUE";

export interface AdminInvoiceItem {
  id: string;
  invoiceCode: string;
  batchId: string;
  batchCode: string;
  batchTitle: string;
  countryCode: CountryCode;
  buyerId: string;
  buyerName: string;
  buyerHandle: string;
  itemCount: number;
  amount: number;
  penaltyAmount: number;
  daysLate: number;
  penaltyWaived: boolean;
  penaltyWaiveReason?: string | null;
  totalDue: number;
  deadlinePayment: string;
  status: AdminInvoiceStatus;
  createdAt: string;
}

export interface AdminInvoiceStats {
  totalInvoices: number;
  unpaidCount: number;
  awaitingVerificationCount: number;
  paidCount: number;
  overdueCount: number;
  totalOutstandingAmount: number;
  totalPenaltyAmount: number;
}

