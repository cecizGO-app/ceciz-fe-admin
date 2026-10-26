import React from "react";
import { Card } from "@/components/ui/card";
import type { TaxStats } from "@/types/tax";

interface TaxStatsCardsProps {
  stats: TaxStats;
}

export const TaxStatsCards: React.FC<TaxStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Periode Rilis Aktif */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
          <span>Periode Rilis Aktif</span>
        </div>
        <div className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight mt-1">
          {stats.activePeriodName}
        </div>
        <div className="text-xs text-[#71717A] font-medium">
          {stats.activePeriodMonth}
        </div>
      </Card>

      {/* Card 2: Belum Lunas (Outstanding) */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
          <span>Belum Lunas (Outstanding)</span>
        </div>
        <div className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight mt-1 truncate">
          Rp {stats.unpaidAmount.toLocaleString("id-ID")}
        </div>
        <div className="text-xs text-[#71717A] font-medium">
          {stats.unpaidCount} invoice unpaid
        </div>
      </Card>

      {/* Card 3: Menunggu Verifikasi */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>Menunggu Verifikasi</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight">
            {stats.pendingCount}
          </span>
          <span className="text-xs font-medium text-[#71717A]">
            bukti bayar
          </span>
        </div>
        <div className="text-xs text-[#71717A] font-medium">
          Perlu ditinjau admin
        </div>
      </Card>

      {/* Card 4: Pajak Terkumpul (Paid) */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Pajak Terkumpul (Paid)</span>
        </div>
        <div className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight mt-1 truncate">
          Rp {stats.paidAmount.toLocaleString("id-ID")}
        </div>
        <div className="text-xs text-[#71717A] font-medium">Bulan berjalan</div>
      </Card>
    </div>
  );
};
