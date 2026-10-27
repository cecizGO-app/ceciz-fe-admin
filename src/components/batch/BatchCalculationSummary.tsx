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

        {/* Key Cost Breakdown */}
        <div className="space-y-3 text-xs text-[#71717A]">
          {summary.isIndonesia ? (
            <>
              <div className="flex justify-between items-center gap-2">
                <span>SUM Harga Rupiah (Barang)</span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.totalHargaAsliValas)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Harga CO Shopee dari Seller</span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.hargaCOShopeeSeller || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Fee GO Batch (2k/pc)</span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.feeGO)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Fee Admin Rekap ({summary.tierLabel})</span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.feeRekap)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Fee Admin Nyelem</span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.feeNyelemTotal)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center gap-2">
                <span>Total Harga Asli Barang</span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {summary.totalHargaAsliValas.toLocaleString("id-ID")}{" "}
                  {currency}
                  {summary.isKorea && (
                    <span className="text-[10px] text-amber-700 font-normal ml-1">
                      (&times;10k ={" "}
                      {(summary.totalHargaAsliValas * 10000).toLocaleString(
                        "id-ID",
                      )}{" "}
                      Won)
                    </span>
                  )}
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
                  {summary.isJapan ? "Shiploc Jepang" : "Shipping WH Luar"} (
                  {shippingForeign} {currency})
                </span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.shippingLuarNegeriIDR)}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span>Fee WH + Fee Proxy / CO</span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.feeWHProxyTotal)}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span>Fee GO Batch</span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.feeGO)}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate">
                    Fee Rekap ({summary.tierLabel.replace(/^Tier\s*/i, "")})
                  </span>
                  <Badge
                    variant="secondary"
                    className="gap-1 px-1.5 py-0.5 rounded-[6px] text-[10px] font-bold shrink-0"
                  >
                    <Sparkle className="w-3 h-3" />
                    <span>auto</span>
                  </Badge>
                </span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums whitespace-nowrap">
                  {formatIDR(summary.feeRekap)}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span>Fee Nyelem Total</span>
                <span className="font-semibold text-[#18181B] shrink-0 tabular-nums">
                  {formatIDR(summary.feeNyelemTotal)}
                </span>
              </div>
            </>
          )}
        </div>

        <Separator />

        {/* Totals Section with Subtotal TF Seller & Selisih */}
        <div className="space-y-3">
          {/* Subtotal TF Seller */}
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="font-semibold text-[#18181B] block">
                Subtotal TF Seller (Modal)
              </span>
              <span className="text-[10px] text-[#71717A]">
                {summary.isIndonesia
                  ? "SUM Harga + Harga CO Shopee"
                  : summary.rateSeller
                    ? `Via Kurs Seller (Rp ${summary.rateSeller.toLocaleString("id-ID")})`
                    : "Via Kurs Normal"}
              </span>
            </div>
            <span className="font-bold text-[#18181B] tabular-nums text-sm">
              {formatIDR(summary.subtotalTfSeller)}
            </span>
          </div>

          {/* Total Tagihan Buyer Box (Harga Total) */}
          <div className="p-3.5 rounded-[14px] bg-[#FFF5FA] border border-[#FBCFE8] space-y-1">
            <div className="flex items-center justify-between text-[#71717A]">
              <span className="text-[11px] font-bold text-[#18181B] tracking-wider uppercase whitespace-nowrap">
                {summary.isIndonesia
                  ? "TOTAL PENDAPATAN"
                  : "HARGA TOTAL (TAGIHAN)"}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium whitespace-nowrap">
                {summary.isJapan
                  ? summary.allJpHargaJualFilled
                    ? "SUM Jual"
                    : "Estimasi"
                  : "Total Bersih"}
              </span>
            </div>
            <div className="text-[22px] font-black text-[#EC4899] tracking-tight tabular-nums">
              {formatIDR(summary.totalTagihanBuyer)}
            </div>
          </div>

          {/* Selisih: Harga Total - Subtotal TF Seller */}
          <div className="flex justify-between items-center text-xs p-2.5 rounded-[10px] bg-zinc-50 border border-zinc-200/80 gap-2">
            <div className="min-w-0">
              <span className="font-semibold text-[#18181B] block whitespace-nowrap">
                Laba Kotor (Selisih)
              </span>
              <span className="text-[10px] text-[#71717A] block whitespace-nowrap">
                Tagihan &minus; Subtotal TF
              </span>
            </div>
            <span className="font-bold text-zinc-900 tabular-nums text-sm whitespace-nowrap shrink-0">
              {formatIDR(summary.selisihHarga)}
            </span>
          </div>

          {/* Estimasi Laba Bersih GO */}
          <div className="flex justify-between items-center text-xs p-2.5 rounded-[10px] bg-emerald-50/60 border border-emerald-200/80 gap-2">
            <div className="min-w-0">
              <span className="font-semibold text-emerald-950 block whitespace-nowrap">
                Laba Bersih GO
              </span>
              <span className="text-[10px] text-emerald-700/80 block whitespace-nowrap">
                Setelah fee rekap &amp; nyelem
              </span>
            </div>
            <span
              className={`font-black text-sm tabular-nums whitespace-nowrap shrink-0 ${summary.estimasiLabaBersih >= 0 ? "text-emerald-600" : "text-rose-600"}`}
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
            className="w-full h-11 rounded-[12px] text-sm font-semibold cursor-pointer shadow-sm hover:shadow-md gap-2 bg-[#EC4899] hover:bg-[#db2777] text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Batch ke Backend...</span>
              </>
            ) : (
              <span>Save &amp; Generate Text</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchCalculationSummary;
