import React, { useState } from "react";
import { Save, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentItem, PaymentMethod } from "./types";
import { getReceiptImageUrl } from "./receiptImages";

interface AddManualPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBatches: string[];
  onAddPayment: (newItem: PaymentItem) => void;
}

export const AddManualPaymentModal: React.FC<AddManualPaymentModalProps> = ({
  open,
  onOpenChange,
  availableBatches,
  onAddPayment,
}) => {
  const [buyerName, setBuyerName] = useState("");
  const [batchCode, setBatchCode] = useState(availableBatches[0] || "CH-025");
  const [nominalStr, setNominalStr] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BCA");
  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [status, setStatus] = useState<"PENDING" | "APPROVED">("PENDING");
  const [keterangan, setKeterangan] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setBuyerName("");
    setNominalStr("");
    setKeterangan("");
    setSelectedFileName(null);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setError("Nama buyer wajib diisi.");
      return;
    }
    const nominal = parseInt(nominalStr.replace(/\D/g, ""), 10);
    if (!nominal || nominal <= 0) {
      setError("Nominal pembayaran harus lebih dari 0.");
      return;
    }

    const uniqueId = `pay-manual-${Date.now().toString().slice(-6)}`;
    const ref = `MANUAL-${Date.now().toString().slice(-6)}`;

    // Format waktu upload seragam dengan format buyer (contoh: "18 Okt, 10:45 WIB")
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const [, month, day] = paymentDate.split("-");
    const monthsIndo = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const monthName = monthsIndo[parseInt(month, 10) - 1] || month;
    const timeFormatted = `${parseInt(day, 10)} ${monthName}, ${hours}:${minutes} WIB`;

    const newItem: PaymentItem = {
      id: uniqueId,
      buyerName: buyerName.trim(),
      buyerUsername: `@${buyerName.trim().toLowerCase().replace(/\s+/g, "")}`,
      batchCode: batchCode.trim().toUpperCase(),
      nominal,
      paymentMethod,
      uploadTime: timeFormatted,
      uploadDate: paymentDate,
      source: "Admin",
      status,
      keterangan: keterangan.trim() || "Pembayaran manual via admin",
      proofImageUrl: getReceiptImageUrl(paymentMethod, nominal, buyerName, ref),
      proofDetail: {
        bankSender: `${paymentMethod} (Input Manual)`,
        senderName: buyerName.trim().toUpperCase(),
        accountNumberMasked: "Manual Admin Input",
        targetAccount: "Ceciz GO Admin Kas",
        referenceNumber: ref,
        transferTime: timeFormatted,
        notes: keterangan.trim() || "Input Pembayaran Manual Admin",
      },
      verifiedAt: status === "APPROVED" ? "Hari ini, otomatis" : undefined,
      verifiedBy: status === "APPROVED" ? "Admin (Manual)" : undefined,
    };

    onAddPayment(newItem);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-6 rounded-[24px] border border-[#FBCFE8]/60 bg-white shadow-2xl">
        {/* Header */}
        <div>
          <DialogTitle className="text-[18px] font-bold text-[#18181B] tracking-tight">
            Tambah Pembayaran Manual
          </DialogTitle>
          <DialogDescription className="text-xs text-[#71717A] mt-0.5">
            Pembayaran buyer melalui admin (tunai / transfer bank langsung)
          </DialogDescription>
        </div>

        {error && (
          <div className="mt-2 p-2.5 rounded-[12px] bg-rose-50 border border-rose-200 text-xs font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Buyer Name */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Buyer <span className="text-[#EC4899]">*</span>
              </label>
              <Input
                value={buyerName}
                onChange={(e) => {
                  setBuyerName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Nama buyer..."
                className="h-10 text-xs rounded-[12px] border-[#FCE7F3] focus-visible:ring-[#EC4899]"
              />
            </div>

            {/* Batch Code */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Batch <span className="text-[#EC4899]">*</span>
              </label>
              <Input
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="Contoh: CH-025"
                className="h-10 text-xs rounded-[12px] border-[#FCE7F3] focus-visible:ring-[#EC4899]"
              />
            </div>

            {/* Nominal */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Nominal (Rp) <span className="text-[#EC4899]">*</span>
              </label>
              <Input
                value={nominalStr}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setNominalStr(
                    val ? parseInt(val, 10).toLocaleString("id-ID") : "",
                  );
                  if (error) setError(null);
                }}
                placeholder="Rp 0"
                className="h-10 text-xs rounded-[12px] border-[#FCE7F3] focus-visible:ring-[#EC4899]"
              />
            </div>

            {/* Metode Pembayaran */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Metode Pembayaran
              </label>
              <Select
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              >
                <SelectTrigger className="h-10 text-xs rounded-[12px] border-[#FCE7F3] cursor-pointer">
                  <SelectValue placeholder="Pilih Metode" />
                </SelectTrigger>
                <SelectContent className="rounded-[12px] border-[#FCE7F3]">
                  <SelectItem value="BCA" className="text-xs">
                    BCA
                  </SelectItem>
                  <SelectItem value="QRIS" className="text-xs">
                    QRIS
                  </SelectItem>
                  <SelectItem value="SeaBank" className="text-xs">
                    SeaBank
                  </SelectItem>
                  <SelectItem value="ShopeePay" className="text-xs">
                    ShopeePay
                  </SelectItem>
                  <SelectItem value="Tunai / Cash" className="text-xs">
                    Tunai / Cash
                  </SelectItem>
                  <SelectItem value="Lainnya" className="text-xs">
                    Lainnya
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tanggal Pembayaran */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Tanggal Pembayaran
              </label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="h-10 text-xs rounded-[12px] border-[#FCE7F3] focus-visible:ring-[#EC4899]"
              />
            </div>

            {/* Bukti Pembayaran (File Upload) */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Bukti Pembayaran{" "}
                <span className="text-[#A1A1AA] font-normal">(opsional)</span>
              </label>
              <label className="h-10 px-3 rounded-[12px] border border-[#FCE7F3] bg-white hover:bg-[#FFF5FA] flex items-center justify-between cursor-pointer transition-colors text-xs text-[#71717A]">
                <span className="truncate max-w-[150px]">
                  {selectedFileName || "Pilih file struk..."}
                </span>
                <UploadCloud className="w-4 h-4 text-[#EC4899] shrink-0" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Status Awal Transaksi */}
          <div>
            <label className="text-xs font-bold text-[#18181B] block mb-1">
              Status Awal
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("PENDING")}
                className={`py-2 px-3 rounded-[10px] text-xs font-medium border text-center transition-all cursor-pointer ${
                  status === "PENDING"
                    ? "bg-[#E0F2FE] border-[#0284C7] text-[#0284C7] font-semibold"
                    : "border-zinc-200 text-[#71717A] hover:bg-zinc-50"
                }`}
              >
                Menunggu Verifikasi
              </button>
              <button
                type="button"
                onClick={() => setStatus("APPROVED")}
                className={`py-2 px-3 rounded-[10px] text-xs font-medium border text-center transition-all cursor-pointer ${
                  status === "APPROVED"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold"
                    : "border-zinc-200 text-[#71717A] hover:bg-zinc-50"
                }`}
              >
                Langsung Disetujui
              </button>
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="text-xs font-bold text-[#18181B] block mb-1">
              Keterangan
            </label>
            <Textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Catatan tambahan (contoh: Pelunasan 2 pcs PC, transfer ATM manual)..."
              rows={2}
              className="text-xs rounded-[12px] border-[#FCE7F3] focus-visible:ring-[#EC4899]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-9 px-4 rounded-[12px] border-zinc-200 hover:bg-zinc-50 text-xs font-medium cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="h-9 px-4 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Pembayaran</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
