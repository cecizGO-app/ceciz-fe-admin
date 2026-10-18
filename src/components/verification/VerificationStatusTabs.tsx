import React from "react";
import type { StatusTab } from "./types";

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
  const tabs: { key: StatusTab; label: string; count?: number }[] = [
    { key: "PENDING", label: "Menunggu Verifikasi", count: pendingCount },
    { key: "APPROVED", label: "Disetujui", count: approvedCount },
    { key: "REJECTED", label: "Ditolak", count: rejectedCount },
    { key: "ALL", label: "Semua Data" },
  ];

  return (
    <div className="flex items-center gap-6 border-b border-[#FCE7F3] overflow-x-auto no-scrollbar pt-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`pb-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors relative cursor-pointer ${
              isActive ? "text-[#EC4899]" : "text-[#71717A] hover:text-[#18181B]"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive ? "bg-[#FCE7F3] text-[#EC4899]" : "bg-zinc-100 text-[#71717A]"
                }`}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EC4899] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
