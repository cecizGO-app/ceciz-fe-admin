import React, { useState, useMemo } from "react";
import { Plus, CheckCircle2, XCircle } from "lucide-react";
import {
  TaxStatsCards,
  TaxFilterBar,
  TaxTable,
  TaxPagination,
  TaxDetailModal,
  EditTaxInvoiceModal,
  RejectTaxProofModal,
  WaivePenaltyModal,
  ReleaseTaxWizardModal,
  initialTaxStats,
  initialTaxInvoices,
  type TaxInvoiceItem,
  type TaxStats,
  type TaxSortField,
  type TaxSortConfig,
} from "@/components/tax";

const PAGE_SIZE = 6;

export const TagihanTaxPage: React.FC = () => {
  const [invoices, setInvoices] =
    useState<TaxInvoiceItem[]>(initialTaxInvoices);
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
      // Search query
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

      // Status filter
      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }

      // Period filter (langsung nama bulan saja: "September 2026", "Agustus 2026", dsb)
      if (
        periodFilter !== "ALL" &&
        item.periodMonth !== periodFilter &&
        item.period !== periodFilter
      ) {
        return false;
      }

      // Country filter
      if (
        countryFilter !== "ALL" &&
        !item.batches.some((b) => b.country === countryFilter)
      ) {
        return false;
      }

      return true;
    });
  }, [invoices, searchQuery, statusFilter, periodFilter, countryFilter]);

  // Sort items according to active sortConfig across all columns
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
  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / PAGE_SIZE));
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedInvoices.slice(start, start + PAGE_SIZE);
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

    // Recalculate stats based on updated data
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

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-[16px] text-xs font-semibold shadow-lg flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 border bg-white ${
            toastMessage.type === "success"
              ? "text-emerald-900 border-emerald-200/80 shadow-emerald-500/10"
              : "text-rose-900 border-rose-200/80 shadow-rose-500/10"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Section matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-[#EC4899] tracking-wider uppercase mb-1">
            DASHBOARD &middot; TAGIHAN TAX
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] tracking-tight">
            Tagihan Tax (Bea Cukai)
          </h1>
          <p className="text-xs sm:text-[14px] text-[#71717A] mt-1 leading-relaxed">
            Event penagihan periodik multi-batch untuk barang yang telah tiba di
            warehouse Indonesia.
          </p>
        </div>

        {/* Action Button: Release Wizard Only */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setReleaseWizardOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Release Tagihan Tax Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <TaxStatsCards stats={stats} />

      {/* Filter and Search Bar aligned with PRD (Status, Periode langsung nama bulan, Negara) */}
      <TaxFilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        periodFilter={periodFilter}
        onPeriodFilterChange={(p) => {
          setPeriodFilter(p);
          setCurrentPage(1);
        }}
        countryFilter={countryFilter}
        onCountryFilterChange={(c) => {
          setCountryFilter(c);
          setCurrentPage(1);
        }}
      />

      {/* Invoices Table per buyer with multi-column sorting */}
      <TaxTable
        items={paginatedInvoices}
        onViewDetail={handleOpenDetail}
        onEdit={handleOpenEdit}
        sortConfig={sortConfig}
        onToggleSort={handleToggleSort}
      />

      {/* Pagination Footer */}
      <TaxPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sortedInvoices.length}
        pageSize={PAGE_SIZE}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* Detail Modal with Proof and Items */}
      <TaxDetailModal
        item={selectedItem}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onApprove={handleApprove}
        onOpenReject={handleOpenReject}
        onOpenWaive={handleOpenWaive}
        onOpenEdit={handleOpenEdit}
      />

      {/* Edit Tax Invoice Modal matching wireframe */}
      <EditTaxInvoiceModal
        item={editItem}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveEdit}
      />

      {/* Reject Modal */}
      <RejectTaxProofModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        invoiceNo={rejectItem?.id}
        buyerName={rejectItem?.buyerName}
        onConfirmReject={handleConfirmReject}
      />

      {/* Waive Penalty Modal */}
      <WaivePenaltyModal
        open={waiveModalOpen}
        onOpenChange={setWaiveModalOpen}
        invoiceNo={waiveItem?.id}
        penaltyAmount={waiveItem?.penaltyAmount || 0}
        onConfirmWaive={handleConfirmWaive}
      />

      {/* Release Wizard 3-Step Modal */}
      <ReleaseTaxWizardModal
        open={releaseWizardOpen}
        onOpenChange={setReleaseWizardOpen}
        onSuccessRelease={handleSuccessRelease}
      />
    </div>
  );
};

export default TagihanTaxPage;
