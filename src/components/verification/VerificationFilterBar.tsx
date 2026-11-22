import React from "react";
import { Search, CheckCheck, XCircle, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { VerificationStatusTabs } from "./VerificationStatusTabs";
import type { StatusTab } from "@/types/verification";

interface VerificationFilterBarProps {
  activeTab: StatusTab;
  onTabChange: (tab: StatusTab) => void;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  methodFilter: string;
  onMethodFilterChange: (method: string) => void;
  batchFilter: string;
  onBatchFilterChange: (batch: string) => void;
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  availableBatches: string[];
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onClearSelection: () => void;
}

export const VerificationFilterBar: React.FC<VerificationFilterBarProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
  approvedCount,
  rejectedCount,
  searchQuery,
  onSearchChange,
  methodFilter,
  onMethodFilterChange,
  batchFilter,
  onBatchFilterChange,
  dateFilter,
  onDateFilterChange,
  availableBatches,
  selectedCount,
  onBulkApprove,
  onBulkReject,
  onClearSelection,
}) => {
  return (
    <div className="space-y-4">
      {/* Single Toolbar Row: [Tabs (Left)] — [Search Bar (Center)] — [Dropdowns (Right)] */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        <VerificationStatusTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          pendingCount={pendingCount}
          approvedCount={approvedCount}
          rejectedCount={rejectedCount}
        />

        {/* Search Input (Center) */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama buyer, batch, atau nominal..."
            className="h-10 pl-9 rounded-[10px] border-[#FBCFE8] bg-white text-xs placeholder:text-[#A1A1AA] focus-visible:ring-[#EC4899]"
          />
        </div>

        {/* Filter Dropdowns (Right) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex items-center gap-2 shrink-0">
          {/* Method Filter */}
          <Select value={methodFilter} onValueChange={onMethodFilterChange}>
            <SelectTrigger className="h-10 w-full xl:w-[132px] rounded-[10px] border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] cursor-pointer">
              <SelectValue placeholder="Semua Metode" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px] border-[#FCE7F3]">
              <SelectItem value="ALL" className="text-xs">
                Semua Metode
              </SelectItem>
              <SelectItem value="BCA" className="text-xs">
                BCA
              </SelectItem>
              <SelectItem value="QRIS" className="text-xs">
                QRIS
              </SelectItem>
              <SelectItem value="SeaBank" className="text-xs">
                SeaBank
              </SelectItem>
              <SelectItem value="ShopeePay" className="text-xs">
                ShopeePay
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Batch Filter */}
          <Select value={batchFilter} onValueChange={onBatchFilterChange}>
            <SelectTrigger className="h-10 w-full xl:w-[126px] rounded-[10px] border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] cursor-pointer">
              <SelectValue placeholder="Semua Batch" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px] border-[#FCE7F3]">
              <SelectItem value="ALL" className="text-xs">
                Semua Batch
              </SelectItem>
              {availableBatches.map((b) => (
                <SelectItem key={b} value={b} className="text-xs">
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="h-10 w-full xl:w-[124px] rounded-[10px] border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] cursor-pointer">
              <SelectValue placeholder="Semua Waktu" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px] border-[#FCE7F3]">
              <SelectItem value="ALL" className="text-xs">
                Semua Waktu
              </SelectItem>
              <SelectItem value="TODAY" className="text-xs">
                Hari Ini
              </SelectItem>
              <SelectItem value="YESTERDAY" className="text-xs">
                Kemarin
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedCount > 0 && (
        <div className="px-4 py-3 rounded-[12px] bg-[#FFF5FA] border border-[#FBCFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#BE185D]">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#EC4899] text-white font-bold text-[11px] shadow-2xs">
              {selectedCount}
            </span>
            <span>transaksi terpilih</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              size="sm"
              onClick={onBulkApprove}
              className="h-8 px-3.5 rounded-[9px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Setujui ({selectedCount})</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={onBulkReject}
              className="h-8 px-3.5 rounded-[9px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Tolak ({selectedCount})</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="h-8 px-3 rounded-[9px] border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#71717A] hover:text-[#18181B] text-xs font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              <span>Batal</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
