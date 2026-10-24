import React, { useState, useMemo } from "react";
import { AlertCircle, FileSpreadsheet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  calculateBatchProfit,
  type BatchProfitInput,
} from "@/lib/calculations/batch-profit";

export type InternalCalculationValues = BatchProfitInput;

interface InternalCalculationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchNumber: string;
  initialLaba?: number | null;
  isArrivedINA?: boolean;
  onSave?: (batchNumber: string, labaBersih: number) => void;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount);
}

function getInitialValues(initialLaba?: number | null): InternalCalculationValues {
  if (initialLaba && initialLaba > 0) {
    return {
      totalHargaJual: initialLaba + 250000,
      hargaTFSeller: 200000,
      tagihanPC: 80000,
      tagihanFreebies: 10000,
      hargaCOShopee: 20000,
      hargaTagihanWH: 40000,
      feeNyelem: 10000,
      feeRekap: 20000,
    };
  }
  return {
    totalHargaJual: 0,
    hargaTFSeller: 0,
    tagihanPC: 0,
    tagihanFreebies: 0,
    hargaCOShopee: 0,
    hargaTagihanWH: 0,
    feeNyelem: 10000,
    feeRekap: 20000,
  };
}

export const InternalCalculationModal: React.FC<InternalCalculationModalProps> = ({
  open,
  onOpenChange,
  batchNumber,
  initialLaba,
  isArrivedINA = false,
  onSave,
}) => {
  const [values, setValues] = useState<InternalCalculationValues>(() =>
    getInitialValues(initialLaba),
  );

  const handleChange = (field: keyof InternalCalculationValues, val: number) => {
    setValues((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  // Real-time automatic calculations via pure function calculateBatchProfit
  const { selisihHarga, selisihTax, labaKotor, labaBersih } = useMemo(() => {
    return calculateBatchProfit(values);
  }, [values]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(batchNumber, labaBersih);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-6 sm:p-7 gap-5 rounded-[24px] border-[#FBCFE8]/60">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl sm:text-22px font-bold text-[#18181B] tracking-tight">
              Internal Calculation &middot;{" "}
              <span className="text-[#EC4899]">{batchNumber}</span>
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#71717A] mt-0.5">
            Dihitung setelah barang tiba di Indonesia. Hanya terlihat oleh admin.
          </DialogDescription>
        </DialogHeader>

        {!isArrivedINA && (
          <div className="p-3.5 rounded-[14px] bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Barang batch ini belum berstatus{" "}
              <strong className="font-semibold text-amber-950">
                Arrive Indonesia
              </strong>
              . Internal calculation sebaiknya diisi setelah barang tiba di INA.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Total Harga Jual (Pemasukan)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  value={values.totalHargaJual || ""}
                  onChange={(e) =>
                    handleChange("totalHargaJual", Number(e.target.value))
                  }
                  className="pl-9 h-10 rounded-[12px] border-[#FBCFE8] focus-visible:ring-[#EC4899] text-xs font-medium"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Harga TF Seller (Modal Barang)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  value={values.hargaTFSeller || ""}
                  onChange={(e) =>
                    handleChange("hargaTFSeller", Number(e.target.value))
                  }
                  className="pl-9 h-10 rounded-[12px] border-[#FBCFE8] focus-visible:ring-[#EC4899] text-xs font-medium"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Tagihan PC (Pemasukan Ongkir WH)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  value={values.tagihanPC || ""}
                  onChange={(e) =>
                    handleChange("tagihanPC", Number(e.target.value))
                  }
                  className="pl-9 h-10 rounded-[12px] border-[#FBCFE8] focus-visible:ring-[#EC4899] text-xs font-medium"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Tagihan Freebies
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  value={values.tagihanFreebies || ""}
                  onChange={(e) =>
                    handleChange("tagihanFreebies", Number(e.target.value))
                  }
                  className="pl-9 h-10 rounded-[12px] border-[#FBCFE8] focus-visible:ring-[#EC4899] text-xs font-medium"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Harga CO Shopee
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  value={values.hargaCOShopee || ""}
                  onChange={(e) =>
                    handleChange("hargaCOShopee", Number(e.target.value))
                  }
                  className="pl-9 h-10 rounded-[12px] border-[#FBCFE8] focus-visible:ring-[#EC4899] text-xs font-medium"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Harga Tagihan WH (Pengeluaran Asli WH)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  value={values.hargaTagihanWH || ""}
                  onChange={(e) =>
                    handleChange("hargaTagihanWH", Number(e.target.value))
                  }
                  className="pl-9 h-10 rounded-[12px] border-[#FBCFE8] focus-visible:ring-[#EC4899] text-xs font-medium"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Fee Admin Nyelem
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  value={values.feeNyelem || ""}
                  onChange={(e) =>
                    handleChange("feeNyelem", Number(e.target.value))
                  }
                  className="pl-9 h-10 rounded-[12px] border-[#FBCFE8] focus-visible:ring-[#EC4899] text-xs font-medium"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Fee Rekap Admin
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  value={values.feeRekap || ""}
                  onChange={(e) =>
                    handleChange("feeRekap", Number(e.target.value))
                  }
                  className="pl-9 h-10 rounded-[12px] border-[#FBCFE8] focus-visible:ring-[#EC4899] text-xs font-medium"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#FCE7F3]/70 space-y-3">
            <div className="text-xs font-bold text-[#18181B] uppercase tracking-wider">
              Kalkulasi Otomatis (Calculation Engine PRD §4 Rule #10)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-[14px] bg-white border border-[#FCE7F3] space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#71717A]">
                    Selisih harga
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 bg-[#FFF5FA] text-[#EC4899]"
                  >
                    otomatis
                  </Badge>
                </div>
                <div className="text-base font-bold text-[#18181B] tabular-nums">
                  Rp {formatRupiah(selisihHarga)}
                </div>
                <div className="text-[11px] text-[#71717A] leading-tight">
                  Harga Jual &minus; TF Seller
                </div>
              </div>

              <div className="p-3.5 rounded-[14px] bg-white border border-[#FCE7F3] space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#71717A]">
                    Selisih tax
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 bg-[#FFF5FA] text-[#EC4899]"
                  >
                    otomatis
                  </Badge>
                </div>
                <div className="text-base font-bold text-[#18181B] tabular-nums">
                  Rp {formatRupiah(selisihTax)}
                </div>
                <div className="text-[11px] text-[#71717A] leading-tight truncate">
                  Tagihan PC &minus; (Freebies + Shopee + WH)
                </div>
              </div>

              <div className="p-3.5 rounded-[14px] bg-white border border-[#FCE7F3] space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#71717A]">
                    Laba kotor
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 bg-[#FFF5FA] text-[#EC4899]"
                  >
                    otomatis
                  </Badge>
                </div>
                <div className="text-base font-bold text-[#18181B] tabular-nums">
                  Rp {formatRupiah(labaKotor)}
                </div>
                <div className="text-[11px] text-[#71717A] leading-tight">
                  Selisih tax + Selisih harga
                </div>
              </div>

              <div
                className={`p-3.5 rounded-[14px] border space-y-1.5 shadow-2xs transition-all ${
                  labaBersih >= 0
                    ? "bg-emerald-50/70 border-emerald-200"
                    : "bg-rose-50/70 border-rose-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      labaBersih >= 0 ? "text-emerald-800" : "text-rose-800"
                    }`}
                  >
                    Laba bersih
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 h-4 ${
                      labaBersih >= 0
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}
                  >
                    otomatis
                  </Badge>
                </div>
                <div
                  className={`text-[18px] font-black tabular-nums ${
                    labaBersih >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"
                  }`}
                >
                  {labaBersih >= 0 ? "+ " : ""}Rp {formatRupiah(labaBersih)}
                </div>
                <div className="text-[11px] text-[#71717A] leading-tight">
                  Laba kotor &minus; Fee Nyelem &minus; Fee Rekap
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-[12px] border-[#FBCFE8] hover:bg-[#FFF5FA] text-xs font-semibold text-[#71717A]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="h-10 px-5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold shadow-sm gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Simpan &amp; tandai terhitung</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InternalCalculationModal;
