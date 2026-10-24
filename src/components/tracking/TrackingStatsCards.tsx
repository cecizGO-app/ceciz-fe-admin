import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface TrackingStatItem {
  label: string;
  value: string;
  unit: string;
  note: string;
  dot: string;
}

interface TrackingStatsCardsProps {
  stats: TrackingStatItem[];
}

export const TrackingStatsCards: React.FC<TrackingStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((s) => (
        <Card
          key={s.label}
          className="p-5 flex flex-col gap-3 rounded-[24px] border-[#FBCFE8]/60 bg-white shadow-card"
        >
          <div className="flex items-center gap-2">
            <span className={cn("size-2 shrink-0 rounded-full", s.dot)} />
            <p className="text-xs text-[#71717A] font-medium">{s.label}</p>
          </div>
          <div>
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-[28px] font-bold text-[#18181B] tracking-tight tabular-nums">
                {s.value}
              </span>
              <span className="text-xs text-[#71717A]">{s.unit}</span>
            </p>
            <p className="mt-0.5 text-xs text-[#71717A]">{s.note}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
