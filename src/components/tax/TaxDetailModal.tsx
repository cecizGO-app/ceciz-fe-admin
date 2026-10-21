import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Pencil,
  Download,
  AlertCircle,
  Sparkles,
  FileCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CountryFlag } from "@/components/icons/CountryFlag";
import { getReceiptImageUrl } from "@/components/verification/receiptImages";
import type { TaxInvoiceItem, CountryCode, BatchItemRef } from "./types";

interface TaxDetailModalProps {
  item: TaxInvoiceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (item: TaxInvoiceItem) => void;
  onOpenReject: (item: TaxInvoiceItem) => void;
  onOpenWaive: (item: TaxInvoiceItem) => void;
  onMarkPaidManual?: (item: TaxInvoiceItem) => void;
  onOpenEdit?: (item: TaxInvoiceItem) => void;
}

const countryNames: Record<string, string> = {
  CH: "China",
  KR: "Korea Selatan",
  TH: "Thailand",
  JP: "Jepang",
  INA: "Indonesia",
};

export const TaxDetailModal: React.FC<TaxDetailModalProps> = ({
  item,
  open,
  onOpenChange,
  onApprove,
  onOpenReject,
  onOpenWaive,
  onOpenEdit,
}) => {
  const [zoomReceipt, setZoomReceipt] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Group items by batch for elegant card presentation
  const groupedBatches = useMemo(() => {
    if (!item) return [];
    const map = new Map<
      string,
      { batchCode: string; country: CountryCode; items: BatchItemRef[] }
    >();
    for (const b of item.batches) {
      if (!map.has(b.batchCode)) {
        map.set(b.batchCode, {
          batchCode: b.batchCode,
          country: b.country,
          items: [],
        });
      }
      map.get(b.batchCode)!.items.push(b);
    }
    return Array.from(map.values());
  }, [item]);

  if (!item) return null;

  const isOverdue = item.status === "Overdue";
  const hasActivePenalty = item.penaltyAmount > 0 && !item.penaltyWaived;
  const grandTotal =
    item.totalAmount + (hasActivePenalty ? item.penaltyAmount : 0);

  const receiptUrl =
    item.hasProof &&
    getReceiptImageUrl(
      item.bankName || "BCA",
      grandTotal,
      item.buyerName,
      item.refNumber || `TRX-${item.id}`
    );

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl rounded-[24px] p-6 sm:p-7 max-h-[90vh] overflow-y-auto border border-[#FBCFE8]">
        {/* Header matching user wireframe */}
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-[#18181B] tracking-tight">
            Detail Tagihan Tax &middot; {item.id}
          </DialogTitle>
          <div className="text-xs sm:text-sm text-[#71717A] flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#18181B]">{item.buyerName}</span>
            <span className="text-[#EC4899] font-medium">({item.buyerHandle})</span>
            {item.buyerPhone && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-[11px] text-[#71717A]">
                WA: {item.buyerPhone}
              </span>
            )}
            {item.buyerLineId && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-[11px] text-[#71717A]">
                LINE: {item.buyerLineId}
              </span>
            )}
          </div>
        </DialogHeader>

        {downloadSuccess && (
          <div className="rounded-[12px] bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Invoice PDF untuk {item.id} berhasil diunduh ke perangkat Anda.</span>
          </div>
        )}

        <div className="space-y-5 pt-1">
          {/* Top Summary Card (Total tagihan, Status badge, Deadlines) */}
          <div className="rounded-[20px] bg-[#FFF5FA]/70 border border-[#FBCFE8] p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-xs text-[#71717A] font-medium block mb-1">
                  Total tagihan
                </span>
                <div className="text-3xl font-extrabold text-[#18181B] tracking-tight">
                  Rp {grandTotal.toLocaleString("id-ID")}
                </div>
              </div>

              {/* Status Badge Pill */}
              <div>
                {item.status === "Pending" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    Pending (Menunggu Verifikasi)
                  </span>
                )}
                {item.status === "Unpaid" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                    <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
                    Unpaid (Belum Bayar)
                  </span>
                )}
                {item.status === "Approved" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    Approved (Lunas)
                  </span>
                )}
                {item.status === "Overdue" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    Overdue (Terlambat)
                  </span>
                )}
              </div>
            </div>

            {/* Divider and Deadline Dates */}
            <div className="border-t border-[#FBCFE8]/60 pt-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-[#71717A] block mb-0.5">
                    Deadline
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      isOverdue ? "text-rose-600" : "text-[#18181B]"
                    }`}
                  >
                    {item.deadline}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#71717A] block mb-0.5">
                    Max checkout
                  </span>
                  <span className="text-sm font-bold text-[#18181B]">
                    {item.maxCheckoutDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Point 3: Breakdown Denda Keterlambatan & Waive Denda */}
          {(hasActivePenalty || item.penaltyWaived || isOverdue) && (
            <div className="rounded-[16px] border border-amber-200 bg-amber-50/70 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Kalkulasi Denda Keterlambatan (Computed Field)</span>
                </span>
                {hasActivePenalty && (
                  <button
                    type="button"
                    onClick={() => onOpenWaive(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] border border-amber-300 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>Waive Denda</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-amber-200/80">
                <div>
                  <span className="text-[#71717A] block">Tax Pokok:</span>
                  <span className="font-semibold text-[#18181B]">
                    Rp {item.totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div>
                  <span className="text-[#71717A] block">Denda Terlambat:</span>
                  {item.penaltyWaived ? (
                    <span className="font-bold text-emerald-700">
                      Rp 0 (Di-waive)
                    </span>
                  ) : (
                    <span className="font-bold text-rose-600">
                      + Rp {item.penaltyAmount.toLocaleString("id-ID")} (Rp 2.000/hari)
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[#71717A] block">Total Akhir:</span>
                  <span className="font-extrabold text-[#EC4899]">
                    Rp {grandTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {item.penaltyWaived && item.penaltyWaiveReason && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-[8px] border border-emerald-200">
                  <strong>Alasan waive denda:</strong> {item.penaltyWaiveReason}
                </div>
              )}
            </div>
          )}

          {/* Rincian barang per batch (Card layout matching user screenshot) */}
          <div>
            <h4 className="text-sm font-bold text-[#18181B] mb-3">
              Rincian barang per batch
            </h4>

            <div className="space-y-3">
              {groupedBatches.map((batchGroup, gIdx) => (
                <div
                  key={`${batchGroup.batchCode}-${gIdx}`}
                  className="rounded-[16px] border border-[#FBCFE8]/80 bg-white overflow-hidden shadow-2xs"
                >
                  {/* Batch Header Bar */}
                  <div className="px-4 py-2.5 bg-[#FFF5FA]/40 border-b border-[#FBCFE8]/50 flex items-center gap-2">
                    <CountryFlag
                      code={batchGroup.country}
                      className="w-4 h-3 rounded-[2px]"
                    />
                    <span className="text-xs font-bold text-[#18181B]">
                      Batch {batchGroup.batchCode}
                    </span>
                    <span className="text-xs text-[#71717A]">
                      &middot; {countryNames[batchGroup.country] || batchGroup.country}
                    </span>
                  </div>

                  {/* Batch Items List */}
                  <div className="divide-y divide-[#FCE7F3]/60">
                    {batchGroup.items.map((bItem, iIdx) => {
                      const rateLabel = bItem.isPhotocard
                        ? bItem.country === "KR"
                          ? "Rate Rp 6.000 / pcs"
                          : "Rate Rp 7.000 / pcs"
                        : "Per berat · 0,8 kg";

                      return (
                        <div
                          key={iIdx}
                          className="p-4 flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="text-xs font-semibold text-[#18181B]">
                              {bItem.itemName}{" "}
                              <span className="text-[#71717A] font-normal">
                                ({bItem.qty} pcs)
                              </span>
                            </div>
                            <div className="text-[11px] text-[#71717A] mt-0.5">
                              {rateLabel}
                            </div>
                          </div>
                          <div className="text-xs font-bold text-[#18181B] shrink-0">
                            Rp {bItem.itemTax.toLocaleString("id-ID")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bukti Transfer */}
          <div>
            <h4 className="text-sm font-bold text-[#18181B] mb-3">
              Bukti Transfer
            </h4>

            {item.hasProof && receiptUrl ? (
              <div className="rounded-[16px] border border-[#FBCFE8]/80 bg-white p-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Struk Image Thumbnail with Zoom */}
                  <div className="relative group w-36 h-48 sm:w-40 sm:h-52 rounded-[14px] overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-2xs">
                    <img
                      src={receiptUrl}
                      alt={`Bukti Transfer ${item.id}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setZoomReceipt(true)}
                      className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-xs gap-1.5 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Perbesar</span>
                    </button>
                  </div>

                  {/* Status Text: Menunggu approval */}
                  <div className="flex-1 flex flex-col justify-center sm:pt-4 text-center sm:text-left">
                    {item.status === "Approved" ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold w-fit mx-auto sm:mx-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Pembayaran Disetujui</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-semibold w-fit mx-auto sm:mx-0">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                        <span>Menunggu approval</span>
                      </div>
                    )}
                    <p className="text-xs text-[#71717A] mt-2">
                      {item.status === "Approved"
                        ? "Bukti transfer telah diverifikasi dan disetujui oleh admin."
                        : "Bukti transfer telah diunggah oleh buyer dan menunggu konfirmasi approval admin."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-[16px] bg-slate-50 border border-slate-200 text-center text-xs text-[#71717A]">
                Buyer belum mengunggah bukti pembayaran untuk invoice tax ini.
              </div>
            )}
          </div>

          {/* Notes for buyer if available */}
          {item.notes && (
            <div className="p-3.5 rounded-[14px] bg-[#FFF5FA]/60 border border-[#FBCFE8]/60 text-xs">
              <span className="text-[11px] font-bold text-[#EC4899] uppercase tracking-wider block mb-1">
                Catatan untuk Buyer:
              </span>
              <p className="text-[#18181B] font-medium leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}
        </div>

        {/* Modal Action Footer: Tutup diganti Edit, Unduh Invoice PDF, & Aksi Verifikasi Admin */}
        <div className="pt-4 border-t border-[#FCE7F3] flex flex-wrap items-center justify-between gap-3">
          {/* Left Side: Edit Tagihan (replacing Tutup) + Unduh Invoice PDF */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onOpenEdit?.(item);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-xs font-semibold text-[#18181B] hover:text-[#EC4899] transition-all cursor-pointer shadow-2xs"
            >
              <Pencil className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>Edit Tagihan</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Invoice PDF</span>
            </button>
          </div>

          {/* Right Side: Point 2 Admin Verification Actions */}
          <div className="flex items-center gap-2">
            {item.status === "Pending" && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenReject(item)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Tolak Bukti</span>
                </button>

                <button
                  type="button"
                  onClick={() => onApprove(item)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Setujui Pembayaran</span>
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Full Receipt Zoom Dialog */}
      {zoomReceipt && receiptUrl && (
        <Dialog open={zoomReceipt} onOpenChange={setZoomReceipt}>
          <DialogContent className="max-w-md rounded-[20px] p-4">
            <div className="text-sm font-bold text-[#18181B] mb-2">
              Bukti Transfer &mdash; {item.id}
            </div>
            <div className="rounded-[14px] overflow-hidden border border-slate-200">
              <img
                src={receiptUrl}
                alt={`Struk Asli ${item.id}`}
                className="w-full h-auto"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default TaxDetailModal;
