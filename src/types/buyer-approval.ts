export type BuyerApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type LineGroup = "GO_1" | "GO_2";

export interface BuyerAccountRequest {
  id: string;
  name: string;
  email: string;
  dnLine: string;
  idLine: string;
  lineGroup: LineGroup;
  approvalStatus: BuyerApprovalStatus;
  requestedAt: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  rejectReason?: string | null;
  avatarUrl?: string | null;
}

export interface BuyerApprovalStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  go1Count: number;
  go2Count: number;
  totalActiveMembers?: number;
}

export interface BuyerApprovalFilter {
  status?: BuyerApprovalStatus | "ALL";
  lineGroup?: LineGroup | "ALL";
  search?: string;
}

export const REJECT_REASON_PRESETS = [
  "DN LINE / ID LINE tidak ditemukan di grup LINE Ceciz",
  "Pilihan grup LINE (GO 1 / GO 2) tidak sesuai data anggota",
  "Format ID LINE tidak valid atau tidak dapat diverifikasi",
  "Akun duplikat dengan pendaftar lain yang sudah disetujui",
];

