import React from "react";
import { CheckCircle2, Truck, Package, Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TeamActivityItem } from "./types";

interface TeamActivityCardProps {
  activities: TeamActivityItem[];
  className?: string;
}

export const TeamActivityCard: React.FC<TeamActivityCardProps> = ({
  activities,
  className,
}) => {
  const renderIcon = (type: TeamActivityItem["iconType"]) => {
    switch (type) {
      case "check":
        return (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0 bg-emerald-50 border-emerald-200 text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        );
      case "truck":
        return (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0 bg-blue-50 border-blue-200 text-blue-600">
            <Truck className="w-3.5 h-3.5" />
          </div>
        );
      case "package":
        return (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0 bg-purple-50 border-purple-200 text-purple-600">
            <Package className="w-3.5 h-3.5" />
          </div>
        );
      case "receipt":
        return (
          <div className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0 bg-amber-50 border-amber-200 text-amber-600">
            <Receipt className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <Card
      className={cn(
        "gap-2.5 rounded-[20px] p-4.5 sm:p-5 bg-white border border-[#FBCFE8]/50 shadow-[0_4px_20px_rgba(236,72,153,0.04)]",
        className,
      )}
    >
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-bold text-[#18181B]">
          Aktivitas Tim Terbaru
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-2.5">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-2.5 text-left">
            {renderIcon(activity.iconType)}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#18181B] leading-tight truncate">
                {activity.title}
              </p>
              <p className="text-[11px] text-[#71717A] leading-tight mt-0.5 truncate">
                {activity.subtitle}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
