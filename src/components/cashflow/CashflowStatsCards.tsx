import React from "react";
import { Card } from "@/components/ui/card";
import type { CashflowStats } from "@/types/cashflow";

interface CashflowStatsCardsProps {
  stats: CashflowStats;
  loading?: boolean;
}

const formatRupiah = (val: number): string => {
  return "Rp " + new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(val);
};

export const CashflowStatsCards: React.FC<CashflowStatsCardsProps> = ({
  stats,
  loading = false,
}) => {
  const isBalancePositive = stats.currentBalance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Saldo Kas Bersih */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isBalancePositive ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
          <span>Saldo Kas Bersih</span>
        </div>
        <div
          className={`text-[24px] sm:text-[28px] font-bold tracking-tight mt-1 truncate ${
            isBalancePositive ? "text-[#18181B]" : "text-rose-600"
          }`}
        >
          {loading ? "..." : formatRupiah(stats.currentBalance)}
        </div>
        <div className="text-xs text-[#71717A]">
          {isBalancePositive ? "Kas dalam kondisi surplus" : "Kas mengalami defisit"}
        </div>
      </Card>

      {/* 2. Total Pemasukan */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span>Total Pemasukan</span>
        </div>
        <div className="text-[24px] sm:text-[28px] font-bold text-emerald-600 tracking-tight mt-1 truncate">
          {loading ? "..." : formatRupiah(stats.totalIncome)}
        </div>
        <div className="text-xs text-[#71717A]">
          Pemasukan dari modal &amp; buyer
        </div>
      </Card>

      {/* 3. Total Pengeluaran */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>Total Pengeluaran</span>
        </div>
        <div className="text-[24px] sm:text-[28px] font-bold text-rose-600 tracking-tight mt-1 truncate">
          {loading ? "..." : formatRupiah(stats.totalExpense)}
        </div>
        <div className="text-xs text-[#71717A]">
          Packing, seller, ongkir &amp; tax
        </div>
      </Card>

      {/* 4. Total Transaksi */}
      <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <span>Aktivitas Transaksi</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight">
            {loading ? "..." : stats.transactionCount}
          </span>
          <span className="text-xs font-medium text-[#71717A]">
            catatan
          </span>
        </div>
        <div className="text-xs text-[#71717A]">
          Pencatatan kas operasional aktif
        </div>
      </Card>
    </div>
  );
};
