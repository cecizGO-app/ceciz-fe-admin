import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExchangeRates } from "@/types/dashboard";

interface KursBannerProps {
  rates: ExchangeRates;
  onOpenUpdateModal: () => void;
}

export const KursBanner: React.FC<KursBannerProps> = ({
  rates,
  onOpenUpdateModal,
}) => {
  return (
    <Card className="rounded-[20px] p-4 sm:px-6 sm:py-3.5 bg-white border border-[#FBCFE8]/50 shadow-[0_4px_20px_rgba(236,72,153,0.04)]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Sisi Kiri: Judul & Timestamp Sesuai PRD §5 */}
        <div className="shrink-0">
          <h2 className="text-sm font-bold text-[#18181B]">Kurs Hari Ini</h2>
          <p className="text-[11px] text-[#71717A] mt-0.5">
            Dicek {rates.checkedTime}
          </p>
        </div>

        {/* Tengah: Nilai Kurs 4 Negara Valas (CH, KR, TH, JP) */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          {/* Yuan (China) */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-[#FFF5FA] text-[#EC4899] border-[#FCE7F3] font-semibold text-[11px] h-6 px-2.5"
            >
              CH · Yuan
            </Badge>
            <span className="text-sm font-bold text-[#18181B]">
              Rp {rates.yuan}
            </span>
          </div>

          {/* Won (Korea Selatan) */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-[#FFF5FA] text-[#EC4899] border-[#FCE7F3] font-semibold text-[11px] h-6 px-2.5"
            >
              KR · Won
            </Badge>
            <span className="text-sm font-bold text-[#18181B]">
              Rp {rates.won}
            </span>
          </div>

          {/* Baht (Thailand) */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-[#FFF5FA] text-[#EC4899] border-[#FCE7F3] font-semibold text-[11px] h-6 px-2.5"
            >
              TH · Baht
            </Badge>
            <span className="text-sm font-bold text-[#18181B]">
              Rp {rates.baht}
            </span>
          </div>

          {/* Yen (Jepang) */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-[#FFF5FA] text-[#EC4899] border-[#FCE7F3] font-semibold text-[11px] h-6 px-2.5"
            >
              JP · Yen
            </Badge>
            <span className="text-sm font-bold text-[#18181B]">
              Rp {rates.yen}
            </span>
          </div>
        </div>

        {/* Sisi Kanan: Aksi Update Kurs (1 klik update sesuai PRD §5) */}
        <button
          type="button"
          onClick={onOpenUpdateModal}
          className="text-xs font-semibold text-[#EC4899] hover:text-[#DB2777] hover:underline cursor-pointer transition-colors self-start lg:self-auto shrink-0"
        >
          Update Kurs
        </button>
      </div>
    </Card>
  );
};
