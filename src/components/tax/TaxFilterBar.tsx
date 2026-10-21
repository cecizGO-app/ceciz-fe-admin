import React from "react";
import { Search } from "lucide-react";
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
    <div className="bg-white rounded-[20px] p-4 sm:p-5 border border-[#FBCFE8]/60 shadow-xs">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nomor invoice, buyer, batch, barang..."
            className="w-full h-10 pl-10 pr-4 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] placeholder:text-[#71717A] transition-all outline-none focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/20"
          />
        </div>

        {/* Filter Controls: Status, Periode, Negara */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:w-auto">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-[155px] h-10 rounded-[12px] border-[#FBCFE8] bg-white text-xs text-[#18181B] focus:ring-[#EC4899]/20 focus:border-[#EC4899]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-[#FBCFE8] shadow-card">
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="Pending">Pending (Verifikasi)</SelectItem>
              <SelectItem value="Unpaid">Unpaid (Belum Bayar)</SelectItem>
              <SelectItem value="Approved">Approved (Lunas)</SelectItem>
              <SelectItem value="Overdue">Overdue (Terlambat)</SelectItem>
            </SelectContent>
          </Select>

          {/* Period Filter (sesuai PRD: mencakup nama rilis & bulan periodik) */}
          <Select value={periodFilter} onValueChange={onPeriodFilterChange}>
            <SelectTrigger className="w-full sm:w-[170px] h-10 rounded-[12px] border-[#FBCFE8] bg-white text-xs text-[#18181B] focus:ring-[#EC4899]/20 focus:border-[#EC4899]">
              <SelectValue placeholder="Semua Periode" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-[#FBCFE8] shadow-card">
              <SelectItem value="ALL">Semua Periode</SelectItem>
              <SelectItem value="TAGIHAN TAX 2">TAGIHAN TAX 2 (Sep 2026)</SelectItem>
              <SelectItem value="TAGIHAN TAX 1">TAGIHAN TAX 1 (Agu 2026)</SelectItem>
            </SelectContent>
          </Select>

          {/* Country Filter */}
          <Select value={countryFilter} onValueChange={onCountryFilterChange}>
            <SelectTrigger className="w-full sm:w-[145px] h-10 rounded-[12px] border-[#FBCFE8] bg-white text-xs text-[#18181B] focus:ring-[#EC4899]/20 focus:border-[#EC4899]">
              <SelectValue placeholder="Semua Negara" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-[#FBCFE8] shadow-card">
              <SelectItem value="ALL">Semua Negara</SelectItem>
              <SelectItem value="CH">🇨🇳 China (CH)</SelectItem>
              <SelectItem value="KR">🇰🇷 Korea (KR)</SelectItem>
              <SelectItem value="TH">🇹🇭 Thailand (TH)</SelectItem>
              <SelectItem value="JP">🇯🇵 Jepang (JP)</SelectItem>
              <SelectItem value="INA">🇮🇩 Indonesia (INA)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
