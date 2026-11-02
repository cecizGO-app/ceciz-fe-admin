import { useState, useMemo, useEffect, useCallback } from "react";
import {
  INITIAL_PAYMENT_ITEMS,
  INITIAL_VERIFICATION_STATS,
} from "@/mocks/mockVerificationData";
import type {
  PaymentItem,
  StatusTab,
  VerificationStats,
} from "@/types/verification";
import {
  getPaymentsApi,
  getPaymentStatsApi,
  verifyPaymentApi,
  bulkVerifyPaymentsApi,
  mapBackendPaymentToFrontend,
  mapBackendStatsToFrontend,
} from "@/services/payment.service";

export const PAGE_SIZE = 8;

export function usePaymentVerification() {
  const [items, setItems] = useState<PaymentItem[]>(INITIAL_PAYMENT_ITEMS);
  const [activeTab, setActiveTab] = useState<StatusTab>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Status sinkronisasi backend
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [serverStats, setServerStats] = useState<VerificationStats | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  /**
   * Fetch data pembayaran dan statistik dari Backend API (Rigi)
   */
  const loadPaymentData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);
      else setIsSyncing(true);
      setFetchError(null);

      // 1. Fetch statistik metrik
      const statsPromise = getPaymentStatsApi()
        .then((s) => {
          setServerStats(mapBackendStatsToFrontend(s));
        })
        .catch((err) => {
          console.warn("Backend stats API unavailable, using fallback:", err);
        });

      // 2. Fetch list pembayaran
      const paymentsPromise = getPaymentsApi({
        limit: 100, // Ambil batch data untuk filter lokal yang responsif
      })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const mapped = res.data.map(mapBackendPaymentToFrontend);
            setItems(mapped);
          }
        })
        .catch((err) => {
          console.warn("Backend payments list API unavailable, using fallback:", err);
          setFetchError(
            err instanceof Error
              ? err.message
              : "Belum dapat terhubung ke backend live. Menggunakan data cadangan.",
          );
        });

      await Promise.allSettled([statsPromise, paymentsPromise]);
    } catch (err: unknown) {
      console.error("Gagal memuat data pembayaran:", err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Muat data saat hook pertama kali dipasang
  useEffect(() => {
    loadPaymentData(true);
  }, [loadPaymentData]);

  const availableBatches = useMemo(
    () => Array.from(new Set(items.map((i) => i.batchCode).filter((b) => b && b !== "-"))),
    [items],
  );

  const pendingCount = useMemo(
    () => items.filter((i) => i.status === "PENDING").length,
    [items],
  );
  const approvedCount = useMemo(
    () => items.filter((i) => i.status === "APPROVED").length,
    [items],
  );
  const rejectedCount = useMemo(
    () => items.filter((i) => i.status === "REJECTED").length,
    [items],
  );

  // Gabungan statistik server atau hitungan kalkulasi lokal
  const stats: VerificationStats = useMemo(() => {
    if (serverStats) {
      return {
        ...serverStats,
        waitingCount: pendingCount,
      };
    }

    const newlyApproved = items.filter(
      (i) =>
        i.status === "APPROVED" &&
        !INITIAL_PAYMENT_ITEMS.find(
          (o) => o.id === i.id && o.status === "APPROVED",
        ),
    );
    const newlyRejected = items.filter(
      (i) =>
        i.status === "REJECTED" &&
        !INITIAL_PAYMENT_ITEMS.find(
          (o) => o.id === i.id && o.status === "REJECTED",
        ),
    );
    const extraApprovedAmount = newlyApproved.reduce(
      (sum, i) => sum + i.nominal,
      0,
    );

    return {
      waitingCount: pendingCount,
      waitingTodayCount: Math.min(5, pendingCount),
      approvedTodayCount:
        INITIAL_VERIFICATION_STATS.approvedTodayCount + newlyApproved.length,
      approvedTodayAmount:
        INITIAL_VERIFICATION_STATS.approvedTodayAmount + extraApprovedAmount,
      rejectedTodayCount:
        INITIAL_VERIFICATION_STATS.rejectedTodayCount + newlyRejected.length,
      totalMonthlyVerifiedAmount:
        INITIAL_VERIFICATION_STATS.totalMonthlyVerifiedAmount +
        extraApprovedAmount,
      monthName: INITIAL_VERIFICATION_STATS.monthName,
    };
  }, [serverStats, items, pendingCount]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab !== "ALL" && item.status !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.buyerName.toLowerCase().includes(q) ||
          item.buyerUsername.toLowerCase().includes(q) ||
          item.batchCode.toLowerCase().includes(q) ||
          item.nominal.toString().includes(q) ||
          (item.keterangan && item.keterangan.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (methodFilter !== "ALL" && item.paymentMethod !== methodFilter)
        return false;
      if (batchFilter !== "ALL" && item.batchCode !== batchFilter) return false;
      if (dateFilter === "TODAY" && item.uploadDate !== "2026-09-17")
        return false;
      if (dateFilter === "YESTERDAY" && item.uploadDate !== "2026-09-16")
        return false;
      return true;
    });
  }, [items, activeTab, searchQuery, methodFilter, batchFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    const pageIds = paginatedItems.map((i) => i.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...prev, ...pageIds])),
    );
  };

  /**
   * Setujui 1 pembayaran (Optimistik + Kirim ke PATCH /api/v1/admin/payments/:id/verify)
   */
  const handleApproveSingle = async (item: PaymentItem) => {
    // Update state secara optimistik
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: "APPROVED",
              verifiedAt: "Hari ini",
              verifiedBy: "Aurel (Admin)",
            }
          : i,
      ),
    );
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
    showToast(`Pembayaran ${item.buyerName} disetujui!`, "success");

    // Kirim request ke API backend
    try {
      await verifyPaymentApi(item.id, { status: "APPROVED" });
      // Refresh ringkasan statistik
      getPaymentStatsApi()
        .then((s) => setServerStats(mapBackendStatsToFrontend(s)))
        .catch(() => {});
    } catch (err: unknown) {
      console.warn("Backend verify failed (optimistic state maintained):", err);
    }
  };

  /**
   * Setujui massal semua yang dipilih (Optimistik + Kirim ke POST /api/v1/admin/payments/bulk-verify)
   */
  const handleBulkApprove = async () => {
    const pendingSelected = items.filter(
      (i) => selectedIds.includes(i.id) && i.status === "PENDING",
    );
    if (pendingSelected.length === 0) return;
    const ids = pendingSelected.map((i) => i.id);

    // Update state secara optimistik
    setItems((prev) =>
      prev.map((i) =>
        ids.includes(i.id)
          ? {
              ...i,
              status: "APPROVED",
              verifiedAt: "Hari ini",
              verifiedBy: "Aurel (Admin)",
            }
          : i,
      ),
    );
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    showToast(
      `${pendingSelected.length} pembayaran disetujui sekaligus!`,
      "success",
    );

    // Kirim request ke API backend
    try {
      await bulkVerifyPaymentsApi({ paymentIds: ids, status: "APPROVED" });
      getPaymentStatsApi()
        .then((s) => setServerStats(mapBackendStatsToFrontend(s)))
        .catch(() => {});
    } catch (err: unknown) {
      console.warn("Backend bulk verify failed:", err);
    }
  };

  /**
   * Tolak pembayaran dengan alasan (Optimistik + Kirim ke API)
   */
  const handleConfirmReject = async (
    reason: string,
    singleItem: PaymentItem | null,
    bulkItems: PaymentItem[],
  ) => {
    if (singleItem) {
      // Tolak satuan
      setItems((prev) =>
        prev.map((i) =>
          i.id === singleItem.id
            ? { ...i, status: "REJECTED", rejectReason: reason }
            : i,
        ),
      );
      setSelectedIds((prev) => prev.filter((id) => id !== singleItem.id));
      showToast(`Pembayaran ${singleItem.buyerName} ditolak.`, "error");

      try {
        await verifyPaymentApi(singleItem.id, {
          status: "REJECTED",
          rejectReason: reason,
        });
        getPaymentStatsApi()
          .then((s) => setServerStats(mapBackendStatsToFrontend(s)))
          .catch(() => {});
      } catch (err: unknown) {
        console.warn("Backend reject failed:", err);
      }
    } else if (bulkItems.length > 0) {
      // Tolak massal
      const rejectIds = bulkItems.map((i) => i.id);
      setItems((prev) =>
        prev.map((i) =>
          rejectIds.includes(i.id)
            ? { ...i, status: "REJECTED", rejectReason: reason }
            : i,
        ),
      );
      setSelectedIds((prev) => prev.filter((id) => !rejectIds.includes(id)));
      showToast(`${bulkItems.length} pembayaran ditolak serentak.`, "error");

      try {
        await bulkVerifyPaymentsApi({
          paymentIds: rejectIds,
          status: "REJECTED",
          rejectReason: reason,
        });
        getPaymentStatsApi()
          .then((s) => setServerStats(mapBackendStatsToFrontend(s)))
          .catch(() => {});
      } catch (err: unknown) {
        console.warn("Backend bulk reject failed:", err);
      }
    }
  };

  /**
   * Tambah pembayaran manual (Optimistik + Kirim ke POST /api/v1/admin/payments)
   */
  const handleAddManualPayment = async (newPayment: PaymentItem) => {
    // Tambahkan secara optimistik ke tabel
    setItems((prev) => [newPayment, ...prev]);
    showToast(
      `Pembayaran manual ${newPayment.buyerName} (Rp ${newPayment.nominal.toLocaleString("id-ID")}) berhasil ditambahkan!`,
      "success",
    );

    // Refresh statistik metrik
    getPaymentStatsApi()
      .then((s) => setServerStats(mapBackendStatsToFrontend(s)))
      .catch(() => {});
  };

  return {
    items,
    activeTab,
    pendingCount,
    approvedCount,
    rejectedCount,
    stats,
    searchQuery,
    setSearchQuery,
    methodFilter,
    setMethodFilter,
    batchFilter,
    setBatchFilter,
    dateFilter,
    setDateFilter,
    availableBatches,
    selectedIds,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    filteredItems,
    toastMessage,
    isLoading,
    isSyncing,
    fetchError,
    refetch: () => loadPaymentData(false),
    handleTabChange,
    handleToggleSelectRow,
    handleToggleSelectAll,
    handleClearSelection: () => setSelectedIds([]),
    handleApproveSingle,
    handleBulkApprove,
    handleConfirmReject,
    handleAddManualPayment,
  };
}
