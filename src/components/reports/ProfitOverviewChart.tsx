import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { formatRupiah } from "./formatters";
import type { MonthlyProfitTrend } from "@/types/reports";

interface ProfitOverviewChartProps {
  trends: MonthlyProfitTrend[];
}

export const ProfitOverviewChart: React.FC<ProfitOverviewChartProps> = ({
  trends,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxVal = Math.max(...trends.map((t) => Math.max(t.revenue, t.profit * 2.5)), 25000000);

  return (
    <Card className="rounded-[20px] border border-[#FBCFE8]/60 shadow-xs bg-white">
      <CardHeader className="pb-2 border-b border-[#FBCFE8]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <CardTitle className="text-[17px] font-bold text-[#18181B] tracking-tight">
            Profit Overview
          </CardTitle>
          <CardDescription className="text-xs text-[#71717A]">
            Monthly revenue and profit trend
          </CardDescription>
        </div>

        {/* Legend indicator */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#60A5FA]" />
            <span className="text-[#71717A]">Revenue / Laba</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#EC4899]" />
            <span className="text-[#71717A]">Net Margin Target</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-4">
        {/* Relative Bar Container */}
        <div className="h-48 w-full flex items-end gap-3 sm:gap-6 pt-6 px-2">
          {trends.map((item, idx) => {
            const heightPercent = Math.round((item.revenue / maxVal) * 100);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.month}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-[#18181B] text-white text-[11px] py-1.5 px-2.5 rounded-[8px] shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <p className="font-semibold">{item.month} 2026</p>
                    <p className="text-sky-300">Rev: {formatRupiah(item.revenue)}</p>
                    <p className="text-emerald-300">Laba: {formatRupiah(item.profit)}</p>
                  </div>
                )}

                {/* Animated Bar with gentle rounded top */}
                <div
                  style={{ height: `${Math.max(heightPercent, 18)}%` }}
                  className={`w-full rounded-t-[10px] transition-all duration-300 relative ${
                    isHovered
                      ? "bg-[#3B82F6] shadow-md scale-y-[1.02]"
                      : "bg-[#60A5FA]/90 hover:bg-[#60A5FA]"
                  }`}
                >
                  {/* Subtle Top Cap highlight */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-white/30 rounded-t-[10px]" />
                </div>

                {/* Month Label */}
                <div className="mt-2 text-center">
                  <span
                    className={`text-[11px] font-medium transition-colors ${
                      isHovered ? "text-[#18181B] font-bold" : "text-[#71717A]"
                    }`}
                  >
                    {item.month}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 text-right">
          <span className="text-[10px] text-[#A1A1AA]">
            * Berdasarkan rekap penutupan periode laba resmi
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

