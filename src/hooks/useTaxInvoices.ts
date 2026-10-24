import { useState, useMemo } from "react";
import { initialTaxStats, initialTaxInvoices } from "@/mocks/mockTaxData";
import type {
  TaxInvoiceItem,
  TaxStats,
  TaxSortField,
  TaxSortConfig,
} from "@/types/tax";

export const TAX_PAGE_SIZE = 6;

export function useTaxInvoices() {
  const [invoices, setInvoices] = useState<TaxInvoiceItem[]>(initialTaxInvoices);
  const [stats, setStats] = useState<TaxStats>(initialTaxStats);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [periodFilter, setPeriodFilter] = useState("ALL");
  const [countryFilter, setCountryFilter] = useState("ALL");

  // Multi-column sorting state
  const [sortConfig, setSortConfig] = useState<TaxSortConfig | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [selectedItem, setSelectedItem] = useState<TaxInvoiceItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TaxInvoiceItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectItem, setRejectItem] = useState<TaxInvoiceItem | null>(null);
  const [waiveModalOpen, setWaiveModalOpen] = useState(false);
  const [waiveItem, setWaiveItem] = useState<TaxInvoiceItem | null>(null);
  const [releaseWizardOpen, setReleaseWizardOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filter items
  const filteredInvoices = useMemo(() => {
    return invoices.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(q);
        const matchName = item.buyerName.toLowerCase().includes(q);
        const matchHandle = item.buyerHandle.toLowerCase().includes(q);
        const matchBatch = item.batches.some(
          (b) =>
            b.batchCode.toLowerCase().includes(q) ||
            b.itemName.toLowerCase().includes(q),
        );
        if (!matchId && !matchName && !matchHandle && !matchBatch) {
          return false;
        }
      }

      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }

      if (
        periodFilter !== "ALL" &&
        item.periodMonth !== periodFilter &&
        item.period !== periodFilter
      ) {
        return false;
      }

      if (
        countryFilter !== "ALL" &&
        !item.batches.some((b) => b.country === countryFilter)
      ) {
        return false;
      }

      return true;
    });
  }, [invoices, searchQuery, statusFilter, periodFilter, countryFilter]);

  // Sort items
  const sortedInvoices = useMemo(() => {
    if (!sortConfig) {
      return filteredInvoices;
    }

    const { field, order } = sortConfig;
    const multiplier = order === "asc" ? 1 : -1;

    return [...filteredInvoices].sort((a, b) => {
      switch (field) {
        case "buyer": {
          return multiplier * a.buyerName.localeCompare(b.buyerName, "id-ID");
        }
        case "batch": {
          const aCount = a.batches.length;
          const bCount = b.batches.length;
          if (aCount !== bCount) return multiplier * (aCount - bCount);
          return (
            multiplier *
            (a.batches[0]?.batchCode || "").localeCompare(
              b.batches[0]?.batchCode || "",
            )
          );
        }
        case "items": {
          const aQty =
            a.totalItemsCount || a.batches.reduce((sum, b) => sum + b.qty, 0);
          const bQty =
            b.totalItemsCount || b.batches.reduce((sum, b) => sum + b.qty, 0);
          return multiplier * (aQty - bQty);
        }
        case "amount": {
          return multiplier * (a.totalAmount - b.totalAmount);
        }
        case "deadline": {
          const timeA = new Date(a.rawDeadline).getTime() || 0;
          const timeB = new Date(b.rawDeadline).getTime() || 0;
          return multiplier * (timeA - timeB);
        }
        case "status": {
          const statusRank: Record<string, number> = {
            Pending: 1,
            Unpaid: 2,
            Overdue: 3,
            Approved: 4,
          };
          const rankA = statusRank[a.status] || 99;
          const rankB = statusRank[b.status] || 99;
          return multiplier * (rankA - rankB);
        }
        default:
          return 0;
      }
    });
  }, [filteredInvoices, sortConfig]);

  // Paginated items
  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / TAX_PAGE_SIZE));
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * TAX_PAGE_SIZE;
    return sortedInvoices.slice(start, start + TAX_PAGE_SIZE);
  }, [sortedInvoices, currentPage]);

  // Handlers for sorting & modal interactions
  const handleToggleSort = (field: TaxSortField) => {
    setSortConfig((prev) => {
      if (!prev || prev.field !== field) {
        return { field, order: "asc" };
      }
      if (prev.order === "asc") {
        return { field, order: "desc" };
      }
      return null;
    });
  };

  const handleOpenDetail = (item: TaxInvoiceItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleOpenEdit = (item: TaxInvoiceItem) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedItem: TaxInvoiceItem) => {
    const updatedList = invoices.map((i) =>
      i.id === updatedItem.id ? updatedItem : i,
    );
    setInvoices(updatedList);

    const unpaid = updatedList.filter(
      (i) => i.status === "Unpaid" || i.status === "Overdue",
    );
    const pending = updatedList.filter((i) => i.status === "Pending");
    const approved = updatedList.filter((i) => i.status === "Approved");

    setStats((prev) => ({
      ...prev,
      unpaidCount: unpaid.length,
      unpaidAmount: unpaid.reduce((sum, i) => sum + i.totalAmount, 0),
      pendingCount: pending.length,
      paidAmount: approved.reduce((sum, i) => sum + i.totalAmount, 0),
    }));

    if (selectedItem?.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }

    showToast(
      "success",
      `Tagihan invoice ${updatedItem.id} (${updatedItem.buyerName}) berhasil diperbarui!`,
    );
  };

  const handleApprove = (target: TaxInvoiceItem) => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === target.id
          ? {
              ...i,
              status: "Approved",
              proofStatus: "verified_bca",
              bankName: i.bankName || "BCA",
            }
          : i,
      ),
    );

    setStats((prev) => ({
      ...prev,
      pendingCount: Math.max(0, prev.pendingCount - 1),
      paidAmount: prev.paidAmount + target.totalAmount,
    }));

    if (selectedItem?.id === target.id) {
      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              status: "Approved",
              proofStatus: "verified_bca",
              bankName: prev.bankName || "BCA",
            }
          : null,
      );
    }

    showToast(
      "success",
      `Pembayaran invoice ${target.id} (${target.buyerName}) berhasil disetujui!`,
    );
  };

  const handleOpenReject = (target: TaxInvoiceItem) => {
    setRejectItem(target);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (reason: string) => {
    if (!rejectItem) return;

    setInvoices((prev) =>
      prev.map((i) =>
        i.id === rejectItem.id
          ? {
              ...i,
              status: "Unpaid",
              hasProof: false,
              proofStatus: "none",
              notes: `Bukti ditolak: ${reason}`,
            }
          : i,
      ),
    );

    setStats((prev) => ({
      ...prev,
      pendingCount: Math.max(0, prev.pendingCount - 1),
    }));

    if (selectedItem?.id === rejectItem.id) {
      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              status: "Unpaid",
              hasProof: false,
              proofStatus: "none",
              notes: `Bukti ditolak: ${reason}`,
            }
          : null,
      );
    }

    showToast(
      "error",
      `Bukti transfer ${rejectItem.id} ditolak. Status dikembalikan ke Unpaid.`,
    );
  };

  const handleOpenWaive = (target: TaxInvoiceItem) => {
    setWaiveItem(target);
    setWaiveModalOpen(true);
  };

  const handleConfirmWaive = (reason: string) => {
    if (!waiveItem) return;

    setInvoices((prev) =>
      prev.map((i) =>
        i.id === waiveItem.id
          ? {
              ...i,
              penaltyWaived: true,
              penaltyWaiveReason: reason,
            }
          : i,
      ),
    );

    if (selectedItem?.id === waiveItem.id) {
      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              penaltyWaived: true,
              penaltyWaiveReason: reason,
            }
          : null,
      );
    }

    showToast(
      "success",
      `Denda keterlambatan pada ${waiveItem.id} berhasil di-waive (${reason}).`,
    );
  };

  const handleSuccessRelease = (
    newInvoices: TaxInvoiceItem[],
    periodName: string,
  ) => {
    setInvoices((prev) => [...newInvoices, ...prev]);
    setStats((prev) => ({
      ...prev,
      activePeriodName: periodName,
      unpaidCount: prev.unpaidCount + newInvoices.length,
      unpaidAmount:
        prev.unpaidAmount +
        newInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0),
    }));

    showToast(
      "success",
      `Berhasil merilis ${newInvoices.length} invoice tax baru untuk ${periodName}!`,
    );
  };

  return {
    invoices,
    stats,
    // Filter states & setters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    periodFilter,
    setPeriodFilter,
    countryFilter,
    setCountryFilter,
    // Sorting
    sortConfig,
    handleToggleSort,
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedInvoices,
    sortedInvoicesCount: sortedInvoices.length,
    PAGE_SIZE: TAX_PAGE_SIZE,
    // Modals
    selectedItem,
    detailModalOpen,
    setDetailModalOpen,
    handleOpenDetail,
    editItem,
    editModalOpen,
    setEditModalOpen,
    handleOpenEdit,
    handleSaveEdit,
    rejectItem,
    rejectModalOpen,
    setRejectModalOpen,
    handleOpenReject,
    handleConfirmReject,
    waiveItem,
    waiveModalOpen,
    setWaiveModalOpen,
    handleOpenWaive,
    handleConfirmWaive,
    releaseWizardOpen,
    setReleaseWizardOpen,
    handleSuccessRelease,
    // Actions
    handleApprove,
    // Toast
    toastMessage,
  };
}
