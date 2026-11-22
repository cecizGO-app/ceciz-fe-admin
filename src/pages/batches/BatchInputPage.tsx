import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Bookmark,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BatchInfoForm,
  BatchCalculationSummary,
  BuyerOrderTable,
  BatchStepbar,
  BatchTextModal,
  COUNTRIES,
  WIZARD_STEPS,
} from "@/components/batch";
import { useBatchForm } from "@/hooks";
import {
  createBatchApi,
  getBatchByIdApi,
  patchBatchApi,
  type BackendCreateBatchInput,
} from "@/services/batch.service";

interface BatchInputPageProps {
  onBackToList?: () => void;
}

export const BatchInputPage: React.FC<BatchInputPageProps> = ({
  onBackToList,
}) => {
  const { batchId } = useParams<{ batchId?: string }>();
  const isEditMode = Boolean(batchId);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);

  const form = useBatchForm();

  // Muat data batch existing jika dalam mode Edit (/batches/:batchId/edit)
  useEffect(() => {
    if (!batchId) return;
    let active = true;
    getBatchByIdApi(batchId)
      .then((existing) => {
        if (active && existing) {
          form.loadFromBackendBatch(existing);
        }
      })
      .catch((err) => {
        if (active) {
          setErrorMessage(
            err instanceof Error ? err.message : "Gagal memuat data batch untuk diedit.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [batchId]);

  const [draftAvailable, setDraftAvailable] = useState(
    () => !isEditMode && form.hasSavedDraft,
  );

  const handleSaveDraft = () => {
    const ok = form.saveDraftToLocal();
    if (ok) {
      setDraftAvailable(true);
      setSuccessMessage(`Draft batch ${form.batchCode} berhasil disimpan di browser.`);
    }
  };

  const handleRestoreDraft = () => {
    if (form.restoreDraftFromLocal()) {
      setDraftAvailable(false);
      setSuccessMessage("Draft batch tersimpan berhasil dimuat kembali.");
    }
  };

  const handleDiscardDraft = () => {
    form.clearDraftFromLocal();
    setDraftAvailable(false);
  };

  const handlePublish = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validasi field wajib sesuai schema Backend
    const trimmedTitle = form.batchName.trim();
    if (!trimmedTitle) {
      setErrorMessage("Judul/Nama batch wajib diisi!");
      goToStep(1);
      return;
    }
    if (trimmedTitle.length > 50) {
      setErrorMessage("Judul batch maksimal 50 karakter!");
      goToStep(1);
      return;
    }
    if (!form.batchNumber || form.batchNumber < 1) {
      setErrorMessage(
        "Nomor batch harus berupa angka bulat positif (minimal 1)!",
      );
      goToStep(1);
      return;
    }
    if (!form.batchDate) {
      setErrorMessage("Tanggal batch wajib dipilih!");
      goToStep(1);
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: BackendCreateBatchInput = {
        countryCode: form.selectedCountry,
        batchNumber: Number(form.batchNumber),
        batchDate: form.batchDate,
        title: trimmedTitle,
        description: form.catatan
          ? form.catatan.trim().slice(0, 250)
          : undefined,
        shippingFee: Number(form.shippingWHForeign) || 0,
        feeGo: Number(form.feeGO) || 0,
        feeRekap: Number(form.summary.feeRekap) || 0,
        feeNyelem: Number(form.feeNyelem) || 0,
        rateHarian:
          form.selectedCountry === "INA"
            ? undefined
            : Number(form.kursRate) || undefined,
        rateSeller:
          form.selectedCountry === "INA"
            ? undefined
            : Number(form.rateSeller) || undefined,
        feeWh: Number(form.feeWarehouse) || 0,
        feeProxy: Number(form.feeProxy) || 0,
        adminNyelemId: form.admins.some((a) => a.id === form.adminNyelem)
          ? form.adminNyelem
          : undefined,
        proxyCoName: form.jasaProxy ? form.jasaProxy.trim() : undefined,
        items: form.computedRows.map((r) => {
          const matchedBuyer = form.buyers.find((b) => b.id === r.buyerId);
          return {
            buyerId: r.buyerId,
            buyerName: matchedBuyer?.name || undefined,
            description: r.itemName || "Item",
            hargaAsli: Number(r.hargaAsli) || 0,
            pcs: 1, // Pcs konstan 1
            feeNyelem: form.selectedCountry === "JP" ? 0 : form.feeNyelem,
            hargaPerBuyer: r.hargaBersih || undefined,
            hargaJualPerBuyer:
              form.selectedCountry === "JP"
                ? Number(r.hargaJualPerBuyer) || 0
                : undefined,
          };
        }),
      };

      const savedBatch =
        isEditMode && batchId
          ? await patchBatchApi(batchId, payload)
          : await createBatchApi(payload);

      setSuccessMessage(
        isEditMode
          ? `Perubahan batch ${savedBatch.countryCode}-${String(savedBatch.batchNumber).padStart(3, "0")} (${savedBatch.title}) berhasil diperbarui di backend!`
          : `Batch ${savedBatch.countryCode}-${String(savedBatch.batchNumber).padStart(3, "0")} (${savedBatch.title}) berhasil disimpan ke backend! Format teks siap-share telah dibuat.`,
      );

      // Auto-trigger Text Modal as requested by Ciul
      setIsTextModalOpen(true);
    } catch (err: unknown) {
      console.error("Gagal menerbitkan batch:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan batch ke backend.";
      setErrorMessage(msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Shared Section Nodes (eliminates duplicate JSX between Mobile and Desktop views)
  const infoFormSection = (
    <BatchInfoForm
      countries={COUNTRIES}
      selectedCountry={form.selectedCountry}
      onSelectCountry={form.handleCountryChange}
      batchName={form.batchName}
      onChangeBatchName={form.setBatchName}
      batchNumber={form.batchNumber}
      onChangeBatchNumber={form.setBatchNumber}
      batchCode={form.batchCode}
      batchDate={form.batchDate}
      onChangeBatchDate={form.setBatchDate}
      kursRate={form.kursRate}
      onChangeKursRate={form.setKursRate}
      rateSeller={form.rateSeller}
      onChangeRateSeller={form.setRateSeller}
      shippingForeign={form.shippingWHForeign}
      onChangeShippingForeign={form.setShippingWHForeign}
      currentCurrency={form.currentCountry.currency}
      warehouse={form.warehouseTujuan}
      onChangeWarehouse={form.setWarehouseTujuan}
      feeWarehouse={form.feeWarehouse}
      onChangeFeeWarehouse={form.setFeeWarehouse}
      jasaProxy={form.jasaProxy}
      onChangeJasaProxy={form.setJasaProxy}
      feeProxy={form.feeProxy}
      onChangeFeeProxy={form.setFeeProxy}
      adminNyelem={form.adminNyelem}
      onChangeAdminNyelem={form.setAdminNyelem}
      adminOptions={form.admins}
      feeNyelem={form.feeNyelem}
      onChangeFeeNyelem={form.setFeeNyelem}
      feeGO={form.feeGO}
      onChangeFeeGO={form.setFeeGO}
      hargaCOShopeeSeller={form.hargaCOShopeeSeller}
      onChangeHargaCOShopeeSeller={form.setHargaCOShopeeSeller}
      feeKeseluruhan={form.summary.feeKeseluruhan}
      feeRekap={form.summary.feeRekap}
      tierLabel={form.summary.tierLabel}
      catatan={form.catatan}
      onChangeCatatan={form.setCatatan}
    />
  );

  const orderTableSection = (
    <BuyerOrderTable
      orderRows={form.computedRows}
      registeredBuyers={form.buyers}
      countryCode={form.selectedCountry}
      currency={form.currentCountry.currency}
      kursRate={form.kursRate}
      overheadPerPc={form.overheadPerPc}
      feeNyelemBatch={form.feeNyelem}
      onAddRow={form.handleAddRow}
      onSetRowCount={form.handleSetRowCount}
      onRemoveRow={form.handleRemoveRow}
      onUpdateRow={form.handleUpdateRow}
    />
  );

  const summarySection = (
    <BatchCalculationSummary
      summary={form.summary}
      currency={form.currentCountry.currency}
      kursRate={form.kursRate}
      shippingForeign={form.shippingWHForeign}
      onPublish={handlePublish}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <div className="space-y-5 pb-28 lg:pb-6">
      {/* Breadcrumb & Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-[#71717A] mb-1">
            <span className="text-[#71717A]">Operasional</span>
            <span>&gt;</span>
            <span
              onClick={onBackToList}
              className="hover:text-[#EC4899] cursor-pointer transition-colors"
            >
              Batch &amp; Harga
            </span>
            <span>&gt;</span>
            <span className="text-[#EC4899] font-medium">
              {isEditMode ? `Edit Batch ${form.batchCode}` : "Tambah Batch Baru"}
            </span>
          </nav>
          <h1 className="text-[24px] sm:text-[30px] font-bold text-[#18181B] tracking-tight">
            {isEditMode ? `Edit Batch ${form.batchCode}` : "Tambah Batch Baru"}
          </h1>
          <p className="text-xs sm:text-[14px] text-[#71717A] mt-1 leading-relaxed">
            Input pesanan group order dan kalkulasi harga real-time
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsTextModalOpen(true)}
            className="h-11 px-4 text-xs font-semibold gap-2 border-[#FBCFE8] text-[#EC4899] bg-[#FFF5FA] hover:bg-[#FCE7F3] cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#EC4899]" />
            <span>Format Teks Share</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            className="h-11 px-4 text-xs font-semibold gap-2 border-[#FBCFE8] cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-[#71717A]" />
            <span>Simpan Draft</span>
          </Button>
        </div>
      </div>

      {/* Saved Draft Restore Banner (Create Mode Only) */}
      {!isEditMode && draftAvailable && (
        <div className="px-4 py-3 rounded-[12px] bg-[#FFF5FA] border border-[#FBCFE8] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[#18181B]">
            <strong>Draft tersimpan ditemukan.</strong> Ingin melanjutkan pengisian draft batch terakhir?
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              onClick={handleRestoreDraft}
              className="h-8 px-3 rounded-[9px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold cursor-pointer"
            >
              Muat Draft
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleDiscardDraft}
              className="h-8 px-3 rounded-[9px] border-[#FBCFE8] text-xs text-[#71717A] cursor-pointer"
            >
              Abaikan
            </Button>
          </div>
        </div>
      )}

      {/* Alert Error / Success */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 shadow-2xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Gagal Menyimpan Batch:</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">Berhasil:</span>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Stepbar (Active on mobile to prevent vertical content overload) */}
      <div className="lg:hidden">
        <BatchStepbar
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onSelectStep={goToStep}
        />
      </div>

      {/* 1. Mobile Wizard View (< lg: Renders active step only) */}
      <div className="block lg:hidden">
        {currentStep === 1 && (
          <div className="animate-in fade-in-50 duration-200">
            {infoFormSection}
          </div>
        )}
        {currentStep === 2 && (
          <div className="animate-in fade-in-50 duration-200">
            {orderTableSection}
          </div>
        )}
        {currentStep === 3 && (
          <div className="animate-in fade-in-50 duration-200">
            {summarySection}
          </div>
        )}

        {/* Mobile Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#FBCFE8] shadow-lg flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => goToStep(currentStep - 1)}
              className="h-11 px-4 text-xs font-semibold text-[#71717A] gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="h-11 px-3.5 text-xs font-semibold text-[#71717A] gap-1.5 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Draft</span>
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={() => goToStep(currentStep + 1)}
              className="h-11 px-4 sm:px-5 text-xs font-semibold gap-2 ml-auto"
            >
              <span>
                {currentStep === 1
                  ? "Lanjut: Pesanan Buyer"
                  : "Lanjut: Ringkasan"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handlePublish}
              className="h-11 px-5 sm:px-6 text-xs font-semibold gap-2 ml-auto"
            >
              <span>Terbitkan &amp; Simpan</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Desktop View (lg+: Full side-by-side overview) */}
      <div className="hidden lg:block space-y-6">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-8">{infoFormSection}</div>
          <div className="col-span-4">{summarySection}</div>
        </div>
        {orderTableSection}
      </div>

      {/* Share Text Modal (Auto-triggers on save or manual click) */}
      <BatchTextModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        batchCode={form.batchCode}
        batchName={form.batchName}
        countryName={form.currentCountry.name}
        countryCode={form.selectedCountry}
        currency={form.currentCountry.currency}
        batchDate={form.batchDate}
        warehouse={form.warehouseTujuan}
        proxy={form.jasaProxy}
        totalQty={form.summary.totalQty}
        totalTagihan={form.summary.totalTagihanBuyer}
        catatan={form.catatan}
        items={form.computedRows.map((r) => {
          const buyer = form.buyers.find((b) => b.id === r.buyerId);
          return {
            buyerName: buyer?.name || r.buyerId,
            buyerUsername: buyer?.username,
            itemName: r.itemName,
            qty: 1,
            hargaBersih:
              form.selectedCountry === "JP"
                ? Number(r.hargaJualPerBuyer || r.hargaBersih || 0)
                : Number(r.hargaBersih || 0),
          };
        })}
        onBackToList={onBackToList}
      />
    </div>
  );
};

export default BatchInputPage;
