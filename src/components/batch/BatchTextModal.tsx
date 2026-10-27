import React, { useState } from "react";
import { Check, Copy, Share2, MessageCircle, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface BatchShareItem {
  buyerName: string;
  buyerUsername?: string;
  itemName: string;
  qty: number;
  hargaBersih: number;
}

export interface BatchTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchCode: string;
  batchName: string;
  countryName: string;
  countryCode: string;
  currency: string;
  batchDate: string;
  warehouse: string;
  proxy: string;
  totalQty: number;
  totalTagihan: number;
  catatan?: string;
  items: BatchShareItem[];
  onBackToList?: () => void;
}

export function formatShareCurrency(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

export function generateBatchShareText(props: {
  batchCode: string;
  batchName: string;
  countryName: string;
  countryCode: string;
  currency: string;
  batchDate: string;
  warehouse: string;
  proxy: string;
  totalQty: number;
  totalTagihan: number;
  catatan?: string;
  items: BatchShareItem[];
}): string {
  const {
    batchCode,
    batchName,
    countryName,
    batchDate,
    warehouse,
    proxy,
    totalQty,
    totalTagihan,
    catatan,
    items,
  } = props;

  const lines: string[] = [];
  lines.push(`✨ CECIZ GO — BATCH RELEASE ✨`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📦 [${batchCode}] ${batchName}`);
  lines.push(`🌏 Asal: ${countryName}`);
  lines.push(`📅 Tanggal: ${batchDate || new Date().toISOString().split("T")[0]}`);
  if (warehouse) lines.push(`🏢 Warehouse: ${warehouse}`);
  if (proxy) lines.push(`✈️ Proxy / CO: ${proxy}`);
  lines.push(``);
  lines.push(`📋 DAFTAR PESANAN & TAGIHAN:`);

  items.forEach((item, idx) => {
    const buyerTag = item.buyerUsername
      ? item.buyerUsername.startsWith("@")
        ? item.buyerUsername
        : `@${item.buyerUsername}`
      : `@${item.buyerName || "Buyer"}`;
    const name = item.itemName || "Item Photocard / Merch";
    lines.push(
      `${idx + 1}. ${buyerTag} — ${name} (${item.qty} pcs)\n   Tagihan: ${formatShareCurrency(item.hargaBersih)}`,
    );
  });

  lines.push(``);
  lines.push(`📊 RINGKASAN BATCH:`);
  lines.push(`• Total Items: ${totalQty} pcs`);
  lines.push(`• Total Tagihan Batch: ${formatShareCurrency(totalTagihan)}`);
  if (catatan) {
    lines.push(`• Catatan: ${catatan}`);
  }

  lines.push(``);
  lines.push(`💳 METODE PEMBAYARAN:`);
  lines.push(`• BCA: 869-123-4567 a.n Ceciz Group Order`);
  lines.push(`• Mandiri: 137-00-9876543-2 a.n Ceciz Group Order`);
  lines.push(`• Seabank / ShopeePay / QRIS: Hubungi Admin`);
  lines.push(``);
  lines.push(`⏰ PERATURAN & DEADLINE PEMBAYARAN:`);
  lines.push(`• Pembayaran wajib lunas maksimal 1x24 jam setelah rekap dirilis.`);
  lines.push(`• Keterlambatan dikenakan denda keterlambatan Rp2.000/hari.`);
  lines.push(`• Mohon upload bukti transfer ke website Ceciz atau konfirmasi ke grup.`);
  lines.push(`Terima kasih banyak atas partisipasinya! 🙏✨`);

  return lines.join("\n");
}

export const BatchTextModal: React.FC<BatchTextModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    batchCode,
    batchName,
    countryName,
    totalQty,
    totalTagihan,
    onBackToList,
  } = props;

  const [copied, setCopied] = useState(false);
  const [customText, setCustomText] = useState(() => generateBatchShareText(props));

  // Update text when modal opens or props change
  React.useEffect(() => {
    if (isOpen) {
      setCustomText(generateBatchShareText(props));
      setCopied(false);
    }
  }, [isOpen, props.batchCode, props.items.length]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement("textarea");
      textarea.value = customText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWA = () => {
    const encoded = encodeURIComponent(customText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-6 rounded-[24px]">
        <DialogHeader className="space-y-1.5 pb-2 border-b border-[#FBCFE8]/60">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FFF5FA] border border-[#FBCFE8] text-[#EC4899]">
              <Share2 className="w-5 h-5" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold text-[#18181B]">
                Format Teks Siap-Share Batch
              </DialogTitle>
              <DialogDescription className="text-xs text-[#71717A]">
                Hasil kalkulasi batch telah diformat otomatis untuk dibagikan ke LINE / WhatsApp grup.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Meta Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FFF5FA] border border-[#FBCFE8]/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#EC4899] bg-white px-2 py-0.5 rounded-md border border-[#FBCFE8]">
              {batchCode}
            </span>
            <span className="font-semibold text-zinc-900 truncate max-w-[200px]">
              {batchName}
            </span>
            <span className="text-zinc-500 font-medium">({countryName})</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-zinc-800">
            <span>{totalQty} pcs</span>
            <span>&bull;</span>
            <span className="text-[#EC4899]">{formatShareCurrency(totalTagihan)}</span>
          </div>
        </div>

        {/* Formatted Textarea */}
        <div className="relative flex-1 min-h-[260px] my-1">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full h-full min-h-[260px] p-4 text-xs font-mono bg-zinc-900 text-zinc-100 rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#EC4899] leading-relaxed resize-none selection:bg-[#EC4899] selection:text-white"
            placeholder="Teks format share..."
          />
          <Button
            type="button"
            size="sm"
            onClick={handleCopy}
            className={`absolute top-3 right-3 text-xs font-semibold shadow-md transition-all gap-1.5 cursor-pointer ${
              copied
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-[#EC4899] hover:bg-[#db2777] text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks</span>
              </>
            )}
          </Button>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-zinc-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShareWA}
            className="w-full sm:w-auto text-xs font-semibold gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Kirim ke WhatsApp</span>
            <ExternalLink className="w-3 h-3 text-emerald-500" />
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs font-medium"
            >
              Tutup
            </Button>
            {onBackToList && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onClose();
                  onBackToList();
                }}
                className="text-xs font-semibold"
              >
                Lihat Daftar Batch
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchTextModal;
