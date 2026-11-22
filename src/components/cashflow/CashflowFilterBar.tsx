import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CASHFLOW_CATEGORIES,
  type CashflowFilterParams,
  type CashflowType,
  type PaymentMethodType,
} from "@/types/cashflow";

interface CashflowFilterBarProps {
  filters: CashflowFilterParams;
  onFilterChange: (filters: CashflowFilterParams) => void;
  onReset: () => void;
}

export const CashflowFilterBar: React.FC<CashflowFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.type && filters.type !== "ALL") ||
    Boolean(filters.category) ||
    Boolean(filters.paymentMethod && filters.paymentMethod !== "ALL") ||
    Boolean(filters.period && filters.period !== "ALL");

  // Kategori dinamis sesuai tipe yang dipilih
  const availableCategories =
    filters.type === "INCOME"
      ? CASHFLOW_CATEGORIES.INCOME
      : filters.type === "EXPENSE"
      ? CASHFLOW_CATEGORIES.EXPENSE
      : [...CASHFLOW_CATEGORIES.INCOME, ...CASHFLOW_CATEGORIES.EXPENSE];

  return (
    <div className="flex flex-col xl:flex-row xl:items-center gap-3">
      {/* Left: Type Toggle Pills (Semua, Pemasukan, Pengeluaran) */}
      <div className="flex items-center gap-1.5 p-1 rounded-[12px] bg-[#FFF5FA] border border-[#FCE7F3] overflow-x-auto no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, type: "ALL", category: undefined })}
          className={`h-8 px-3 rounded-[9px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            !filters.type || filters.type === "ALL"
              ? "bg-[#EC4899] text-white shadow-2xs"
              : "text-[#71717A] hover:text-[#18181B] hover:bg-white/70"
          }`}
        >
          Semua
        </button>
        <button
          type="button"
          onClick={() =>
            onFilterChange({
              ...filters,
              type: "INCOME" as CashflowType,
              category: undefined,
            })
          }
          className={`h-8 px-3 rounded-[9px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filters.type === "INCOME"
              ? "bg-emerald-600 text-white shadow-2xs"
              : "text-[#71717A] hover:text-emerald-700 hover:bg-white/70"
          }`}
        >
          Pemasukan
        </button>
        <button
          type="button"
          onClick={() =>
            onFilterChange({
              ...filters,
              type: "EXPENSE" as CashflowType,
              category: undefined,
            })
          }
          className={`h-8 px-3 rounded-[9px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            filters.type === "EXPENSE"
              ? "bg-rose-600 text-white shadow-2xs"
              : "text-[#71717A] hover:text-rose-700 hover:bg-white/70"
          }`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Center: Search Input Box */}
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA] pointer-events-none" />
        <Input
          type="text"
          placeholder="Cari transaksi, keperluan, atau catatan..."
          value={filters.search || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="h-10 pl-9 rounded-[10px] border-[#FBCFE8] bg-white text-xs placeholder:text-[#A1A1AA] focus-visible:ring-[#EC4899]"
        />
      </div>

      {/* Right: Filter Dropdowns + Reset */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex items-center gap-2 shrink-0">
        {/* Periode Box Filter */}
        <Select
          value={filters.period || "ALL"}
          onValueChange={(val) =>
            onFilterChange({
              ...filters,
              period: val as CashflowFilterParams["period"],
            })
          }
        >
          <SelectTrigger className="h-10 w-full xl:w-[130px] rounded-[10px] border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] cursor-pointer">
            <SelectValue placeholder="Semua Waktu" />
          </SelectTrigger>
          <SelectContent className="rounded-[12px] border-[#FCE7F3]">
            <SelectItem value="ALL" className="text-xs">Semua Waktu</SelectItem>
            <SelectItem value="THIS_MONTH" className="text-xs">Bulan Ini</SelectItem>
            <SelectItem value="LAST_30_DAYS" className="text-xs">30 Hari Terakhir</SelectItem>
            <SelectItem value="LAST_7_DAYS" className="text-xs">7 Hari Terakhir</SelectItem>
          </SelectContent>
        </Select>

        {/* Kategori Box Filter */}
        <Select
          value={filters.category || "ALL"}
          onValueChange={(val) =>
            onFilterChange({
              ...filters,
              category: val === "ALL" ? undefined : val,
            })
          }
        >
          <SelectTrigger className="h-10 w-full xl:w-[148px] rounded-[10px] border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] cursor-pointer">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent className="rounded-[12px] border-[#FCE7F3] max-h-64">
            <SelectItem value="ALL" className="text-xs">Semua Kategori</SelectItem>
            {availableCategories.map((c) => (
              <SelectItem key={c.value} value={c.value} className="text-xs">
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Metode Pembayaran / Akun Kas Box Filter */}
        <Select
          value={filters.paymentMethod || "ALL"}
          onValueChange={(val) =>
            onFilterChange({
              ...filters,
              paymentMethod: val as "ALL" | PaymentMethodType,
            })
          }
        >
          <SelectTrigger className="h-10 w-full xl:w-[138px] rounded-[10px] border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] cursor-pointer">
            <SelectValue placeholder="Semua Akun Kas" />
          </SelectTrigger>
          <SelectContent className="rounded-[12px] border-[#FCE7F3]">
            <SelectItem value="ALL" className="text-xs">Semua Akun Kas</SelectItem>
            <SelectItem value="BCA" className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>BCA</span>
              </div>
            </SelectItem>
            <SelectItem value="QRIS" className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-600 shrink-0" />
                <span>QRIS</span>
              </div>
            </SelectItem>
            <SelectItem value="SEABANK" className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                <span>SeaBank</span>
              </div>
            </SelectItem>
            <SelectItem value="SPAY" className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                <span>ShopeePay</span>
              </div>
            </SelectItem>
            <SelectItem value="CASH" className="text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>Tunai / Cash</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            title="Reset filter"
            className="h-10 px-2.5 text-xs text-[#71717A] hover:text-[#EC4899] hover:bg-[#FFF5FA] rounded-[10px] gap-1 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="xl:hidden">Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
};
