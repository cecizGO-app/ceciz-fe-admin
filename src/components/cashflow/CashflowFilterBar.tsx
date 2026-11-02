import React from "react";
import { Search, RotateCcw, Filter } from "lucide-react";
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
    <div className="p-4 sm:p-5 border-b border-[#FBCFE8]/40 bg-white space-y-3.5">
      {/* Baris Atas: Search & Quick Type Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
          <Input
            type="text"
            placeholder="Cari transaksi, keperluan, atau catatan..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="pl-9 pr-4 h-10 rounded-[10px] border-[#FBCFE8] focus:border-[#EC4899] text-xs sm:text-sm bg-white"
          />
        </div>

        {/* Type Toggle Pills (Semua, Masuk, Keluar) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FFF5FA] border border-[#FBCFE8]/60 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, type: "ALL", category: undefined })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !filters.type || filters.type === "ALL"
                ? "bg-[#EC4899] text-white shadow-2xs"
                : "text-[#71717A] hover:text-[#18181B]"
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filters.type === "INCOME"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-emerald-700 hover:text-emerald-800"
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filters.type === "EXPENSE"
                ? "bg-rose-600 text-white shadow-2xs"
                : "text-rose-700 hover:text-rose-800"
            }`}
          >
            Pengeluaran
          </button>
        </div>
      </div>

      {/* Baris Bawah: Box Filter Dropdown & Reset */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#71717A] mr-1 hidden sm:flex">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>

        {/* Periode Box Filter */}
        <div className="w-[145px] sm:w-[165px]">
          <Select
            value={filters.period || "ALL"}
            onValueChange={(val) =>
              onFilterChange({
                ...filters,
                period: val as CashflowFilterParams["period"],
              })
            }
          >
            <SelectTrigger className="h-10 px-3.5 rounded-[10px] border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 cursor-pointer">
              <SelectValue placeholder="Semua Periode" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px] border-[#FBCFE8]">
              <SelectItem value="ALL" className="text-xs">Semua Waktu</SelectItem>
              <SelectItem value="THIS_MONTH" className="text-xs">Bulan Ini</SelectItem>
              <SelectItem value="LAST_30_DAYS" className="text-xs">30 Hari Terakhir</SelectItem>
              <SelectItem value="LAST_7_DAYS" className="text-xs">7 Hari Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Kategori Box Filter */}
        <div className="w-[170px] sm:w-[210px]">
          <Select
            value={filters.category || "ALL"}
            onValueChange={(val) =>
              onFilterChange({
                ...filters,
                category: val === "ALL" ? undefined : val,
              })
            }
          >
            <SelectTrigger className="h-10 px-3.5 rounded-[10px] border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 cursor-pointer">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px] border-[#FBCFE8] max-h-64">
              <SelectItem value="ALL" className="text-xs">Semua Kategori</SelectItem>
              {availableCategories.map((c) => (
                <SelectItem key={c.value} value={c.value} className="text-xs">
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Metode Pembayaran / Akun Kas Box Filter */}
        <div className="w-[150px] sm:w-[180px]">
          <Select
            value={filters.paymentMethod || "ALL"}
            onValueChange={(val) =>
              onFilterChange({
                ...filters,
                paymentMethod: val as "ALL" | PaymentMethodType,
              })
            }
          >
            <SelectTrigger className="h-10 px-3.5 rounded-[10px] border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 cursor-pointer">
              <SelectValue placeholder="Semua Akun" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px] border-[#FBCFE8]">
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
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 px-3 text-xs text-[#71717A] hover:text-[#EC4899] hover:bg-[#FFF5FA] rounded-[10px] gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
};
