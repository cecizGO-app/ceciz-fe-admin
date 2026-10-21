import React, { useState } from "react";
import { ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface WaivePenaltyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceNo?: string;
  penaltyAmount: number;
  onConfirmWaive: (reason: string) => void;
}

export const WaivePenaltyModal: React.FC<WaivePenaltyModalProps> = ({
  open,
  onOpenChange,
  invoiceNo,
  penaltyAmount,
  onConfirmWaive,
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirmWaive(reason.trim());
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[20px] p-6">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-2">
            <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
          </div>
          <DialogTitle className="text-base font-bold text-[#18181B]">
            Waive Denda Keterlambatan
          </DialogTitle>
          <DialogDescription className="text-xs text-[#71717A]">
            Denda sebesar{" "}
            <span className="font-bold text-rose-600">
              Rp {penaltyAmount.toLocaleString("id-ID")}
            </span>{" "}
            pada {invoiceNo} akan dihapuskan. Sesuai PRD v1.4, aksi ini akan
            dicatat permanen di Audit Trail (
            <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] text-slate-800">
              WAIVE_PENALTY
            </code>
            ).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-[#18181B] block mb-1.5">
              Alasan Penghapusan Denda (Wajib Diisi):
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Kesepakatan khusus kendala transfer bank, atau kompensasi keterlambatan paket..."
              rows={3}
              className="w-full p-3 rounded-[12px] border border-[#FBCFE8] text-xs font-medium text-[#18181B] placeholder:text-[#71717A] outline-none focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/20"
              required
            />
          </div>

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
              disabled={!reason.trim()}
              className="px-4 py-2 rounded-[10px] bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              Konfirmasi Waive Denda
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
