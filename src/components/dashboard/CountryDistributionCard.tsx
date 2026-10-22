import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CountryDistribution } from "./types";

interface CountryDistributionCardProps {
  distributions: CountryDistribution[];
  periodLabel: string;
  className?: string;
}

export const CountryDistributionCard: React.FC<CountryDistributionCardProps> = ({
  distributions,
  periodLabel,
  className,
}) => {
  return (
    <Card
      className={cn(
        "gap-2.5 rounded-[20px] p-5 sm:p-6 bg-white border border-[#FBCFE8]/50 shadow-[0_4px_20px_rgba(236,72,153,0.04)]",
        className,
      )}
    >
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base font-bold text-[#18181B]">
          Distribusi Batch per Negara
        </CardTitle>
        <span className="text-xs text-[#71717A]">{periodLabel}</span>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {distributions.map((item) => (
          <div key={item.code} className="flex items-center">
            {/* Label Negara (5 Negara PRD: CH, KR, JP, TH, INA) */}
            <div className="w-28 shrink-0 flex items-center text-xs">
              <span className="font-bold text-[#18181B]">{item.code}</span>
              <span className="text-[#71717A] ml-1.5">{item.name}</span>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="flex-1 mx-3 h-3 bg-[#FFF5FA] border border-[#FCE7F3]/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EC4899] rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            {/* Jumlah Batch */}
            <div className="w-6 shrink-0 text-right text-xs font-bold text-[#18181B]">
              {item.count}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
