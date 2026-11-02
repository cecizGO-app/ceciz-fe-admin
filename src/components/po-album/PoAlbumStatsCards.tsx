import React from "react";
import { Card } from "@/components/ui/card";
import type { PoAlbumStats } from "@/types/po-album";

interface PoAlbumStatsCardsProps {
  stats: PoAlbumStats;
  activeBatchCount: number;
}

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

export const PoAlbumStatsCards: React.FC<PoAlbumStatsCardsProps> = ({
  stats,
  activeBatchCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Order Album */}
      <Card
        size="sm"
        className="p-5 sm:p-6 gap-2 rounded-panel bg-surface border border-border/60 shadow-card hover:shadow-hover transition-all"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-ink-2">
          <span className="w-2 h-2 rounded-full bg-info shrink-0" />
          <span>Total Order Album</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[24px] sm:text-[28px] font-bold text-ink tracking-tight tabular-nums">
            {stats.totalOrders}
          </span>
          <span className="text-xs font-medium text-ink-2">pesanan</span>
        </div>
        <div className="text-xs text-ink-2 font-medium">
          Di {activeBatchCount} batch album aktif
        </div>
      </Card>

      {/* Card 2: Menunggu Pelunasan FP */}
      <Card
        size="sm"
        className="p-5 sm:p-6 gap-2 rounded-panel bg-surface border border-border/60 shadow-card hover:shadow-hover transition-all"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-ink-2">
          <span className="w-2 h-2 rounded-full bg-warning shrink-0" />
          <span>Menunggu Pelunasan FP</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[24px] sm:text-[28px] font-bold text-ink tracking-tight tabular-nums">
            {stats.waitingFp}
          </span>
          <span className="text-xs font-medium text-ink-2">buyer</span>
        </div>
        <div className="text-xs text-ink-2 font-medium">
          DP lunas, menunggu jadwal FP
        </div>
      </Card>

      {/* Card 3: Checkout Web Open */}
      <Card
        size="sm"
        className="p-5 sm:p-6 gap-2 rounded-panel bg-surface border border-border/60 shadow-card hover:shadow-hover transition-all"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-ink-2">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          <span>Checkout Web Open</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[24px] sm:text-[28px] font-bold text-ink tracking-tight tabular-nums">
            {stats.coWebOpen}
          </span>
          <span className="text-xs font-medium text-ink-2">batch</span>
        </div>
        <div className="text-xs text-ink-2 font-medium">
          Siap di-checkout admin ke web seller
        </div>
      </Card>

      {/* Card 4: Total Terkumpul (DP+FP) */}
      <Card
        size="sm"
        className="p-5 sm:p-6 gap-2 rounded-panel bg-surface border border-border/60 shadow-card hover:shadow-hover transition-all"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-ink-2">
          <span className="w-2 h-2 rounded-full bg-success shrink-0" />
          <span>Total Terkumpul (DP+FP)</span>
        </div>
        <div className="text-[24px] sm:text-[28px] font-bold text-ink tracking-tight mt-1 truncate tabular-nums">
          {rp(stats.totalCollected)}
        </div>
        <div className="text-xs text-ink-2 font-medium">Bulan berjalan</div>
      </Card>
    </div>
  );
};

