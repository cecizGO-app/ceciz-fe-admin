import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "./formatters";
import type { FinancialKpiMetrics } from "@/types/reports";

interface FinancialKpiCardsProps {
  stats: FinancialKpiMetrics;
}

export const FinancialKpiCards: React.FC<FinancialKpiCardsProps> = ({
  stats,
}) => {
  const cards = [
    {
      id: "revenue",
      title: "Revenue",
      value: stats.revenue,
      icon: ArrowDownLeft,
      iconBg: "bg-sky-50 text-sky-600 border border-sky-100",
      helper:
        stats.revenueTrend !== undefined
          ? `${stats.revenueTrend > 0 ? "+" : ""}${stats.revenueTrend}% vs bln lalu`
          : undefined,
    },
    {
      id: "cost",
      title: "Cost",
      value: stats.cost,
      icon: ArrowUpRight,
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
      helper:
        stats.costTrend !== undefined
          ? `+${stats.costTrend}% vs bln lalu`
          : undefined,
    },
    {
      id: "gross-profit",
      title: "Gross Profit",
      value: stats.grossProfit,
      icon: CircleDollarSign,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      helper:
        stats.grossProfitTrend !== undefined
          ? `+${stats.grossProfitTrend}% estimasi`
          : undefined,
    },
    {
      id: "net-profit",
      title: "Net Profit",
      value: stats.netProfit,
      icon: Activity,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      helper:
        stats.netProfitTrend !== undefined
          ? `+${stats.netProfitTrend}% margin sehat`
          : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.id}
            size="sm"
            className="gap-0 rounded-[18px] bg-white border border-[#FBCFE8]/60 p-4 sm:p-4.5 flex flex-col justify-between shadow-2xs hover:border-[#EC4899]/60 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#71717A]">
                {card.title}
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${card.iconBg}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2.5">
              <p className="text-[20px] sm:text-[22px] font-bold text-[#18181B] tracking-tight">
                {formatRupiah(card.value)}
              </p>
              {card.helper && (
                <p className="text-[11px] text-[#71717A] mt-0.5">
                  {card.helper}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
