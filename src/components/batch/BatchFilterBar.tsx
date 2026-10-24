import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryFlag } from "@/components/icons/CountryFlag";
import { COUNTRY_PILLS } from "@/mocks/mockBatchData";
import type { CountryFilter } from "@/types/batch";


interface BatchFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  warehouseFilter: string;
  onWarehouseFilterChange: (val: string) => void;
  countryFilter: CountryFilter;
  onCountryFilterChange: (val: CountryFilter) => void;
  showHidden: boolean;
  onShowHiddenChange: (val: boolean) => void;
  hiddenCount: number;
  warehouses: string[];
}

export const BatchFilterBar: React.FC<BatchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  warehouseFilter,
  onWarehouseFilterChange,
  countryFilter,
  onCountryFilterChange,
  showHidden,
  onShowHiddenChange,
  hiddenCount,
  warehouses,
}) => {
  return (
    <div className="p-5 sm:p-6 space-y-4 border-b border-[#FCE7F3]/70">
      {/* Row 1: Search + Status Dropdown + Warehouse Dropdown */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            placeholder="Cari nomor batch, warehouse, proxy..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 rounded-[12px] border-[#FCE7F3] bg-[#FFF5FA]/30 focus:bg-white text-xs text-[#18181B] placeholder:text-[#A1A1AA]"
          />
        </div>

        {/* Status Dropdown */}
        <div className="sm:col-span-3">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-10 rounded-[12px] border-[#FCE7F3] bg-white text-xs font-medium text-[#18181B]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Warehouse Dropdown */}
        <div className="sm:col-span-3">
          <Select value={warehouseFilter} onValueChange={onWarehouseFilterChange}>
            <SelectTrigger className="h-10 rounded-[12px] border-[#FCE7F3] bg-white text-xs font-medium text-[#18181B]">
              <SelectValue placeholder="Semua Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Warehouse</SelectItem>
              {warehouses.map((wh) => (
                <SelectItem key={wh} value={wh}>
                  {wh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Country Filter Pills + Toggle Batch Tersembunyi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        {/* Country Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {COUNTRY_PILLS.map((pill) => {
            const isActive = countryFilter === pill.code;
            return (
              <button
                key={pill.code}
                type="button"
                onClick={() => onCountryFilterChange(pill.code)}
                className={`h-8 px-3 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#EC4899] text-white shadow-xs font-semibold"
                    : "bg-white border border-[#FBCFE8] text-[#71717A] hover:bg-[#FFF5FA] hover:text-[#18181B]"
                }`}
              >
                {pill.flag && (
                  <CountryFlag code={pill.flag} className="w-4 h-3 rounded-[2px]" />
                )}
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle Tampilkan Batch Tersembunyi */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <label
            htmlFor="toggle-hidden"
            className="text-xs text-[#71717A] font-medium cursor-pointer select-none"
          >
            Tampilkan batch tersembunyi ({hiddenCount})
          </label>
          <Switch
            id="toggle-hidden"
            checked={showHidden}
            onCheckedChange={onShowHiddenChange}
          />
        </div>
      </div>
    </div>
  );
};

export default BatchFilterBar;
