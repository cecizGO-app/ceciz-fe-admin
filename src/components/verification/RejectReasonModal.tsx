import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { PaymentItem } from "./types";

interface RejectReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetItem: PaymentItem | null;
  targetItems: PaymentItem[];
  onConfirmReject: (reason: string) => void;
}

const COMMON_REJECT_REASONS = [
  "Nominal transfer kurang dari total tagihan invoice",
  "Bukti transfer buram / tidak terbaca dengan jelas",
  "Mutasi rekening belum ditemukan pada mutasi bank admin",
  "Salah transfer ke nomor rekening tujuan yang tidak aktif",
  "Duplikasi upload bukti pembayaran yang sudah pernah diverifikasi",
];

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  open,
  onOpenChange,
  targetItem,
  targetItems,
  onConfirmReject,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isBulk = !targetItem && targetItems.length > 0;
  const count = isBulk ? targetItems.length : 1;

  const handleClose = () => {
    setReason("");
    setError(null);
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Alasan penolakan wajib diisi agar buyer mengetahui kesalahannya.");
      return;
    }
    if (reason.trim().length < 5) {
      setError("Alasan penolakan minimal 5 karakter.");
      return;
    }
    onConfirmReject(reason.trim());
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 rounded-[22px] border border-zinc-200/80 bg-white shadow-xl">
        <div>
          <DialogTitle className="text-base font-bold text-[#18181B] flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Tolak Pembayaran {isBulk ? `(${count} Item)` : ""}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-[#71717A] mt-1">
            {targetItem
              ? `Tolak bukti bayar ${targetItem.buyerName} (${targetItem.batchCode})`
              : `Tolak ${count} pembayaran yang dipilih secara serentak.`}
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-[#71717A] block mb-1.5">
              Pilih Alasan Cepat:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_REJECT_REASONS.map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => {
                    setReason(template);
                    setError(null);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-[8px] border border-[#FCE7F3] bg-[#FFF5FA]/50 hover:bg-[#FFF5FA] text-[#EC4899] transition-colors text-left cursor-pointer"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#18181B] block mb-1">
              Alasan Penolakan <span className="text-rose-500">*</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Nominal transfer kurang Rp 50.000 dari tagihan..."
              rows={3}
              className="text-xs rounded-[12px] border-[#FCE7F3] focus-visible:ring-rose-500"
            />
            {error && (
              <p className="text-[11px] font-medium text-rose-600 mt-1">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="text-xs rounded-[10px] cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs rounded-[10px] bg-rose-600 hover:bg-rose-500 text-white font-semibold cursor-pointer"
            >
              Konfirmasi Tolak
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
