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
    <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3 xl:grid-cols-[minmax(260px,1fr)_170px_190px_190px]">
      <div className="relative sm:col-span-3 xl:col-span-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#71717A]" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nomor batch, buyer, resi, barang..."
          className="pl-9.5 pr-9 text-xs"
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
      <TrackingSelect
        value={country}
        onChange={onCountryChange}
        options={[
          "Semua Negara",
          ...Object.entries(COUNTRY_FLAGS).map(([c, f]) => `${f} ${c}`),
        ]}
      />
      <TrackingSelect
        value={warehouse}
        onChange={onWarehouseChange}
        options={["Semua Warehouse", ...warehouses]}
      />
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
  );
};
