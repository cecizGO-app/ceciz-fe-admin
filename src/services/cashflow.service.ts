import type {
  CashflowEntry,
  CashflowFilterParams,
  CashflowStats,
  CreateCashflowInput,
  UpdateCashflowInput,
} from "@/types/cashflow";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://ceciz-backend.vercel.app";

const LOCAL_STORAGE_KEY = "ceciz_cashflow_entries_v1";

// Mock data awal yang realistis untuk operasional Ceciz GO
const INITIAL_MOCK_ENTRIES: CashflowEntry[] = [
  {
    id: "cf-001",
    entryDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString().split("T")[0],
    description: "Injeksi Modal Kas Ceciz GO (Awal Bulan)",
    amount: 15000000,
    type: "INCOME",
    category: "MODAL_AWAL",
    paymentMethod: "BCA",
    notes: "Setoran kas awal oleh Owner Aurel",
    createdById: "owner-1",
    createdByName: "Aurel (Owner)",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: "cf-002",
    entryDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().split("T")[0],
    description: "Beli Bubble Wrap 50m & Toploader Ultra Pro 10 Pack",
    amount: 475000,
    type: "EXPENSE",
    category: "BAHAN_PACKING",
    paymentMethod: "SPAY",
    notes: "Pembelian via Tokopedia Toko Plastik Jaya",
    createdById: "owner-1",
    createdByName: "Aurel (Owner)",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "cf-003",
    entryDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString().split("T")[0],
    description: "Transfer Tagihan Seller China Batch CH-039 via Proxy",
    amount: 5850000,
    type: "EXPENSE",
    category: "TRANSFER_SELLER",
    paymentMethod: "BCA",
    notes: "Proxy jasa Alipay Kak Cindy (Kurs 2.250)",
    createdById: "owner-1",
    createdByName: "Aurel (Owner)",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "cf-004",
    entryDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString().split("T")[0],
    description: "Penerimaan DP Buyer PO Album Aespa Whiplash (10 pcs)",
    amount: 1500000,
    type: "INCOME",
    category: "PEMBAYARAN_BUYER",
    paymentMethod: "QRIS",
    notes: "Rekap manual transfer QRIS grup Line",
    createdById: "owner-1",
    createdByName: "Aurel (Owner)",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "cf-005",
    entryDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().split("T")[0],
    description: "Pembayaran Billing Pajak Bea Cukai Paket Box Korea KR-088",
    amount: 1240000,
    type: "EXPENSE",
    category: "PAJAK_BEACUKAI",
    paymentMethod: "BCA",
    notes: "No Billing DJBC: 02938172901 - Pos Pasar Baru",
    createdById: "owner-1",
    createdByName: "Aurel (Owner)",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "cf-006",
    entryDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString().split("T")[0],
    description: "Pelunasan Tagihan Tax Buyer Periode Oktober 2026",
    amount: 3420000,
    type: "INCOME",
    category: "PELUNASAN_TAX",
    paymentMethod: "SEABANK",
    notes: "Transfer pelunasan gabungan 8 buyer",
    createdById: "owner-1",
    createdByName: "Aurel (Owner)",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "cf-007",
    entryDate: new Date().toISOString().split("T")[0],
    description: "Fee Admin Nyelem Batch JP-015 (Admin Rara)",
    amount: 280000,
    type: "EXPENSE",
    category: "FEE_ADMIN",
    paymentMethod: "SEABANK",
    notes: "Fee nyelem 140 photocard x 2.000",
    createdById: "owner-1",
    createdByName: "Aurel (Owner)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getStoredEntries(): CashflowEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ENTRIES));
      return INITIAL_MOCK_ENTRIES;
    }
    return JSON.parse(raw) as CashflowEntry[];
  } catch (e) {
    console.warn("Gagal membaca cashflow dari local storage, menggunakan fallback mock", e);
    return INITIAL_MOCK_ENTRIES;
  }
}

function saveStoredEntries(entries: CashflowEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Gagal menyimpan ke local storage", e);
  }
}

/**
 * Mengambil daftar transaksi cashflow dengan filter terapan
 */
export async function getCashflowEntries(
  params?: CashflowFilterParams
): Promise<CashflowEntry[]> {
  // Coba hubungkan ke Backend REST API terlebih dahulu
  try {
    const query = new URLSearchParams();
    if (params?.type && params.type !== "ALL") query.append("type", params.type);
    if (params?.category) query.append("category", params.category);
    if (params?.paymentMethod && params.paymentMethod !== "ALL") query.append("paymentMethod", params.paymentMethod);
    if (params?.search) query.append("search", params.search);
    if (params?.startDate) query.append("startDate", params.startDate);
    if (params?.endDate) query.append("endDate", params.endDate);

    const res = await fetch(`${API_BASE_URL}/api/v1/admin/cashflow?${query.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
    }
  } catch {
    // Backend offline / endpoint belum terpasang di Vercel -> fallback ke local storage
  }

  // Fallback Client-side Filter
  let list = getStoredEntries();

  if (params?.type && params.type !== "ALL") {
    list = list.filter((item) => item.type === params.type);
  }

  if (params?.category) {
    list = list.filter((item) => item.category === params.category);
  }

  if (params?.paymentMethod && params.paymentMethod !== "ALL") {
    list = list.filter((item) => item.paymentMethod === params.paymentMethod);
  }

  if (params?.search) {
    const q = params.search.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.description.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
    );
  }

  if (params?.period) {
    const now = new Date();
    if (params.period === "THIS_MONTH") {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      list = list.filter((item) => {
        const d = new Date(item.entryDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    } else if (params.period === "LAST_30_DAYS") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      list = list.filter((item) => new Date(item.entryDate) >= thirtyDaysAgo);
    } else if (params.period === "LAST_7_DAYS") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter((item) => new Date(item.entryDate) >= sevenDaysAgo);
    }
  }

  // Urutkan transaksi terbaru di atas
  return list.sort(
    (a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()
  );
}

/**
 * Menghitung KPI Statistik Ringkasan Cashflow
 */
export async function getCashflowStats(
  params?: CashflowFilterParams
): Promise<CashflowStats> {
  // Coba request ke Backend
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/cashflow/stats`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.currentBalance === "number") {
        return data;
      }
      if (data?.data && typeof data.data.currentBalance === "number") {
        return data.data;
      }
    }
  } catch {
    // Fallback hitung di client
  }

  const entries = await getCashflowEntries(params);

  let totalIncome = 0;
  let totalExpense = 0;

  for (const item of entries) {
    if (item.type === "INCOME") {
      totalIncome += item.amount;
    } else {
      totalExpense += item.amount;
    }
  }

  return {
    currentBalance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    transactionCount: entries.length,
  };
}

/**
 * Membuat entri transaksi cashflow baru
 */
export async function createCashflowEntry(
  input: CreateCashflowInput
): Promise<CashflowEntry> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/cashflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return data?.data || data;
    }
  } catch {
    // Fallback save to localStorage
  }

  const list = getStoredEntries();
  const newEntry: CashflowEntry = {
    id: `cf-${Date.now()}`,
    entryDate: input.entryDate,
    description: input.description,
    amount: Number(input.amount),
    type: input.type,
    category: input.category,
    paymentMethod: input.paymentMethod,
    notes: input.notes?.trim() || undefined,
    createdById: "owner-1",
    createdByName: "Aurel (Owner)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  list.unshift(newEntry);
  saveStoredEntries(list);
  return newEntry;
}

/**
 * Memperbarui transaksi cashflow
 */
export async function updateCashflowEntry(
  input: UpdateCashflowInput
): Promise<CashflowEntry> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/cashflow/${input.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      return data?.data || data;
    }
  } catch {
    // Fallback update in localStorage
  }

  const list = getStoredEntries();
  const idx = list.findIndex((e) => e.id === input.id);
  if (idx === -1) throw new Error("Transaksi tidak ditemukan");

  const existing = list[idx];
  const updated: CashflowEntry = {
    ...existing,
    entryDate: input.entryDate || existing.entryDate,
    description: input.description || existing.description,
    amount: input.amount !== undefined ? Number(input.amount) : existing.amount,
    type: input.type || existing.type,
    category: input.category || existing.category,
    paymentMethod: input.paymentMethod || existing.paymentMethod,
    notes: input.notes !== undefined ? input.notes : existing.notes,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  saveStoredEntries(list);
  return updated;
}

/**
 * Menghapus transaksi cashflow
 */
export async function deleteCashflowEntry(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/cashflow/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) return true;
  } catch {
    // Fallback delete from localStorage
  }

  const list = getStoredEntries();
  const filtered = list.filter((e) => e.id !== id);
  saveStoredEntries(filtered);
  return true;
}

/**
 * Export data cashflow ke CSV (dapat dibuka langsung di Excel / Google Sheets)
 */
export function exportCashflowToCsv(entries: CashflowEntry[]): void {
  const headers = [
    "ID",
    "Tanggal",
    "Tipe",
    "Kategori",
    "Deskripsi",
    "Nominal (IDR)",
    "Metode Pembayaran",
    "Catatan",
    "Dibuat Oleh",
  ];

  const rows = entries.map((e) => [
    e.id,
    e.entryDate,
    e.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
    `"${(e.category || "").replace(/"/g, '""')}"`,
    `"${(e.description || "").replace(/"/g, '""')}"`,
    e.amount,
    e.paymentMethod,
    `"${(e.notes || "").replace(/"/g, '""')}"`,
    `"${(e.createdByName || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `ceciz-cashflow-${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

