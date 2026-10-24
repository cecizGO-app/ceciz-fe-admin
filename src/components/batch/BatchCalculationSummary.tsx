import React from "react";
import { Loader2 } from "lucide-react";
import type { CalculationSummary } from "@/types/batch";

import { Sparkle } from "@/components/icons/Sparkle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BatchCalculationSummaryProps {
  summary: CalculationSummary;
  currency: string;
  kursRate: number;
  shippingForeign: number;
  onPublish: () => void;
  isSubmitting?: boolean;
}

function formatIDR(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

export const BatchCalculationSummary: React.FC<
  BatchCalculationSummaryProps
> = ({
  summary,
  currency,
  kursRate,
  shippingForeign,
  onPublish,
  isSubmitting = false,
}) => {
  return (
    <Card className="gap-5 p-6 sm:p-7 lg:sticky lg:top-24">
      <CardHeader className="p-0">
        <CardTitle>Ringkasan Kalkulasi</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-0">
        {/* Quick Stats Top Bar */}
        <div className="bg-[#FFF5FA] border border-[#FBCFE8]/60 rounded-[14px] p-3.5 grid grid-cols-2 divide-x divide-[#FBCFE8]/80 text-center">
          <div>
            <div className="text-[11px] font-medium text-[#71717A]">
              Total Qty/Pcs
            </div>
            <div className="text-[18px] font-bold text-[#18181B] mt-0.5">
              {summary.totalQty} pcs
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#71717A]">
              Total Buyer
            </div>
            <div className="text-[18px] font-bold text-[#18181B] mt-0.5">
              {summary.totalBuyer} orang
            </div>
          </div>
        </div>

        {/* Key Cost Breakdown (Dirapikan tanpa merubah bentuk & struktur) */}
        <div className="space-y-3 text-xs text-[#71717A]">
          <div className="flex justify-between items-center gap-2">
            <span>Total Harga Asli Barang</span>
            <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
              {summary.totalHargaAsliValas.toLocaleString("id-ID")} {currency}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span>
              Konversi ke IDR (Kurs {kursRate.toLocaleString("id-ID")})
            </span>
            <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
              {formatIDR(summary.konversiIDR)}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span>
              {summary.isJapan ? "Shiploc Jepang" : "Shipping Luar Negeri"} (
              {shippingForeign} {currency})
            </span>
            <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
              {formatIDR(summary.shippingLuarNegeriIDR)}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <span>Fee Warehouse + Proxy</span>
            <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
              {formatIDR(summary.feeWHProxyTotal)}
            </span>
          </div>

          {!summary.isJapan && (
            <>
              <div className="flex justify-between items-center gap-2">
                <span>Fee GO Batch</span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.feeGO)}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <span>Fee Rekap ({summary.tierLabel})</span>
                  <Badge
                    variant="secondary"
                    className="gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-bold"
                  >
                    <Sparkle className="w-3.5 h-3.5" />
                    <span>auto</span>
                  </Badge>
                </span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.feeRekap)}
                </span>
              </div>
            </>
          )}
        </div>

        <Separator />

        {/* Totals Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-[#71717A]">
              Total Modal Batch (Nett)
            </span>
            <span className="font-semibold text-[#18181B] tabular-nums">
              {formatIDR(summary.totalModalBatch)}
            </span>
          </div>

          {/* Total Tagihan Buyer Box */}
          <div className="p-3.5 rounded-[14px] bg-[#FFF5FA] border border-[#FBCFE8] flex items-center justify-between">
            <div className="text-[11px] font-bold text-[#18181B] tracking-wider uppercase">
              TOTAL TAGIHAN BUYER
            </div>
            <div className="text-[20px] font-black text-[#EC4899] tracking-tight tabular-nums">
              {formatIDR(summary.totalTagihanBuyer)}
            </div>
          </div>

          {/* Estimasi Laba Bersih GO */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#71717A]">Estimasi Laba Bersih GO</span>
            <span
              className={`font-bold tabular-nums ${summary.estimasiLabaBersih >= 0 ? "text-[#16A34A]" : "text-red-500"}`}
            >
              {summary.estimasiLabaBersih >= 0 ? "+ " : ""}
              {formatIDR(summary.estimasiLabaBersih)}
            </span>
          </div>
        </div>

        {/* Publish Action Button */}
        <div className="pt-2">
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onPublish}
            className="w-full h-11 rounded-[12px] text-sm font-semibold cursor-pointer shadow-sm hover:shadow-md gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Batch ke Backend...</span>
              </>
            ) : (
              <span>Terbitkan &amp; Simpan Batch</span>
            )}
          </Button>
          <p className="text-[11px] text-[#71717A] text-center mt-2 leading-relaxed">
            Batch akan tersimpan di sistem dan backend Ceciz
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchCalculationSummary;
