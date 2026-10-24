export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PaymentMethod =
  | "BCA"
  | "QRIS"
  | "SeaBank"
  | "ShopeePay"
  | "Bank Mandiri"
  | "BNI"
  | "Tunai / Cash"
  | "Lainnya";

export interface ProofDetail {
  bankSender: string;
  senderName: string;
  accountNumberMasked: string;
  targetAccount: string;
  referenceNumber: string;
  transferTime: string;
  notes?: string;
}

export interface PaymentItem {
  id: string;
  buyerName: string;
  buyerUsername: string;
  batchCode: string;
  nominal: number;
  denda?: number;
  paymentMethod: PaymentMethod;
  uploadTime: string;
  uploadDate: string;
  status: PaymentStatus;
  source?: "Buyer" | "Admin"; // Sumber pembayaran: diunggah buyer atau input manual admin
  proofImageUrl: string; // URL / Data URI gambar bukti transfer
  proofDetail: ProofDetail;
  keterangan?: string; // Catatan transaksi / keterangan pembayaran
  rejectReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface VerificationStats {
  waitingCount: number;
  waitingTodayCount: number;
  approvedTodayCount: number;
  approvedTodayAmount: number;
  rejectedTodayCount: number;
  totalMonthlyVerifiedAmount: number;
  monthName: string;
}

export type StatusTab = "PENDING" | "APPROVED" | "REJECTED" | "ALL";
