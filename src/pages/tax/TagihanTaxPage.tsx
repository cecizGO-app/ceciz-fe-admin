import React from "react";
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
} from "@/components/tax";
import { useTaxInvoices } from "@/hooks";

export const TagihanTaxPage: React.FC = () => {
  const {
    stats,
    // Filter
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    periodFilter,
    setPeriodFilter,
    countryFilter,
    setCountryFilter,
    // Sort & Pagination
    sortConfig,
    handleToggleSort,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedInvoices,
    sortedInvoicesCount,
    PAGE_SIZE,
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
  } = useTaxInvoices();

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

      {/* Filter and Search Bar aligned with PRD */}
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
        totalItems={sortedInvoicesCount}
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
