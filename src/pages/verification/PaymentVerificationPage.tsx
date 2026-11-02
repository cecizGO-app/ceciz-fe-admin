import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  getPaymentByIdApi,
  mapBackendPaymentToFrontend,
} from "@/services/payment.service";
import { useNotificationStore } from "@/stores/useNotificationStore";

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
    isSyncing,
    refetch,
    handleTabChange,
    handleToggleSelectRow,
    handleToggleSelectAll,
    handleClearSelection,
    handleApproveSingle,
    handleBulkApprove,
    handleConfirmReject,
    handleAddManualPayment,
  } = usePaymentVerification();

  // Bersihkan notifikasi saat halaman verifikasi dibuka/dicek
  useEffect(() => {
    useNotificationStore.getState().clearBadge("verifikasi");
  }, []);

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

  const handleViewProof = async (item: PaymentItem) => {
    setSelectedProofItem(item);
    setProofModalOpen(true);

    if (item.id && !item.id.startsWith("mock-") && !item.id.startsWith("pay-manual-")) {
      try {
        const detail = await getPaymentByIdApi(item.id);
        if (detail) {
          setSelectedProofItem(mapBackendPaymentToFrontend(detail));
        }
      } catch (err) {
        console.warn("Backend get payment by ID failed, using cached item:", err);
      }
    }
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
          <nav className="flex items-center gap-1.5 text-xs text-[#71717A] mb-1">
            <span className="text-[#71717A]">Operasional</span>
            <span>&gt;</span>
            <span className="text-[#EC4899] font-medium">
              Verifikasi Pembayaran
            </span>
          </nav>
          <h1 className="text-[24px] sm:text-[30px] font-bold text-[#18181B] tracking-tight">
            Verifikasi Pembayaran
          </h1>
          <p className="text-xs sm:text-[14px] text-[#71717A] mt-1 leading-relaxed">
            Tinjau bukti transfer yang diunggah buyer, lakukan verifikasi cepat,
            atau input pembayaran manual.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={refetch}
            disabled={isSyncing}
            title="Muat ulang data dari server backend"
            className="h-10 sm:h-11 px-3.5 sm:px-4 rounded-[12px] border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#71717A] hover:text-[#EC4899] text-xs font-semibold gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#EC4899] ${isSyncing ? "animate-spin" : ""}`}
            />
            <span>{isSyncing ? "Menyinkronkan..." : "Sinkronkan"}</span>
          </Button>

          <Button
            type="button"
            onClick={() => setAddManualModalOpen(true)}
            className="h-10 sm:h-11 px-4 sm:px-5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Pembayaran</span>
          </Button>
        </div>
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
