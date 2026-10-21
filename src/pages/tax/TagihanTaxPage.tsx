import React, { useState, useMemo } from "react";
import { Plus, CheckCircle2, XCircle } from "lucide-react";
import {
  TaxStatsCards,
  TaxFilterBar,
  TaxTable,
  TaxPagination,
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

  // Wizard modal state
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

      // Period filter (Month name)
      if (periodFilter !== "ALL" && item.periodMonth !== periodFilter) {
        return false;
      }

      // Country filter
      if (countryFilter !== "ALL") {
        const hasCountry = item.batches.some(
          (b) => b.country === countryFilter,
        );
        if (!hasCountry) return false;
      }

      return true;
    });
  }, [invoices, searchQuery, statusFilter, periodFilter, countryFilter]);

  // Sorted items with multi-column sorting
  const sortedInvoices = useMemo(() => {
    if (!sortConfig) return filteredInvoices;

    const { field, order } = sortConfig;
    const multiplier = order === "asc" ? 1 : -1;

    return [...filteredInvoices].sort((a, b) => {
      switch (field) {
        case "buyer": {
          return multiplier * a.buyerName.localeCompare(b.buyerName);
        }
        case "batch": {
          const aBatch = a.batches[0]?.batchCode || "";
          const bBatch = b.batches[0]?.batchCode || "";
          return multiplier * aBatch.localeCompare(bBatch);
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

  // Handlers for sorting
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

  const handleSuccessRelease = (
    newInvoices: TaxInvoiceItem[],
    periodName: string,
  ) => {
    setInvoices((prev) => [...newInvoices, ...prev]);

    const addedAmount = newInvoices.reduce(
      (sum, item) => sum + item.totalAmount,
      0,
    );

    setStats((prev) => ({
      ...prev,
      unpaidCount: prev.unpaidCount + newInvoices.length,
      unpaidAmount: prev.unpaidAmount + addedAmount,
      activePeriodMonth: periodName,
    }));

    showToast(
      "success",
      `Berhasil merilis ${newInvoices.length} tagihan tax baru untuk periode ${periodName}!`,
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

      {/* Header Section */}
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

        {/* Action Button: Release Wizard */}
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

      {/* Filter and Search Bar (Status, Periode langsung nama bulan, Negara) */}
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
        onViewDetail={() => {}}
        onEdit={() => {}}
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
