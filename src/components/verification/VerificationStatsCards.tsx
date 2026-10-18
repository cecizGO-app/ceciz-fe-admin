import React from "react";
import { Card } from "@/components/ui/card";
import type { VerificationStats } from "./types";

interface VerificationStatsCardsProps {
  stats: VerificationStats;
}

function formatRupiah(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(val);
}

export const VerificationStatsCards: React.FC<VerificationStatsCardsProps> = ({
  stats,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Menunggu Verifikasi */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>Menunggu Verifikasi</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[28px] sm:text-[32px] font-bold text-[#18181B] tracking-tight">
            {stats.waitingCount}
          </span>
          <span className="text-xs font-medium text-[#71717A]">
            bukti bayar
          </span>
        </div>
        <div className="text-xs text-[#71717A]">
          +{stats.waitingTodayCount} diunggah hari ini
        </div>
      </Card>

      {/* Card 2: Disetujui Hari Ini */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Disetujui Hari Ini</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[28px] sm:text-[32px] font-bold text-[#18181B] tracking-tight">
            {stats.approvedTodayCount}
          </span>
          <span className="text-xs font-medium text-[#71717A]">
            pembayaran
          </span>
        </div>
        <div className="text-xs text-[#71717A]">
          Total Rp {formatRupiah(stats.approvedTodayAmount)}
        </div>
      </Card>

      {/* Card 3: Ditolak Hari Ini */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>Ditolak Hari Ini</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[28px] sm:text-[32px] font-bold text-[#18181B] tracking-tight">
            {stats.rejectedTodayCount}
          </span>
          <span className="text-xs font-medium text-[#71717A]">
            pembayaran
          </span>
        </div>
        <div className="text-xs text-[#71717A]">
          Perlu konfirmasi buyer
        </div>
      </Card>

      {/* Card 4: Total Terverifikasi Bulan Ini */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-[#EC4899] shrink-0" />
          <span>Total Terverifikasi Bulan Ini</span>
        </div>
        <div className="mt-1">
          <span className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight">
            Rp {formatRupiah(stats.totalMonthlyVerifiedAmount)}
          </span>
        </div>
        <div className="text-xs text-[#71717A]">
          Bulan {stats.monthName}
        </div>
      </Card>
    </div>
  );
};
