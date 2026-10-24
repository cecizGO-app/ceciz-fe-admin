import React, { useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { type TaxInvoiceItem, formatReadableDateTime } from "@/types/tax";

interface ReleaseItemPreview {
  buyerName: string;
  buyerHandle: string;
  batchCode: string;
  country: "CH" | "KR" | "JP" | "TH" | "INA";
  itemName: string;
  category: "PC" | "Non-PC";
  rateAcuan: string;
  qty: number;
  subtotal: number;
}

const mockUnbilledItems: ReleaseItemPreview[] = [
  {
    buyerName: "Maya Putri",
    buyerHandle: "@mayaputri",
    batchCode: "CH-025",
    country: "CH",
    itemName: "IVE Switch Photocard (3 pcs)",
    category: "PC",
    rateAcuan: "Rp 7.000 / pcs",
    qty: 3,
    subtotal: 21000,
  },
  {
    buyerName: "Nadya Salsabila",
    buyerHandle: "@nadyasalsa",
    batchCode: "KR-019",
    country: "KR",
    itemName: "NCT Wish Album (2 pcs)",
    category: "Non-PC",
    rateAcuan: "Per berat · 0,8 kg",
    qty: 2,
    subtotal: 96000,
  },
  {
    buyerName: "Rania Yusuf",
    buyerHandle: "@raniays",
    batchCode: "JP-014",
    country: "JP",
    itemName: "SKZ Japan Photocard (2 pcs)",
    category: "PC",
    rateAcuan: "Rp 7.000 / pcs",
    qty: 2,
    subtotal: 14000,
  },
  {
    buyerName: "Dita Anggraini",
    buyerHandle: "@ditaang",
    batchCode: "TH-011",
    country: "TH",
    itemName: "BUS Photocard (4 pcs)",
    category: "PC",
    rateAcuan: "Rp 7.000 / pcs",
    qty: 4,
    subtotal: 28000,
  },
  {
    buyerName: "Shafira Zahra",
    buyerHandle: "@shafirazh",
    batchCode: "INA-032",
    country: "INA",
    itemName: "Split GO Fee Packing",
    category: "PC",
    rateAcuan: "Rp 2.000 / pcs",
    qty: 1,
    subtotal: 2000,
  },
  {
    buyerName: "Adinda Kirana",
    buyerHandle: "@adindakr",
    batchCode: "CH-028",
    country: "CH",
    itemName: "Seventeen FML Benefit (2 pcs)",
    category: "PC",
    rateAcuan: "Rp 7.000 / pcs",
    qty: 2,
    subtotal: 14000,
  },
];

interface ReleaseTaxWizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccessRelease: (newInvoices: TaxInvoiceItem[], periodName: string) => void;
}

export const ReleaseTaxWizardModal: React.FC<ReleaseTaxWizardModalProps> = ({
  open,
  onOpenChange,
  onSuccessRelease,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 2 Configuration state
  const [releaseName, setReleaseName] = useState("TAGIHAN TAX 24");
  const [period, setPeriod] = useState("September 2026");
  const [deadlineDateTime, setDeadlineDateTime] = useState("2026-09-25T23:59");
  const [buyerNotes, setBuyerNotes] = useState("");

  const totalBuyers = 18;
  const totalNominal = 3840000;
  const maxCheckoutDate = "24 Nov 2026";

  const handleNextStep = () => {
    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
  };

  const handlePrevStep = () => {
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  const handleConfirm = () => {
    // Generate new mock invoices released via wizard
    const generatedInvoices: TaxInvoiceItem[] = [
      {
        id: "TAX-024",
        buyerName: "Amanda Manopo",
        buyerHandle: "@amandamn",
        buyerPhone: "0812-7766-5544",
        buyerLineId: "amandamn",
        status: "Unpaid",
        batches: [
          {
            batchCode: "CH-025",
            country: "CH",
            itemName: "IVE Switch Photocard",
            qty: 3,
            isPhotocard: true,
            itemTax: 21000,
          },
          {
            batchCode: "KR-019",
            country: "KR",
            itemName: "NCT Wish Album",
            qty: 2,
            isPhotocard: false,
            itemTax: 96000,
          },
        ],
        totalItemsCount: 5,
        itemSummary: "3 PC, 2 Album",
        totalAmount: 117000,
        penaltyAmount: 0,
        penaltyWaived: false,
        deadline: formatReadableDateTime(deadlineDateTime),
        rawDeadline: new Date(deadlineDateTime).toISOString(),
        maxCheckoutDate: maxCheckoutDate,
        period: releaseName,
        periodMonth: period,
        hasProof: false,
        proofStatus: "none",
        notes: buyerNotes.trim(),
      },
    ];

    onSuccessRelease(generatedInvoices, period);
    onOpenChange(false);
    setCurrentStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl rounded-[24px] p-6 sm:p-7 border border-[#FBCFE8] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#18181B] tracking-tight">
            Release Tagihan Tax Baru (Periodik Multi-Batch)
          </DialogTitle>
          <DialogDescription className="text-xs text-[#71717A] mt-0.5">
            Gabungkan barang dari berbagai batch dan negara ke dalam satu invoice per buyer.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper Progress Bar matching screenshot */}
        <div className="pt-2 pb-4">
          <div className="grid grid-cols-3 gap-2 relative">
            {/* Step 1 Indicator */}
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep > 1
                    ? "bg-[#EC4899] text-white"
                    : currentStep === 1
                    ? "bg-[#EC4899] text-white"
                    : "bg-slate-100 text-[#71717A]"
                }`}
              >
                {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
              </span>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  currentStep >= 1 ? "text-[#EC4899]" : "text-[#71717A]"
                }`}
              >
                Preview Item
              </span>
            </div>

            {/* Step 2 Indicator */}
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep > 2
                    ? "bg-[#EC4899] text-white"
                    : currentStep === 2
                    ? "bg-[#EC4899] text-white"
                    : "bg-slate-100 text-[#71717A]"
                }`}
              >
                {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
              </span>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  currentStep >= 2 ? "text-[#EC4899]" : "text-[#71717A]"
                }`}
              >
                Konfigurasi Rilis
              </span>
            </div>

            {/* Step 3 Indicator */}
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  currentStep === 3
                    ? "bg-[#EC4899] text-white"
                    : "bg-slate-100 text-[#71717A]"
                }`}
              >
                3
              </span>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  currentStep === 3 ? "text-[#EC4899]" : "text-[#71717A]"
                }`}
              >
                Konfirmasi Release
              </span>
            </div>
          </div>

          {/* Stepper underline */}
          <div className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#EC4899] transition-all duration-300"
              style={{
                width:
                  currentStep === 1
                    ? "33.3%"
                    : currentStep === 2
                    ? "66.6%"
                    : "100%",
              }}
            />
          </div>
        </div>

        {/* STEP 1: PREVIEW ITEM */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Banner info */}
            <div className="rounded-[14px] bg-[#FFF5FA] border border-[#FBCFE8]/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
              <span className="text-[#18181B] font-medium">
                Item berstatus <strong className="font-bold">Arrived WH INA</strong> yang belum pernah ditagih tax.
              </span>
              <span className="text-[#71717A] font-semibold shrink-0">
                42 item &middot; 18 buyer &middot; 6 batch
              </span>
            </div>

            {/* Table Preview Items */}
            <div className="rounded-[16px] border border-[#FBCFE8]/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF5FA]/50 border-b border-[#FCE7F3] text-[11px] font-bold text-[#71717A] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5">Buyer</th>
                      <th className="py-3 px-3.5">Batch</th>
                      <th className="py-3 px-3.5">Item</th>
                      <th className="py-3 px-3.5">Kategori</th>
                      <th className="py-3 px-3.5">Rate Acuan</th>
                      <th className="py-3 px-3.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FCE7F3]/60">
                    {mockUnbilledItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FFF5FA]/25 transition-colors">
                        <td className="py-3 px-3.5 font-semibold text-[#18181B]">
                          {item.buyerName}
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFF0F7] border border-[#FBCFE8] text-[11px] font-bold text-[#EC4899]">
                            {item.batchCode}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-[#18181B] font-medium">
                          {item.itemName}
                        </td>
                        <td className="py-3 px-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.category === "PC"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-[#71717A]">
                          {item.rateAcuan}
                        </td>
                        <td className="py-3 px-3.5 text-right font-bold text-[#18181B]">
                          Rp {item.subtotal.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom buttons Step 1 */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2.5 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                <span>Lanjut ke Konfigurasi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: KONFIGURASI RILIS */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Grid Row 1: Nama rilis & Periode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-[#18181B] block mb-1.5">
                  Nama rilis tagihan
                </label>
                <input
                  type="text"
                  value={releaseName}
                  onChange={(e) => setReleaseName(e.target.value)}
                  placeholder="TAGIHAN TAX 24"
                  required
                  className="w-full h-10 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-semibold tracking-wider text-[#18181B] outline-none focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/20 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#18181B] block mb-1.5">
                  Periode
                </label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="September 2026"
                  required
                  className="w-full h-10 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] outline-none focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/20"
                />
              </div>
            </div>

            {/* Row 2: Deadline pembayaran (DateTime Sesuai PRD) */}
            <div>
              <label className="text-xs font-semibold text-[#18181B] block mb-1.5 flex items-center justify-between">
                <span>Deadline pembayaran (Tanggal &amp; Waktu)</span>
                <span className="text-[11px] font-normal text-[#71717A]">
                  Standar PRD: 72 jam sejak rilis
                </span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={deadlineDateTime}
                  onChange={(e) => setDeadlineDateTime(e.target.value)}
                  required
                  className="w-full h-10 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-semibold text-[#18181B] outline-none focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/20"
                />
              </div>
              <p className="text-[11px] text-[#71717A] mt-1">
                Format Tampilan: {formatReadableDateTime(deadlineDateTime)}
              </p>
            </div>

            {/* Alert Banner: Max Checkout H+60 */}
            <div className="rounded-[14px] bg-blue-50/70 border border-blue-200/80 px-4 py-3 flex items-center gap-2.5 text-xs text-blue-900">
              <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Batas Maksimal Timbun (Max Checkout) otomatis di-set ke{" "}
                <strong className="font-bold">H+60 ({maxCheckoutDate})</strong>.
              </span>
            </div>

            {/* Row 3: Catatan tambahan untuk buyer */}
            <div>
              <label className="text-xs font-semibold text-[#18181B] block mb-1.5">
                Catatan tambahan untuk buyer (opsional)
              </label>
              <textarea
                rows={3}
                value={buyerNotes}
                onChange={(e) => setBuyerNotes(e.target.value)}
                placeholder="Contoh: Mohon cantumkan nomor invoice di berita transfer."
                className="w-full p-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] outline-none focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/20 resize-none"
              />
            </div>

            {/* Bottom buttons Step 2 */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                <span>Lanjut ke Konfirmasi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: KONFIRMASI RELEASE */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Top Summary Card */}
            <div className="rounded-[18px] bg-[#FFF5FA]/70 border border-[#FBCFE8] p-5 text-center space-y-1">
              <span className="text-[11px] font-bold text-[#EC4899] uppercase tracking-wider block">
                {releaseName}
              </span>
              <p className="text-xs text-[#71717A] font-medium">
                Siap merilis tagihan kepada{" "}
                <strong className="text-[#18181B] font-bold">
                  {totalBuyers} Buyer
                </strong>{" "}
                dengan total nominal pajak
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight pt-1">
                Rp {totalNominal.toLocaleString("id-ID")}
              </h2>
            </div>

            {/* Summary Details Table matching screenshot */}
            <div className="rounded-[16px] border border-[#FBCFE8]/80 divide-y divide-[#FBCFE8]/60 overflow-hidden text-xs">
              <div className="py-3 px-4 flex items-center justify-between">
                <span className="text-[#71717A] font-medium">Periode</span>
                <span className="text-[#18181B] font-bold">{period}</span>
              </div>
              <div className="py-3 px-4 flex items-center justify-between">
                <span className="text-[#71717A] font-medium">
                  Deadline pembayaran
                </span>
                <span className="text-[#18181B] font-bold">
                  {formatReadableDateTime(deadlineDateTime)}
                </span>
              </div>
              <div className="py-3 px-4 flex items-center justify-between">
                <span className="text-[#71717A] font-medium">
                  Max checkout (H+60)
                </span>
                <span className="text-[#18181B] font-bold">
                  {maxCheckoutDate}
                </span>
              </div>
              <div className="py-3 px-4 flex items-center justify-between">
                <span className="text-[#71717A] font-medium">
                  Catatan untuk buyer
                </span>
                <span className="text-[#18181B] font-medium">
                  {buyerNotes.trim() ? buyerNotes : "—"}
                </span>
              </div>
            </div>

            {/* Bottom buttons Step 3 */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2.5 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Konfirmasi &amp; Rilis Tagihan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
