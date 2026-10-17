import React, { useState } from "react";
import { Bookmark, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BatchInfoForm,
  BatchCalculationSummary,
  BuyerOrderTable,
  BatchStepbar,
  useBatchForm,
  COUNTRIES,
  REGISTERED_BUYERS,
  WIZARD_STEPS,
} from "@/components/batch/input";

interface BatchInputPageProps {
  onBackToList?: () => void;
}

export const BatchInputPage: React.FC<BatchInputPageProps> = ({
  onBackToList,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const form = useBatchForm();

  const handlePublish = () => {
    alert(
      `Batch "${form.batchName}" (${form.batchCode}) berhasil diterbitkan!`,
    );
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
      batchCode={form.batchCode}
      batchDate={form.batchDate}
      onChangeBatchDate={form.setBatchDate}
      kursRate={form.kursRate}
      onChangeKursRate={form.setKursRate}
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
      feeNyelem={form.feeNyelem}
      onChangeFeeNyelem={form.setFeeNyelem}
      feeGO={form.feeGO}
      onChangeFeeGO={form.setFeeGO}
      catatan={form.catatan}
      onChangeCatatan={form.setCatatan}
    />
  );

  const orderTableSection = (
    <BuyerOrderTable
      orderRows={form.orderRows}
      registeredBuyers={REGISTERED_BUYERS}
      currency={form.currentCountry.currency}
      kursRate={form.kursRate}
      overheadPerPc={form.overheadPerPc}
      isJapan={form.selectedCountry === "JP"}
      onAddRow={form.handleAddRow}
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
              Batch
            </span>
            <span>&gt;</span>
            <span className="text-[#EC4899] font-medium">
              Tambah Batch Baru
            </span>
          </nav>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-[#18181B] tracking-[-0.8px]">
            Tambah Batch Baru
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#71717A] mt-1">
            Input pesanan group order dan kalkulasi harga real-time
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 px-4 text-xs font-semibold gap-2 border-[#FBCFE8]"
          >
            <Bookmark className="w-4 h-4 text-[#71717A]" />
            <span>Simpan Draft</span>
          </Button>
        </div>
      </div>

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
              className="h-11 px-3.5 text-xs font-semibold text-[#71717A] gap-1.5"
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
              <span>Terbitkan & Simpan</span>
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
    </div>
  );
};

export default BatchInputPage;
