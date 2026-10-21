import React, { useState, useMemo } from "react";
import {
  TaxStatsCards,
  TaxFilterBar,
  TaxTable,
  TaxPagination,
  initialTaxStats,
  initialTaxInvoices,
  type TaxInvoiceItem,
  type TaxStats,
  type TaxSortField,
  type TaxSortConfig,
} from "@/components/tax";

const PAGE_SIZE = 6;

export const TagihanTaxPage: React.FC = () => {
  const [invoices] = useState<TaxInvoiceItem[]>(initialTaxInvoices);
  const [stats] = useState<TaxStats>(initialTaxStats);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [periodFilter, setPeriodFilter] = useState("ALL");
  const [countryFilter, setCountryFilter] = useState("ALL");

  // Multi-column sorting state
  const [sortConfig, setSortConfig] = useState<TaxSortConfig | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

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

  return (
    <div className="space-y-6 pb-12">
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
    </div>
  );
};

export default TagihanTaxPage;
