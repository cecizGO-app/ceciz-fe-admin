import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { CoWebStatus } from "@/types/po-album";

interface PoAlbumFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  payStatusFilter: string;
  onPayStatusFilterChange: (value: string) => void;
  coStatusFilter: string;
  onCoStatusFilterChange: (value: string) => void;
  countryFilter: string;
  onCountryFilterChange: (value: string) => void;
  coStatusList: CoWebStatus[];
}

export const PoAlbumFilterBar: React.FC<PoAlbumFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  payStatusFilter,
  onPayStatusFilterChange,
  coStatusFilter,
  onCoStatusFilterChange,
  countryFilter,
  onCountryFilterChange,
  coStatusList,
}) => {
  return (
    <Card
      size="sm"
      className="p-4 sm:p-5 rounded-panel bg-surface border border-border/60 shadow-2xs"
    >
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3">
        {/* Search Input Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-2 pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nomor batch, buyer, judul album, member..."
            className="w-full h-10 pl-10 pr-9 rounded-control border-border bg-surface text-xs font-medium text-ink placeholder:text-ink-3"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Hapus pencarian"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 hover:text-ink cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Select Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:w-auto">
          {/* Status Bayar Filter */}
          <Select
            value={payStatusFilter}
            onValueChange={onPayStatusFilterChange}
          >
            <SelectTrigger className="w-full sm:w-[170px] h-10 rounded-control border-border bg-surface text-xs text-ink">
              <SelectValue placeholder="Semua Status Bayar" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-border shadow-card">
              <SelectItem value="ALL">Semua Status Bayar</SelectItem>
              <SelectItem value="Pending">Pending (Belum Bayar)</SelectItem>
              <SelectItem value="DP Paid">DP Paid (Menunggu FP)</SelectItem>
              <SelectItem value="Paid (Lunas)">Paid (Lunas DP+FP)</SelectItem>
            </SelectContent>
          </Select>

          {/* Status CO Web Filter */}
          <Select
            value={coStatusFilter}
            onValueChange={onCoStatusFilterChange}
          >
            <SelectTrigger className="w-full sm:w-[170px] h-10 rounded-control border-border bg-surface text-xs text-ink">
              <SelectValue placeholder="Semua Status CO" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-border shadow-card">
              <SelectItem value="ALL">Semua Status CO</SelectItem>
              {coStatusList.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Negara Filter */}
          <Select
            value={countryFilter}
            onValueChange={onCountryFilterChange}
          >
            <SelectTrigger className="w-full sm:w-[155px] h-10 rounded-control border-border bg-surface text-xs text-ink">
              <SelectValue placeholder="Semua Negara" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-border shadow-card">
              <SelectItem value="ALL">Semua Negara</SelectItem>
              <SelectItem value="KR">Korea (KR)</SelectItem>
              <SelectItem value="JP">Jepang (JP)</SelectItem>
              <SelectItem value="TH">Thailand (TH)</SelectItem>
              <SelectItem value="CH">China (CH)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

