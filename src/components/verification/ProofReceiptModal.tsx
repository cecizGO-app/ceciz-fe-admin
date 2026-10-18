import React from "react";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PaymentItem } from "./types";

interface ProofReceiptModalProps {
  item: PaymentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (item: PaymentItem) => void;
  onReject: (item: PaymentItem) => void;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount);
}

export const ProofReceiptModal: React.FC<ProofReceiptModalProps> = ({
  item,
  open,
  onOpenChange,
  onApprove,
  onReject,
}) => {
  if (!item) return null;

  const isPending = item.status === "PENDING";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-[24px] border border-zinc-200/80 bg-white shadow-xl">
        {/* Header: Title & Subtitle */}
        <div>
          <DialogTitle className="text-[18px] font-bold text-[#18181B] tracking-tight">
            Detail Pembayaran
          </DialogTitle>
          <DialogDescription className="text-sm text-[#71717A] mt-0.5">
            {item.buyerName} &middot; {item.batchCode}
          </DialogDescription>
        </div>

        {/* Nominal & Payment Method */}
        <div className="mt-2 text-[18px] font-bold text-[#18181B] tracking-tight">
          Rp {formatRupiah(item.nominal)} &middot; {item.paymentMethod}
        </div>

        {/* Keterangan Transaksi */}
        {item.keterangan && (
          <div className="mt-1 text-xs text-[#71717A]">
            <span className="font-medium text-[#18181B]">Keterangan:</span>{" "}
            {item.keterangan}
          </div>
        )}

        {/* Gray Container Box (Matching Reference Screenshot) */}
        <div className="mt-4 rounded-[16px] bg-[#F4F5F7] p-4 flex flex-col items-center justify-center min-h-[140px] text-center border border-zinc-200/40">
          {item.proofImageUrl ? (
            <div className="w-full flex flex-col items-center gap-1.5">
              <img
                src={item.proofImageUrl}
                alt={`Bukti transfer ${item.buyerName}`}
                className="max-h-[220px] w-auto object-contain rounded-[10px] shadow-2xs border border-zinc-200 cursor-pointer hover:opacity-95 transition-opacity"
                title="Klik untuk membuka ukuran penuh di tab baru"
                onClick={() => window.open(item.proofImageUrl, "_blank")}
              />
              <span className="text-[11px] text-[#A1A1AA]">
                Klik struk untuk melihat ukuran penuh
              </span>
            </div>
          ) : (
            <p className="text-sm text-[#71717A] py-6">
              Bukti pembayaran contoh belum dilampirkan.
            </p>
          )}
        </div>

        {/* Footer: Status Badge & Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            {item.status === "PENDING" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E0F2FE] text-[#0284C7]">
                Pending
              </span>
            )}
            {item.status === "APPROVED" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                Disetujui
              </span>
            )}
            {item.status === "REJECTED" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                Ditolak
              </span>
            )}
          </div>

          {/* Action Buttons: Reject & ✓ Approve */}
          {isPending ? (
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onReject(item);
                }}
                className="h-10 px-5 rounded-[12px] border-zinc-200 hover:bg-zinc-50 text-[#18181B] text-xs font-medium cursor-pointer"
              >
                Reject
              </Button>

              <Button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  onApprove(item);
                }}
                className="h-10 px-5 rounded-[12px] bg-[#5B9BD5] hover:bg-[#4682B4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Approve</span>
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs rounded-[10px]"
            >
              Tutup
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
