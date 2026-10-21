import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface RejectTaxProofModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNo?: string;
  buyerName?: string;
  onConfirmReject: (reason: string) => void;
}

const COMMON_REASONS = [
  "Nominal transfer tidak sesuai dengan total tagihan tax",
  "Foto struk buram, terpotong, atau tidak terbaca",
  "Rekening tujuan atau nama penerima tidak sesuai rekening Ceciz GO",
  "Status transfer masih pending / belum berhasil dari pihak bank",
  "Bukti transfer duplikat atau telah digunakan sebelumnya",
];

export const RejectTaxProofModal: React.FC<RejectTaxProofModalProps> = ({
  open,
  onOpenChange,
  invoiceNo,
  buyerName,
  onConfirmReject,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const effectiveReason =
    selectedReason === "other" ? customReason.trim() : selectedReason;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveReason) return;
    onConfirmReject(effectiveReason);
    setSelectedReason("");
    setCustomReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[20px] p-6">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-2">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <DialogTitle className="text-base font-bold text-[#18181B]">
            Tolak Bukti Transfer {invoiceNo}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#71717A]">
            Sesuai aturan PRD, penolakan pembayaran wajib menyertakan alasan
            yang jelas untuk pembeli ({buyerName}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#18181B] block">
              Pilih Alasan Penolakan:
            </label>
            <div className="space-y-1.5">
              {COMMON_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start gap-2.5 p-2.5 rounded-[10px] border text-xs cursor-pointer transition-all ${
                    selectedReason === reason
                      ? "border-[#EC4899] bg-[#FFF5FA] text-[#18181B] font-medium"
                      : "border-slate-200 hover:bg-slate-50 text-[#71717A]"
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="mt-0.5 text-[#EC4899] focus:ring-[#EC4899]"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              <label
                className={`flex items-start gap-2.5 p-2.5 rounded-[10px] border text-xs cursor-pointer transition-all ${
                  selectedReason === "other"
                    ? "border-[#EC4899] bg-[#FFF5FA] text-[#18181B] font-medium"
                    : "border-slate-200 hover:bg-slate-50 text-[#71717A]"
                }`}
              >
                <input
                  type="radio"
                  name="rejectReason"
                  value="other"
                  checked={selectedReason === "other"}
                  onChange={() => setSelectedReason("other")}
                  className="mt-0.5 text-[#EC4899] focus:ring-[#EC4899]"
                />
                <span>Alasan Lainnya (Ketik Manual)</span>
              </label>
            </div>
          </div>

          {selectedReason === "other" && (
            <div>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Jelaskan alasan penolakan secara spesifik..."
                rows={3}
                className="w-full p-3 rounded-[12px] border border-[#FBCFE8] text-xs font-medium text-[#18181B] placeholder:text-[#71717A] outline-none focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/20"
                required
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-[10px] border border-[#FBCFE8] bg-white text-xs font-semibold text-[#71717A] hover:bg-[#FFF5FA] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!effectiveReason}
              className="px-4 py-2 rounded-[10px] bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              Konfirmasi Tolak Bukti
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
