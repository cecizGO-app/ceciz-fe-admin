import React from "react";
import { Card } from "@/components/ui/card";
import type { BatchStats } from "./types";

interface BatchStatsCardsProps {
  stats: BatchStats;
}

export const BatchStatsCards: React.FC<BatchStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Batch Aktif */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/40 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Total Batch Aktif</span>
        </div>
        <div className="text-[28px] sm:text-[32px] font-bold text-[#18181B] tracking-tight mt-1">
          {stats.activeBatches}
        </div>
        <div className="text-xs text-[#71717A]">batch Open</div>
      </Card>

      {/* Card 2: Total PC Diproses */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/40 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <span>Total PC Diproses</span>
        </div>
        <div className="text-[28px] sm:text-[32px] font-bold text-[#18181B] tracking-tight mt-1">
          {stats.totalPc}
        </div>
        <div className="text-xs text-[#71717A]">PC berjalan</div>
      </Card>

      {/* Card 3: Menunggu Kalkulasi Laba */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/40 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>Menunggu Kalkulasi Laba</span>
        </div>
        <div className="text-[28px] sm:text-[32px] font-bold text-[#18181B] tracking-tight mt-1">
          {stats.waitingCalculation}
        </div>
        <div className="text-xs text-[#71717A]">sudah Arrive ID, laba belum diinput</div>
      </Card>

      {/* Card 4: Batch Diarsipkan */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/40 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-zinc-400 shrink-0" />
          <span>Batch Diarsipkan</span>
        </div>
        <div className="text-[28px] sm:text-[32px] font-bold text-[#18181B] tracking-tight mt-1">
          {stats.archivedBatches}
        </div>
        <div className="text-xs text-[#71717A]">batch Done / Archived</div>
      </Card>
    </div>
  );
};

export default BatchStatsCards;
