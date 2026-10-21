import React from "react";
import { Eye, FileText, CheckCircle2 } from "lucide-react";
import { CountryFlag } from "@/components/icons/CountryFlag";
import type { TaxInvoiceItem } from "./types";

interface TaxInvoiceCardProps {
  item: TaxInvoiceItem;
  onViewDetail: (item: TaxInvoiceItem) => void;
}

export const TaxInvoiceCard: React.FC<TaxInvoiceCardProps> = ({
  item,
  onViewDetail,
}) => {
  // Render status badge
  const renderStatusBadge = () => {
    switch (item.status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case "Unpaid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Unpaid
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Overdue
          </span>
        );
    }
  };

  // Render left footer indicator
  const renderFooterIndicator = () => {
    if (item.status === "Approved") {
      const bankLabel = item.bankName || "BCA";
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
          <span>Terverifikasi ({bankLabel})</span>
        </span>
      );
    }

    if (item.hasProof && item.status === "Pending") {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600">
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>Ada bukti transfer</span>
        </span>
      );
    }

    return (
      <span className="text-xs text-[#71717A] font-normal">Belum upload</span>
    );
  };

  const isOverdue = item.status === "Overdue";

  return (
    <div className="bg-white rounded-[20px] p-5 border border-[#FBCFE8]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      {/* Top Header Row: Invoice ID, Buyer Name, Handle, and Status Badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-sm font-bold text-[#18181B] tracking-tight">
            {item.id}
          </span>
          <div className="text-xs text-[#18181B] mt-0.5">
            <span className="font-semibold">{item.buyerName}</span>{" "}
            <span className="text-[#71717A]">{item.buyerHandle}</span>
          </div>
        </div>
        {renderStatusBadge()}
      </div>

      {/* Batch Tags Row with Country Flags */}
      <div className="flex flex-wrap items-center gap-1.5">
        {item.batches.map((batch, idx) => (
          <span
            key={`${batch.batchCode}-${idx}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF5FA] border border-[#FBCFE8] text-[11px] font-semibold text-[#EC4899]"
          >
            <CountryFlag code={batch.country} className="w-4 h-2.5" />
            <span>{batch.batchCode}</span>
          </span>
        ))}
      </div>

      {/* Amounts and Deadline Row */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <span className="text-[11px] text-[#71717A] font-medium block">
            Total tagihan
          </span>
          <span className="text-sm font-bold text-[#18181B] tracking-tight block">
            Rp {item.totalAmount.toLocaleString("id-ID")}
          </span>
          {isOverdue && item.penaltyAmount > 0 && (
            <span className="text-[11px] font-semibold text-rose-600 block mt-0.5">
              + Denda Rp {item.penaltyAmount.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        <div>
          <span className="text-[11px] text-[#71717A] font-medium block">
            Deadline
          </span>
          <span
            className={`text-xs font-semibold block mt-0.5 ${
              isOverdue ? "text-rose-600 font-bold" : "text-[#18181B]"
            }`}
          >
            {item.deadline}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#FCE7F3] pt-3.5 flex items-center justify-between gap-2">
        {/* Left Status Indicator */}
        <div className="min-w-0">{renderFooterIndicator()}</div>

        {/* Right Action Button */}
        <button
          type="button"
          onClick={() => onViewDetail(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-xs font-semibold text-[#EC4899] shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Lihat Detail & Bukti</span>
        </button>
      </div>
    </div>
  );
};
