export type CashflowType = "INCOME" | "EXPENSE";

export type PaymentMethodType = "BCA" | "QRIS" | "SEABANK" | "SPAY" | "CASH";

export interface CashflowEntry {
  id: string;
  entryDate: string; // YYYY-MM-DD or ISO string
  description: string;
  amount: number;
  type: CashflowType;
  category: string;
  paymentMethod: PaymentMethodType;
  notes?: string;
  createdById?: string;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CashflowStats {
  currentBalance: number; // Saldo Bersih Saat Ini (Total Masuk - Total Keluar)
  totalIncome: number;    // Total Pemasukan Periode
  totalExpense: number;   // Total Pengeluaran Periode
  transactionCount: number; // Jumlah Transaksi Periode
}

export interface CashflowFilterParams {
  type?: "ALL" | CashflowType;
  category?: string;
  paymentMethod?: "ALL" | PaymentMethodType;
  period?: "ALL" | "THIS_MONTH" | "LAST_30_DAYS" | "LAST_7_DAYS";
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CreateCashflowInput {
  entryDate: string;
  description: string;
  amount: number;
  type: CashflowType;
  category: string;
  paymentMethod: PaymentMethodType;
  notes?: string;
}

export interface UpdateCashflowInput extends Partial<CreateCashflowInput> {
  id: string;
}

// Preset Master Kategori Pengeluaran & Pemasukan Khas Ceciz GO
export const CASHFLOW_CATEGORIES = {
  EXPENSE: [
    { value: "BAHAN_PACKING", label: "Bahan Packing (Bubble, Box, Toploader)" },
    { value: "TRANSFER_SELLER", label: "Transfer ke Seller Luar / Proxy" },
    { value: "ONGKIR_DOMESTIK", label: "Ongkir Lokal / Warehouse Tujuan" },
    { value: "ONGKIR_INTERNASIONAL", label: "EMS / Cargo Internasional" },
    { value: "PAJAK_BEACUKAI", label: "Pajak Bea Cukai & Handling Tax" },
    { value: "FEE_ADMIN", label: "Fee Admin / Gaji Nyelem & Rekap" },
    { value: "REFUND_BUYER", label: "Pengembalian Dana / Refund Buyer" },
    { value: "OPERASIONAL_LAIN", label: "Operasional & ATK Lainnya" },
  ],
  INCOME: [
    { value: "MODAL_AWAL", label: "Setoran Modal / Injeksi Kas Owner" },
    { value: "PEMBAYARAN_BUYER", label: "Pembayaran Buyer (Transfer Langsung/Cash)" },
    { value: "PELUNASAN_TAX", label: "Pelunasan Tax & Ongkir Manual" },
    { value: "REFUND_SELLER", label: "Refund dari Seller / WH Luar" },
    { value: "BUNGA_BANK", label: "Bunga Bank / Pendapatan Lain" },
    { value: "PEMASUKAN_LAIN", label: "Pemasukan Lainnya" },
  ],
} as const;

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethodType; label: string; badgeColor: string }[] = [
  { value: "BCA", label: "Bank BCA", badgeColor: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "QRIS", label: "QRIS Ceciz", badgeColor: "bg-rose-50 text-rose-700 border-rose-200" },
  { value: "SEABANK", label: "SeaBank", badgeColor: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "SPAY", label: "ShopeePay", badgeColor: "bg-amber-50 text-amber-800 border-amber-200" },
  { value: "CASH", label: "Kas Tunai / Cash", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

