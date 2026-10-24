import React from "react";
import type { TaxStats } from "@/types/tax";

interface TaxStatsCardsProps {
  stats: TaxStats;
}

export const TaxStatsCards: React.FC<TaxStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Periode Rilis Aktif */}
      <div className="bg-white rounded-[20px] p-5 border border-[#FBCFE8]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
          <span className="text-xs font-medium text-[#71717A]">
            Periode Rilis Aktif
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#18181B] tracking-tight">
            {stats.activePeriodName}
          </h3>
          <p className="text-xs text-[#71717A] mt-1 font-medium">
            {stats.activePeriodMonth}
          </p>
        </div>
      </div>

      {/* Card 2: Belum Lunas (Outstanding) */}
      <div className="bg-white rounded-[20px] p-5 border border-[#FBCFE8]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
          <span className="text-xs font-medium text-[#71717A]">
            Belum Lunas (Outstanding)
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#18181B] tracking-tight">
            Rp {stats.unpaidAmount.toLocaleString("id-ID")}
          </h3>
          <p className="text-xs text-[#71717A] mt-1 font-medium">
            {stats.unpaidCount} invoice unpaid
          </p>
        </div>
      </div>

      {/* Card 3: Menunggu Verifikasi */}
      <div className="bg-white rounded-[20px] p-5 border border-[#FBCFE8]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span className="text-xs font-medium text-[#71717A]">
            Menunggu Verifikasi
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-[#18181B] tracking-tight">
              {stats.pendingCount}
            </span>
            <span className="text-xs font-normal text-[#71717A]">
              bukti bayar
            </span>
          </div>
          <p className="text-xs text-[#71717A] mt-1 font-medium">
            Perlu ditinjau admin
          </p>
        </div>
      </div>

      {/* Card 4: Pajak Terkumpul (Paid) */}
      <div className="bg-white rounded-[20px] p-5 border border-[#FBCFE8]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-xs font-medium text-[#71717A]">
            Pajak Terkumpul (Paid)
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#18181B] tracking-tight">
            Rp {stats.paidAmount.toLocaleString("id-ID")}
          </h3>
          <p className="text-xs text-[#71717A] mt-1 font-medium">
            Bulan berjalan
          </p>
        </div>
      </div>
    </div>
  );
};
