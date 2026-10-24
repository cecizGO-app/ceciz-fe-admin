import { useState, useMemo } from "react";
import {
  INITIAL_PAYMENT_ITEMS,
  INITIAL_VERIFICATION_STATS,
} from "@/mocks/mockVerificationData";
import type { PaymentItem, StatusTab, VerificationStats } from "@/types/verification";

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

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  const availableBatches = useMemo(
    () => Array.from(new Set(items.map((i) => i.batchCode))),
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

  const stats: VerificationStats = useMemo(() => {
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
  }, [items, pendingCount]);

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

  const handleApproveSingle = (item: PaymentItem) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: "APPROVED",
              verifiedAt: "Hari ini",
              verifiedBy: "Aurel",
            }
          : i,
      ),
    );
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
    showToast(`Pembayaran ${item.buyerName} disetujui!`, "success");
  };

  const handleBulkApprove = () => {
    const pendingSelected = items.filter(
      (i) => selectedIds.includes(i.id) && i.status === "PENDING",
    );
    if (pendingSelected.length === 0) return;
    const ids = pendingSelected.map((i) => i.id);
    setItems((prev) =>
      prev.map((i) =>
        ids.includes(i.id)
          ? {
              ...i,
              status: "APPROVED",
              verifiedAt: "Hari ini",
              verifiedBy: "Aurel",
            }
          : i,
      ),
    );
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    showToast(
      `${pendingSelected.length} pembayaran disetujui sekaligus!`,
      "success",
    );
  };

  const handleConfirmReject = (
    reason: string,
    singleItem: PaymentItem | null,
    bulkItems: PaymentItem[],
  ) => {
    if (singleItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === singleItem.id
            ? { ...i, status: "REJECTED", rejectReason: reason }
            : i,
        ),
      );
      setSelectedIds((prev) => prev.filter((id) => id !== singleItem.id));
      showToast(`Pembayaran ${singleItem.buyerName} ditolak.`, "error");
    } else if (bulkItems.length > 0) {
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
    }
  };

  const handleAddManualPayment = (newPayment: PaymentItem) => {
    setItems((prev) => [newPayment, ...prev]);
    showToast(
      `Pembayaran manual ${newPayment.buyerName} (Rp ${newPayment.nominal.toLocaleString("id-ID")}) berhasil ditambahkan!`,
      "success",
    );
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
