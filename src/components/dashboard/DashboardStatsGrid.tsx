import React from "react";
import { TrendingUp, AlertTriangle, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DashboardMetricStats } from "./types";

interface DashboardStatsGridProps {
  stats: DashboardMetricStats;
  onNavigateBatch?: () => void;
  onNavigateVerifikasi?: () => void;
  onNavigateTracking?: () => void;
  onNavigateTax?: () => void;
}

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({
  stats,
  onNavigateBatch,
  onNavigateVerifikasi,
  onNavigateTracking,
  onNavigateTax,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Batch Aktif (PRD: Total batch aktif) */}
      <Card
        onClick={onNavigateBatch}
        className="rounded-[20px] p-5 bg-white border border-[#FBCFE8]/50 shadow-[0_4px_20px_rgba(236,72,153,0.04)] hover:border-[#FBCFE8] hover:shadow-[0_8px_24px_rgba(236,72,153,0.08)] transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#71717A]">
            Batch Aktif
          </span>
          <Badge
            variant="success"
            className="gap-1 font-semibold text-[11px] h-6 px-2"
          >
            <TrendingUp className="w-3 h-3 text-[#16A34A]" />
            {stats.activeBatchesDiff}
          </Badge>
        </div>
        <div className="mt-3 flex items-baseline">
          <span className="text-3xl font-bold text-[#16A34A]">
            {stats.activeBatches}
          </span>
          <span className="text-xs font-medium text-[#71717A] ml-2">
            batch aktif
          </span>
        </div>
        <div className="mt-3 text-xs text-[#71717A] group-hover:text-[#EC4899] transition-colors flex items-center gap-1">
          <span>Buka batch &amp; kalkulasi</span>
        </div>
      </Card>

      {/* Card 2: Menunggu Verifikasi (PRD: Antrian bayar pending & denda) */}
      <Card
        onClick={onNavigateVerifikasi}
        className="rounded-[20px] p-5 bg-white border border-[#FBCFE8]/50 shadow-[0_4px_20px_rgba(236,72,153,0.04)] hover:border-[#FBCFE8] hover:shadow-[0_8px_24px_rgba(236,72,153,0.08)] transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#71717A]">
            Menunggu Verifikasi
          </span>
          <Badge
            variant="warning"
            className="gap-1 font-semibold text-[11px] h-6 px-2"
          >
            <TrendingUp className="w-3 h-3 text-[#D97706]" />
            {stats.pendingVerificationsDiff}
          </Badge>
        </div>
        <div className="mt-3 flex items-baseline">
          <span className="text-3xl font-bold text-[#D97706]">
            {stats.pendingVerifications}
          </span>
          <span className="text-xs font-medium text-[#71717A] ml-2">
            bukti bayar
          </span>
        </div>
        <div className="mt-3 text-xs text-[#DC2626] font-medium flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#DC2626]" />
          <span>{stats.overduePenaltyBuyers} buyer lewat deadline / denda</span>
        </div>
      </Card>

      {/* Card 3: Tracking Berjalan (PRD: 7 Tahap Tracking & WH ID) */}
      <Card
        onClick={onNavigateTracking}
        className="rounded-[20px] p-5 bg-white border border-[#FBCFE8]/50 shadow-[0_4px_20px_rgba(236,72,153,0.04)] hover:border-[#FBCFE8] hover:shadow-[0_8px_24px_rgba(236,72,153,0.08)] transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#71717A]">
            Tracking Berjalan
          </span>
          <Truck className="w-4 h-4 text-[#71717A]" />
        </div>
        <div className="mt-3 flex items-baseline">
          <span className="text-3xl font-bold text-[#18181B]">
            {stats.activeTrackingPackages}
          </span>
          <span className="text-xs font-medium text-[#71717A] ml-2">
            paket
          </span>
        </div>
        <div className="mt-3 text-xs text-[#71717A]">
          {stats.arrivedWarehousePackages} barang tiba di warehouse ID
        </div>
      </Card>

      {/* Card 4: Tagihan Tax Pending (PRD: Tagihan Tax Periodik Multi-Batch) */}
      <Card
        onClick={onNavigateTax}
        className="rounded-[20px] p-5 bg-white border border-[#FBCFE8]/50 shadow-[0_4px_20px_rgba(236,72,153,0.04)] hover:border-[#FBCFE8] hover:shadow-[0_8px_24px_rgba(236,72,153,0.08)] transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#71717A]">
            Tagihan Tax Pending
          </span>
          <span className="text-[11px] text-[#71717A]">
            s/d {stats.taxPeriodCutoff}
          </span>
        </div>
        <div className="mt-3 flex items-baseline">
          <span className="text-2xl font-bold text-[#EC4899]">
            {stats.pendingTaxAmount}
          </span>
        </div>
        <div className="mt-3 text-xs text-[#71717A]">
          {stats.pendingTaxInvoicesCount} invoice tax belum lunas
        </div>
      </Card>
    </div>
  );
};
