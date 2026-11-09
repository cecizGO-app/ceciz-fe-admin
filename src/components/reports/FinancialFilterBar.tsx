import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FinancialFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  periodFilter: string;
  onPeriodChange: (value: string) => void;
  countryFilter: string;
  onCountryChange: (value: string) => void;
  batchFilter: string;
  onBatchChange: (value: string) => void;
  onReset?: () => void;
}

export const FinancialFilterBar: React.FC<FinancialFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  periodFilter,
  onPeriodChange,
  countryFilter,
  onCountryChange,
  batchFilter,
  onBatchChange,
  onReset,
}) => {
  const isFiltered =
    Boolean(searchQuery) ||
    periodFilter !== "ALL" ||
    countryFilter !== "ALL" ||
    batchFilter !== "ALL";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white p-2.5 rounded-[16px] border border-[#FBCFE8]/60 shadow-2xs">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA] pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search records..."
          className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899] bg-[#FFF5FA]/20"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Period Dropdown */}
        <div className="w-full sm:w-36">
          <Select value={periodFilter} onValueChange={onPeriodChange}>
            <SelectTrigger size="sm" className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Periode</SelectItem>
              <SelectItem value="TAX_1_3">TAX 1-3</SelectItem>
              <SelectItem value="AUG_2026">Agustus 2026</SelectItem>
              <SelectItem value="JUL_2026">Juli 2026</SelectItem>
              <SelectItem value="JUN_2026">Juni 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Country Dropdown */}
        <div className="w-full sm:w-32">
          <Select value={countryFilter} onValueChange={onCountryChange}>
            <SelectTrigger size="sm" className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Negara</SelectItem>
              <SelectItem value="CH">🇨🇳 China (CH)</SelectItem>
              <SelectItem value="KR">🇰🇷 Korea (KR)</SelectItem>
              <SelectItem value="TH">🇹🇭 Thai (TH)</SelectItem>
              <SelectItem value="JP">🇯🇵 Jepang (JP)</SelectItem>
              <SelectItem value="INA">🇮🇩 Indonesia (INA)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Batch Dropdown */}
        <div className="w-full sm:w-32">
          <Select value={batchFilter} onValueChange={onBatchChange}>
            <SelectTrigger size="sm" className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Batch</SelectItem>
              <SelectItem value="CH-022">CH-022</SelectItem>
              <SelectItem value="KR-017">KR-017</SelectItem>
              <SelectItem value="TH-009">TH-009</SelectItem>
              <SelectItem value="JP-003">JP-003</SelectItem>
              <SelectItem value="INA-004">INA-004</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isFiltered && onReset && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 text-xs text-[#71717A] hover:text-[#EC4899] px-2.5 rounded-[10px]"
            title="Reset filter"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

