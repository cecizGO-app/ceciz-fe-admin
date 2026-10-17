import React, { useState, useMemo } from "react";
import {
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react";
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

export interface InternalCalculationValues {
  totalHargaJual: number;
  hargaTFSeller: number;
  tagihanPC: number;
  tagihanFreebies: number;
  hargaCOShopee: number;
  hargaTagihanWH: number;
  pemasukanTax: number;
  feeNyelem: number;
  feeRekap: number;
}

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
      pemasukanTax: 0,
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
    pemasukanTax: 0,
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
  // Form input state diinisialisasi langsung dari initialLaba
  const [values, setValues] = useState<InternalCalculationValues>(() =>
    getInitialValues(initialLaba),
  );

  const handleChange = (field: keyof InternalCalculationValues, val: number) => {
    setValues((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  // Real-time automatic calculations:
  // 1. Selisih harga = Harga Jual - TF Seller
  const selisihHarga = useMemo(() => {
    return (values.totalHargaJual || 0) - (values.hargaTFSeller || 0);
  }, [values.totalHargaJual, values.hargaTFSeller]);

  // 2. Selisih tax = Tagihan PC - (Freebies + CO Shopee + Tagihan WH)
  const selisihTax = useMemo(() => {
    const expenses =
      (values.tagihanFreebies || 0) +
      (values.hargaCOShopee || 0) +
      (values.hargaTagihanWH || 0);
    return (values.tagihanPC || 0) - expenses;
  }, [
    values.tagihanPC,
    values.tagihanFreebies,
    values.hargaCOShopee,
    values.hargaTagihanWH,
  ]);

  // 3. Laba kotor = Selisih tax + Selisih harga
  const labaKotor = useMemo(() => {
    return selisihTax + selisihHarga;
  }, [selisihTax, selisihHarga]);

  // 4. Laba bersih = Laba kotor - Fee Nyelem - Fee Rekap
  const labaBersih = useMemo(() => {
    return labaKotor - (values.feeNyelem || 0) - (values.feeRekap || 0);
  }, [labaKotor, values.feeNyelem, values.feeRekap]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(batchNumber, labaBersih);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-6 sm:p-7 gap-5 rounded-[24px] border-[#FBCFE8]/60">
        {/* Header */}
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

        {/* Status Notice Banner */}
        {!isArrivedINA && (
          <div className="p-3.5 rounded-[14px] bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Barang batch ini belum berstatus <strong className="font-semibold text-amber-950">Arrive Indonesia</strong>. Internal calculation sebaiknya diisi setelah barang tiba di INA.
            </p>
          </div>
        )}

        {/* Input Parameters Form Grid */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Harga Jual */}
            <div>
              <Label htmlFor="total-harga-jual" className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Total Harga Jual (Rp)
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-[#71717A] pointer-events-none">Rp</span>
                <Input
                  id="total-harga-jual"
                  type="number"
                  min="0"
                  value={values.totalHargaJual || ""}
                  placeholder="0"
                  onChange={(e) => handleChange("totalHargaJual", Number(e.target.value) || 0)}
                  className="pl-9 h-10 rounded-[12px] border-[#FCE7F3] bg-[#FFF5FA]/20 focus:bg-white text-xs font-semibold text-[#18181B]"
                />
              </div>
            </div>

            {/* Harga TF Seller */}
            <div>
              <Label htmlFor="harga-tf-seller" className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Harga TF Seller (Rp)
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-[#71717A] pointer-events-none">Rp</span>
                <Input
                  id="harga-tf-seller"
                  type="number"
                  min="0"
                  value={values.hargaTFSeller || ""}
                  placeholder="0"
                  onChange={(e) => handleChange("hargaTFSeller", Number(e.target.value) || 0)}
                  className="pl-9 h-10 rounded-[12px] border-[#FCE7F3] bg-[#FFF5FA]/20 focus:bg-white text-xs font-semibold text-[#18181B]"
                />
              </div>
            </div>

            {/* Tagihan PC */}
            <div>
              <Label htmlFor="tagihan-pc" className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Tagihan PC (Rp)
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-[#71717A] pointer-events-none">Rp</span>
                <Input
                  id="tagihan-pc"
                  type="number"
                  min="0"
                  value={values.tagihanPC || ""}
                  placeholder="0"
                  onChange={(e) => handleChange("tagihanPC", Number(e.target.value) || 0)}
                  className="pl-9 h-10 rounded-[12px] border-[#FCE7F3] bg-[#FFF5FA]/20 focus:bg-white text-xs font-semibold text-[#18181B]"
                />
              </div>
            </div>

            {/* Tagihan Freebies */}
            <div>
              <Label htmlFor="tagihan-freebies" className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Tagihan Freebies (Rp)
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-[#71717A] pointer-events-none">Rp</span>
                <Input
                  id="tagihan-freebies"
                  type="number"
                  min="0"
                  value={values.tagihanFreebies || ""}
                  placeholder="0"
                  onChange={(e) => handleChange("tagihanFreebies", Number(e.target.value) || 0)}
                  className="pl-9 h-10 rounded-[12px] border-[#FCE7F3] bg-[#FFF5FA]/20 focus:bg-white text-xs font-semibold text-[#18181B]"
                />
              </div>
            </div>

            {/* Harga CO Shopee */}
            <div>
              <Label htmlFor="harga-co-shopee" className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Harga CO Shopee (Rp)
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-[#71717A] pointer-events-none">Rp</span>
                <Input
                  id="harga-co-shopee"
                  type="number"
                  min="0"
                  value={values.hargaCOShopee || ""}
                  placeholder="0"
                  onChange={(e) => handleChange("hargaCOShopee", Number(e.target.value) || 0)}
                  className="pl-9 h-10 rounded-[12px] border-[#FCE7F3] bg-[#FFF5FA]/20 focus:bg-white text-xs font-semibold text-[#18181B]"
                />
              </div>
            </div>

            {/* Harga Tagihan WH */}
            <div>
              <Label htmlFor="harga-tagihan-wh" className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Harga Tagihan WH (Rp)
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-[#71717A] pointer-events-none">Rp</span>
                <Input
                  id="harga-tagihan-wh"
                  type="number"
                  min="0"
                  value={values.hargaTagihanWH || ""}
                  placeholder="0"
                  onChange={(e) => handleChange("hargaTagihanWH", Number(e.target.value) || 0)}
                  className="pl-9 h-10 rounded-[12px] border-[#FCE7F3] bg-[#FFF5FA]/20 focus:bg-white text-xs font-semibold text-[#18181B]"
                />
              </div>
            </div>

            {/* Pemasukan Tax */}
            <div>
              <Label htmlFor="pemasukan-tax" className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Pemasukan Tax (Rp)
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-[#71717A] pointer-events-none">Rp</span>
                <Input
                  id="pemasukan-tax"
                  type="number"
                  min="0"
                  value={values.pemasukanTax || ""}
                  placeholder="0"
                  onChange={(e) => handleChange("pemasukanTax", Number(e.target.value) || 0)}
                  className="pl-9 h-10 rounded-[12px] border-[#FCE7F3] bg-[#FFF5FA]/20 focus:bg-white text-xs font-semibold text-[#18181B]"
                />
              </div>
            </div>

            {/* Fee Nyelem */}
            <div>
              <Label htmlFor="fee-nyelem" className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Fee Nyelem (Rp)
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-[#71717A] pointer-events-none">Rp</span>
                <Input
                  id="fee-nyelem"
                  type="number"
                  min="0"
                  value={values.feeNyelem || ""}
                  placeholder="0"
                  onChange={(e) => handleChange("feeNyelem", Number(e.target.value) || 0)}
                  className="pl-9 h-10 rounded-[12px] border-[#FCE7F3] bg-[#FFF5FA]/20 focus:bg-white text-xs font-semibold text-[#18181B]"
                />
              </div>
            </div>

            {/* Fee Rekap */}
            <div className="sm:col-span-1">
              <Label htmlFor="fee-rekap" className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Fee Rekap (Rp)
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-[#71717A] pointer-events-none">Rp</span>
                <Input
                  id="fee-rekap"
                  type="number"
                  min="0"
                  value={values.feeRekap || ""}
                  placeholder="0"
                  onChange={(e) => handleChange("feeRekap", Number(e.target.value) || 0)}
                  className="pl-9 h-10 rounded-[12px] border-[#FCE7F3] bg-[#FFF5FA]/20 focus:bg-white text-xs font-semibold text-[#18181B]"
                />
              </div>
            </div>
          </div>

          {/* Automatic Calculation Card Panel */}
          <div className="p-4 sm:p-5 rounded-[18px] bg-[#FFF5FA] border border-[#FBCFE8]/80 space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#FCE7F3]">
              <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
                <span>Hasil Kalkulasi Otomatis</span>
              </span>
              <span className="text-[11px] text-[#71717A]">
                Formula real-time internal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Selisih Harga */}
              <div className="p-3.5 rounded-[14px] bg-white border border-[#FCE7F3] space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#71717A]">Selisih harga</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#FFF5FA] text-[#EC4899]">
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

              {/* Selisih Tax */}
              <div className="p-3.5 rounded-[14px] bg-white border border-[#FCE7F3] space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#71717A]">Selisih tax</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#FFF5FA] text-[#EC4899]">
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

              {/* Laba Kotor */}
              <div className="p-3.5 rounded-[14px] bg-white border border-[#FCE7F3] space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#71717A]">Laba kotor</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[#FFF5FA] text-[#EC4899]">
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

              {/* Laba Bersih (Highlighted) */}
              <div
                className={`p-3.5 rounded-[14px] border space-y-1.5 shadow-2xs transition-all ${labaBersih >= 0
                    ? "bg-emerald-50/70 border-emerald-200"
                    : "bg-rose-50/70 border-rose-200"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${labaBersih >= 0 ? "text-emerald-800" : "text-rose-800"
                      }`}
                  >
                    Laba bersih
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 h-4 ${labaBersih >= 0
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                      }`}
                  >
                    otomatis
                  </Badge>
                </div>
                <div
                  className={`text-[18px] font-black tabular-nums ${labaBersih >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"
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

          {/* Action Footer Buttons */}
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
