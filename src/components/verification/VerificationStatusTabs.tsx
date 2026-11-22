import React from "react";
import type { StatusTab } from "@/types/verification";

interface VerificationStatusTabsProps {
  activeTab: StatusTab;
  onTabChange: (tab: StatusTab) => void;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export const VerificationStatusTabs: React.FC<VerificationStatusTabsProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
  approvedCount,
  rejectedCount,
}) => {
  const totalCount = pendingCount + approvedCount + rejectedCount;
  const tabs: { key: StatusTab; label: string; count: number }[] = [
    { key: "PENDING", label: "Pending", count: pendingCount },
    { key: "APPROVED", label: "Approved", count: approvedCount },
    { key: "REJECTED", label: "Rejected", count: rejectedCount },
    { key: "ALL", label: "All", count: totalCount },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-[12px] bg-[#FFF5FA] border border-[#FCE7F3] overflow-x-auto no-scrollbar shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`h-8 px-3 rounded-[9px] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? "bg-[#EC4899] text-white shadow-2xs"
                : "text-[#71717A] hover:text-[#18181B] hover:bg-white/70"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isActive
                  ? "bg-white/25 text-white"
                  : "bg-[#FCE7F3] text-[#BE185D]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
