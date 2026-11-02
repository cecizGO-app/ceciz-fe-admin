import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  CASHFLOW_CATEGORIES,
  PAYMENT_METHOD_OPTIONS,
  type CashflowEntry,
  type CashflowType,
  type CreateCashflowInput,
  type PaymentMethodType,
} from "@/types/cashflow";

interface CashflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entryToEdit?: CashflowEntry | null;
  onSave: (input: CreateCashflowInput) => Promise<void>;
}

const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

export const CashflowModal: React.FC<CashflowModalProps> = ({
  open,
  onOpenChange,
  entryToEdit,
  onSave,
}) => {
  const isEdit = Boolean(entryToEdit);

  const [type, setType] = useState<CashflowType>("EXPENSE");
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("BCA");
  const [description, setDescription] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state saat modal dibuka atau entryToEdit berubah
  useEffect(() => {
    if (entryToEdit) {
      setType(entryToEdit.type);
      setEntryDate(entryToEdit.entryDate.split("T")[0]);
      setAmount(String(entryToEdit.amount));
      setCategory(entryToEdit.category);
      setPaymentMethod(entryToEdit.paymentMethod);
      setDescription(entryToEdit.description);
      setNotes(entryToEdit.notes || "");
      setError(null);
    } else {
      setType("EXPENSE");
      setEntryDate(new Date().toISOString().split("T")[0]);
      setAmount("");
      setCategory(CASHFLOW_CATEGORIES.EXPENSE[0].value);
      setPaymentMethod("BCA");
      setDescription("");
      setNotes("");
      setError(null);
    }
  }, [entryToEdit, open]);

  // Update default kategori saat tipe berubah jika kategori saat ini tidak cocok
  const handleTypeChange = (newType: CashflowType) => {
    setType(newType);
    const validCategories =
      newType === "INCOME"
        ? CASHFLOW_CATEGORIES.INCOME
        : CASHFLOW_CATEGORIES.EXPENSE;
    if (!validCategories.some((c) => c.value === category)) {
      setCategory(validCategories[0].value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Nominal harus berupa angka lebih besar dari 0");
      return;
    }

    if (!description.trim()) {
      setError("Deskripsi transaksi wajib diisi");
      return;
    }

    if (!entryDate) {
      setError("Tanggal transaksi wajib dipilih");
      return;
    }

    if (!category) {
      setError("Kategori wajib dipilih");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        entryDate,
        amount: parsedAmount,
        type,
        category,
        paymentMethod,
        description: description.trim(),
        notes: notes.trim() || undefined,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan transaksi cashflow";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories =
    type === "INCOME" ? CASHFLOW_CATEGORIES.INCOME : CASHFLOW_CATEGORIES.EXPENSE;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[540px] p-0 rounded-[24px] bg-white border border-[#FBCFE8]/60 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-5 sm:p-6 pb-4 border-b border-[#FBCFE8]/40 bg-[#FFF5FA]/40">
          <DialogTitle className="text-lg sm:text-xl font-bold text-[#18181B] tracking-tight">
            {isEdit ? "Edit Transaksi Cashflow" : "Catat Transaksi Cashflow"}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#71717A] mt-1">
            Buku kas digital pencatatan pemasukan dan pengeluaran operasional Ceciz GO.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Tipe Transaksi (Pemasukan vs Pengeluaran) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#18181B]">
              Tipe Transaksi <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleTypeChange("INCOME")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  type === "INCOME"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs ring-2 ring-emerald-500/20"
                    : "bg-white border-[#FBCFE8] text-[#71717A] hover:bg-[#FFF5FA]"
                }`}
              >
                <ArrowDownLeft
                  className={`w-4 h-4 ${
                    type === "INCOME" ? "text-emerald-600" : "text-[#71717A]"
                  }`}
                />
                <span>Pemasukan (Uang Masuk)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange("EXPENSE")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  type === "EXPENSE"
                    ? "bg-rose-50 border-rose-500 text-rose-800 shadow-2xs ring-2 ring-rose-500/20"
                    : "bg-white border-[#FBCFE8] text-[#71717A] hover:bg-[#FFF5FA]"
                }`}
              >
                <ArrowUpRight
                  className={`w-4 h-4 ${
                    type === "EXPENSE" ? "text-rose-600" : "text-[#71717A]"
                  }`}
                />
                <span>Pengeluaran (Uang Keluar)</span>
              </button>
            </div>
          </div>

          {/* 2. Tanggal Transaksi & Akun Kas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="entryDate" className="text-xs font-semibold text-[#18181B]">
                Tanggal Transaksi <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="entryDate"
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="h-10 text-xs rounded-xl border-[#FBCFE8] focus:border-[#EC4899] bg-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#18181B]">
                Akun / Rekening Kas <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={paymentMethod}
                onValueChange={(val) => setPaymentMethod(val as PaymentMethodType)}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl border-[#FBCFE8] bg-white">
                  <SelectValue placeholder="Pilih Akun" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#FBCFE8]">
                  {PAYMENT_METHOD_OPTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value} className="text-xs">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 3. Nominal Transaksi */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs font-semibold text-[#18181B]">
              Nominal (IDR) <span className="text-rose-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                Rp
              </span>
              <Input
                id="amount"
                type="number"
                min="0"
                step="1000"
                placeholder="Contoh: 250000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 h-10 text-xs sm:text-sm font-semibold rounded-xl border-[#FBCFE8] focus:border-[#EC4899] bg-white"
                required
              />
            </div>
            {Number(amount) > 0 && (
              <p className="text-[11px] font-semibold text-[#EC4899]">
                Terbaca: {formatRupiah(Number(amount))}
              </p>
            )}
          </div>

          {/* 4. Kategori */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#18181B]">
              Kategori Keperluan <span className="text-rose-500">*</span>
            </Label>
            <Select value={category} onValueChange={(val) => setCategory(val)}>
              <SelectTrigger className="h-10 text-xs rounded-xl border-[#FBCFE8] bg-white">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#FBCFE8] max-h-56">
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="text-xs">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 5. Deskripsi Transaksi */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-[#18181B]">
              Deskripsi Singkat <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Contoh: Pembelian bubble wrap 1 roll & toploader 5 pack"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-10 text-xs sm:text-sm rounded-xl border-[#FBCFE8] focus:border-[#EC4899] bg-white"
              required
            />
          </div>

          {/* 6. Catatan Tambahan (Opsional) */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold text-[#18181B]">
              Catatan / No. Referensi (Opsional)
            </Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Contoh: No pesanan Shopee 2410291029, toko Plastik Jaya"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs rounded-xl border-[#FBCFE8] focus:border-[#EC4899] bg-white resize-none"
            />
          </div>

          {/* Footer Actions */}
          <DialogFooter className="pt-3 border-t border-[#FBCFE8]/40 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-10 px-4 text-xs font-semibold rounded-xl border-[#FBCFE8] text-[#71717A] hover:bg-[#FFF5FA] cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-5 text-xs font-semibold rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-xs cursor-pointer gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEdit ? "Simpan Perubahan" : "Simpan Transaksi"}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

