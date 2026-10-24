import React, { useState } from "react";
import { CheckCircle2, XCircle, Plus } from "lucide-react";
import {
  VerificationStatsCards,
  VerificationFilterBar,
  VerificationTable,
  ProofReceiptModal,
  RejectReasonModal,
  AddManualPaymentModal,
} from "@/components/verification";
import { usePaymentVerification, PAGE_SIZE } from "@/hooks";
import type { PaymentItem } from "@/types/verification";

export const PaymentVerificationPage: React.FC = () => {
  const {
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
    handleClearSelection,
    handleApproveSingle,
    handleBulkApprove,
    handleConfirmReject,
    handleAddManualPayment,
  } = usePaymentVerification();

  // Modals state
  const [selectedProofItem, setSelectedProofItem] =
    useState<PaymentItem | null>(null);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [singleRejectItem, setSingleRejectItem] = useState<PaymentItem | null>(
    null,
  );
  const [bulkRejectItems, setBulkRejectItems] = useState<PaymentItem[]>([]);
  const [addManualModalOpen, setAddManualModalOpen] = useState(false);

  const handleViewProof = (item: PaymentItem) => {
    setSelectedProofItem(item);
    setProofModalOpen(true);
  };

  const handleOpenSingleReject = (item: PaymentItem) => {
    setSingleRejectItem(item);
    setBulkRejectItems([]);
    setRejectModalOpen(true);
  };

  const handleOpenBulkReject = () => {
    const selected = items.filter(
      (i) => selectedIds.includes(i.id) && i.status === "PENDING",
    );
    if (selected.length === 0) return;
    setSingleRejectItem(null);
    setBulkRejectItems(selected);
    setRejectModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Feedback */}
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

      {/* Header with Tambah Pembayaran Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-[#EC4899] tracking-wider uppercase mb-1">
            DASHBOARD &middot; VERIFIKASI PEMBAYARAN
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] tracking-tight">
            Verifikasi Pembayaran
          </h1>
          <p className="text-xs sm:text-[14px] text-[#71717A] mt-1 leading-relaxed">
            Tinjau bukti transfer yang diunggah buyer, lakukan verifikasi cepat,
            atau input pembayaran manual.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddManualModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Pembayaran</span>
        </button>
      </div>

      {/* Summary Cards */}
      <VerificationStatsCards stats={stats} />

      {/* Filter Bar */}
      <VerificationFilterBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        methodFilter={methodFilter}
        onMethodFilterChange={(m) => {
          setMethodFilter(m);
          setCurrentPage(1);
        }}
        batchFilter={batchFilter}
        onBatchFilterChange={(b) => {
          setBatchFilter(b);
          setCurrentPage(1);
        }}
        dateFilter={dateFilter}
        onDateFilterChange={(d) => {
          setDateFilter(d);
          setCurrentPage(1);
        }}
        availableBatches={availableBatches}
        selectedCount={selectedIds.length}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleOpenBulkReject}
        onClearSelection={handleClearSelection}
      />

      {/* Verification Table */}
      <VerificationTable
        items={paginatedItems}
        selectedIds={selectedIds}
        onToggleSelectRow={handleToggleSelectRow}
        onToggleSelectAll={handleToggleSelectAll}
        onViewProof={handleViewProof}
        onApproveSingle={handleApproveSingle}
        onRejectSingle={handleOpenSingleReject}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
        totalFilteredCount={filteredItems.length}
        pageSize={PAGE_SIZE}
      />

      {/* Modal: Detail Pembayaran (Matching User Reference) */}
      <ProofReceiptModal
        item={selectedProofItem}
        open={proofModalOpen}
        onOpenChange={setProofModalOpen}
        onApprove={handleApproveSingle}
        onReject={handleOpenSingleReject}
      />

      {/* Modal: Reject Reason */}
      <RejectReasonModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        targetItem={singleRejectItem}
        targetItems={bulkRejectItems}
        onConfirmReject={(reason) =>
          handleConfirmReject(reason, singleRejectItem, bulkRejectItems)
        }
      />

      {/* Modal: Tambah Pembayaran Manual */}
      <AddManualPaymentModal
        open={addManualModalOpen}
        onOpenChange={setAddManualModalOpen}
        availableBatches={availableBatches}
        onAddPayment={handleAddManualPayment}
      />
    </div>
  );
};

export default PaymentVerificationPage;
