import React from "react";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PaymentReviewStats } from "./types";

interface PaymentReviewCardProps {
  stats: PaymentReviewStats;
  onNavigateVerifikasi?: () => void;
  className?: string;
}

export const PaymentReviewCard: React.FC<PaymentReviewCardProps> = ({
  stats,
  onNavigateVerifikasi,
  className,
}) => {
  const total = stats.total > 0 ? stats.total : 1;
  const pendingPct = (stats.pending / total) * 100;
  const approvedPct = (stats.approved / total) * 100;
  const rejectedPct = (stats.rejected / total) * 100;

  return (
    <Card
      className={cn(
        "gap-2.5 rounded-[20px] p-4 sm:p-5 bg-white border border-[#FBCFE8]/50 shadow-[0_4px_20px_rgba(236,72,153,0.04)]",
        className,
      )}
    >
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base font-bold text-[#18181B]">
          Review Pembayaran Hari Ini
        </CardTitle>
        <span className="text-[11px] font-medium text-[#71717A]">
          {stats.total} bukti
        </span>
      </CardHeader>

      <CardContent className="p-0 space-y-2.5">
        {/* Progress Bar Multi-Segment */}
        <div className="h-2 w-full bg-[#F4F4F5] rounded-full overflow-hidden flex">
          <div
            className="h-full bg-amber-400 transition-all duration-500"
            style={{ width: `${pendingPct}%` }}
            title={`Pending: ${stats.pending}`}
          />
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${approvedPct}%` }}
            title={`Disetujui: ${stats.approved}`}
          />
          <div
            className="h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${rejectedPct}%` }}
            title={`Ditolak: ${stats.rejected}`}
          />
        </div>

        {/* 3 Metric Mini Cards */}
        <div className="grid grid-cols-3 gap-2">
          {/* Pending */}
          <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-center">
            <span className="block text-base sm:text-lg font-bold text-amber-600 leading-tight">
              {stats.pending}
            </span>
            <span className="block text-[11px] font-medium text-amber-700/80 leading-tight mt-0.5">
              Pending
            </span>
          </div>

          {/* Approved */}
          <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-center">
            <span className="block text-base sm:text-lg font-bold text-emerald-600 leading-tight">
              {stats.approved}
            </span>
            <span className="block text-[11px] font-medium text-emerald-700/80 leading-tight mt-0.5">
              Disetujui
            </span>
          </div>

          {/* Rejected */}
          <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-200/60 text-center">
            <span className="block text-base sm:text-lg font-bold text-rose-600 leading-tight">
              {stats.rejected}
            </span>
            <span className="block text-[11px] font-medium text-rose-700/80 leading-tight mt-0.5">
              Ditolak
            </span>
          </div>
        </div>

        {/* Action Button: Buka Antrean Verifikasi */}
        <button
          type="button"
          onClick={onNavigateVerifikasi}
          className="w-full h-8 px-3 rounded-xl border border-[#FBCFE8]/70 bg-[#FFF5FA]/60 hover:bg-[#FFF0F7] text-[#EC4899] font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-1.5">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#EC4899]" />
            <span>Buka Antrean Verifikasi</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#EC4899] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </CardContent>
    </Card>
  );
};
