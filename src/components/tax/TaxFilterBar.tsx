import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaxFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (value: string) => void;
  countryFilter: string;
  onCountryFilterChange: (value: string) => void;
}

export const TaxFilterBar: React.FC<TaxFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  periodFilter,
  onPeriodFilterChange,
  countryFilter,
  onCountryFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
      {/* Search Input Bar */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA] pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nomor invoice, buyer, batch, barang..."
          className="w-full h-10 pl-9 pr-4 rounded-[10px] border-[#FBCFE8] bg-white text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus-visible:ring-[#EC4899]"
        />
      </div>

      {/* Filter Controls: Status, Periode, Negara */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:w-auto shrink-0">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-[155px] h-10 rounded-[10px] border-[#FBCFE8] bg-white text-xs text-[#18181B] focus:ring-[#EC4899]/20 focus:border-[#EC4899]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-[#FBCFE8] shadow-card">
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          {/* Periode Filter */}
          <Select value={periodFilter} onValueChange={onPeriodFilterChange}>
            <SelectTrigger className="w-full sm:w-[165px] h-10 rounded-[10px] border-[#FBCFE8] bg-white text-xs text-[#18181B] focus:ring-[#EC4899]/20 focus:border-[#EC4899]">
              <SelectValue placeholder="Semua Periode" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-[#FBCFE8] shadow-card">
              <SelectItem value="ALL">Semua Periode</SelectItem>
              <SelectItem value="September 2026">September 2026</SelectItem>
              <SelectItem value="Agustus 2026">Agustus 2026</SelectItem>
              <SelectItem value="Juli 2026">Juli 2026</SelectItem>
            </SelectContent>
          </Select>

          {/* Country Filter */}
          <Select value={countryFilter} onValueChange={onCountryFilterChange}>
            <SelectTrigger className="w-full sm:w-[155px] h-10 rounded-[10px] border-[#FBCFE8] bg-white text-xs text-[#18181B] focus:ring-[#EC4899]/20 focus:border-[#EC4899]">
              <SelectValue placeholder="Semua Negara" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-[#FBCFE8] shadow-card">
              <SelectItem value="ALL">Semua Negara</SelectItem>
              <SelectItem value="CH">China (CH)</SelectItem>
              <SelectItem value="KR">Korea (KR)</SelectItem>
              <SelectItem value="TH">Thailand (TH)</SelectItem>
              <SelectItem value="JP">Jepang (JP)</SelectItem>
            </SelectContent>
          </Select>
      </div>
    </div>
  );
};
