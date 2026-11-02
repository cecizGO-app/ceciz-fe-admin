import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { CashflowEntry } from "@/types/cashflow";

interface CashflowDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: CashflowEntry | null;
  onConfirmDelete: (id: string) => Promise<void>;
}

const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

export const CashflowDeleteDialog: React.FC<CashflowDeleteDialogProps> = ({
  open,
  onOpenChange,
  entry,
  onConfirmDelete,
}) => {
  const [loading, setLoading] = useState(false);

  if (!entry) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirmDelete(entry.id);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] sm:max-w-[420px] p-6 rounded-[24px] bg-white border border-rose-200 shadow-xl">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-[#18181B]">
              Hapus Transaksi Cashflow?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
              Tindakan ini akan menghapus catatan transaksi{" "}
              <span className="font-semibold text-[#18181B]">
                &ldquo;{entry.description}&rdquo;
              </span>{" "}
              sebesar{" "}
              <span className="font-semibold text-rose-600">
                {formatRupiah(entry.amount)}
              </span>
              . Saldo kas bersih akan dihitung ulang secara otomatis.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl border-[#FBCFE8] text-[#71717A] hover:bg-[#FFF5FA] cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer gap-1.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <span>Ya, Hapus Transaksi</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

