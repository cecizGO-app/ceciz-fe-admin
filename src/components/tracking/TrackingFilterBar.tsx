import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TrackingSelect } from "./TrackingBadges";
import { STAGES } from "@/types/tracking";
import { COUNTRY_FLAGS } from "./constants";


interface TrackingFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  country: string;
  onCountryChange: (c: string) => void;
  warehouse: string;
  onWarehouseChange: (w: string) => void;
  stage: string;
  onStageChange: (s: string) => void;
  warehouses: string[];
  tab: "active" | "done" | "all";
}

export const TrackingFilterBar: React.FC<TrackingFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  country,
  onCountryChange,
  warehouse,
  onWarehouseChange,
  stage,
  onStageChange,
  warehouses,
  tab,
}) => {
  return (
    <div className="flex flex-1 flex-col xl:flex-row xl:items-center gap-3 min-w-0">
      {/* Search Input (Center) */}
      <div className="relative flex-1 min-w-[180px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A1A1AA]" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nomor batch, buyer, resi, barang..."
          className="h-10 pl-9 pr-9 rounded-[10px] border-[#FBCFE8] bg-white text-xs placeholder:text-[#A1A1AA]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Hapus pencarian"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Dropdowns (Right) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex items-center gap-2 shrink-0">
        <div className="w-full xl:w-[136px]">
          <TrackingSelect
            value={country}
            onChange={onCountryChange}
            options={[
              "Semua Negara",
              ...Object.entries(COUNTRY_FLAGS).map(([c, f]) => `${f} ${c}`),
            ]}
          />
        </div>
        <div className="w-full xl:w-[152px]">
          <TrackingSelect
            value={warehouse}
            onChange={onWarehouseChange}
            options={["Semua Warehouse", ...warehouses]}
          />
        </div>
        <div className="w-full xl:w-[144px]">
          <TrackingSelect
            value={stage}
            onChange={onStageChange}
            options={[
              "Semua Status",
              ...STAGES.filter(
                (s) =>
                  tab === "all" || (tab === "done" ? s === "Done" : s !== "Done")
              ),
            ]}
          />
        </div>
      </div>
    </div>
  );
};
