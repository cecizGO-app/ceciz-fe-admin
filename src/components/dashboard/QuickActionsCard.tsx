import React from "react";
import { Plus, ChevronRight, ClipboardCheck, Truck, Receipt, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuickActionsCardProps {
  pendingVerificationCount: number;
  onCreateBatch?: () => void;
  onNavigateVerifikasi?: () => void;
  onNavigateTracking?: () => void;
  onNavigateTax?: () => void;
  onNavigateLaporan?: () => void;
  className?: string;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  pendingVerificationCount,
  onCreateBatch,
  onNavigateVerifikasi,
  onNavigateTracking,
  onNavigateTax,
  onNavigateLaporan,
  className,
}) => {
  return (
    <Card
      className={cn(
        "gap-2.5 rounded-[20px] p-4 sm:p-5 bg-white border border-[#FBCFE8]/50 shadow-[0_4px_20px_rgba(236,72,153,0.04)]",
        className,
      )}
    >
      <CardHeader className="p-0">
        <CardTitle className="text-sm sm:text-base font-bold text-[#18181B]">
          Aksi Cepat
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-2">
        {/* Tombol Utama: + Tambah Batch Baru */}
        <Button
          type="button"
          onClick={onCreateBatch}
          className="w-full h-9 sm:h-9.5 bg-gradient-to-r from-[#EC4899] to-[#DB2777] hover:from-[#DB2777] hover:to-[#BE185D] text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Batch Baru</span>
        </Button>

        {/* List Aksi Cepat PRD */}
        <div className="space-y-1.5 pt-0.5">
          {/* 1. Verifikasi Pembayaran */}
          <button
            type="button"
            onClick={onNavigateVerifikasi}
            className="w-full px-3 py-2 rounded-xl border border-[#FBCFE8]/60 bg-white hover:bg-[#FFF5FA] flex items-center justify-between transition-colors cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <ClipboardCheck className="w-4 h-4 text-[#71717A] group-hover:text-[#EC4899] transition-colors shrink-0" />
              <span className="text-xs font-medium text-[#18181B] truncate">
                Verifikasi Pembayaran
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <Badge
                variant="destructive"
                className="px-1.5 py-0 h-4.5 text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200"
              >
                {pendingVerificationCount}
              </Badge>
              <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* 2. Update Tracking Logistik */}
          <button
            type="button"
            onClick={onNavigateTracking}
            className="w-full px-3 py-2 rounded-xl border border-[#FBCFE8]/60 bg-white hover:bg-[#FFF5FA] flex items-center justify-between transition-colors cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Truck className="w-4 h-4 text-[#71717A] group-hover:text-[#EC4899] transition-colors shrink-0" />
              <span className="text-xs font-medium text-[#18181B] truncate">
                Update Tracking Logistik
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
          </button>

          {/* 3. Release Tagihan Tax */}
          <button
            type="button"
            onClick={onNavigateTax}
            className="w-full px-3 py-2 rounded-xl border border-[#FBCFE8]/60 bg-white hover:bg-[#FFF5FA] flex items-center justify-between transition-colors cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Receipt className="w-4 h-4 text-[#71717A] group-hover:text-[#EC4899] transition-colors shrink-0" />
              <span className="text-xs font-medium text-[#18181B] truncate">
                Release Tagihan Tax
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
          </button>

          {/* 4. Laporan Laba & Keuangan */}
          <button
            type="button"
            onClick={onNavigateLaporan}
            className="w-full px-3 py-2 rounded-xl border border-[#FBCFE8]/60 bg-white hover:bg-[#FFF5FA] flex items-center justify-between transition-colors cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <BarChart3 className="w-4 h-4 text-[#71717A] group-hover:text-[#EC4899] transition-colors shrink-0" />
              <span className="text-xs font-medium text-[#18181B] truncate">
                Laporan Laba &amp; Keuangan
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
