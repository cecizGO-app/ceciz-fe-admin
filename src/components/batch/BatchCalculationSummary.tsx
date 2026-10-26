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
                  : "((Harga + Shiploc) * Rate + Fee WH + Fee CO)"}
              </span>
            </div>
            <span className="font-bold text-[#18181B] tabular-nums text-sm">
              {formatIDR(summary.subtotalTfSeller)}
            </span>
          </div>

          {/* Total Tagihan Buyer Box (Harga Total) */}
          <div className="p-3.5 rounded-[14px] bg-[#FFF5FA] border border-[#FBCFE8] flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#18181B] tracking-wider uppercase">
                {summary.isIndonesia
                  ? "TOTAL PENDAPATAN"
                  : "HARGA TOTAL (TAGIHAN)"}
              </div>
              <div className="text-[10px] text-[#71717A]">
                {summary.isJapan
                  ? summary.allJpHargaJualFilled
                    ? "SUM Harga Jual Buyer (Admin)"
                    : "Estimasi Total Bersih Batch"
                  : summary.isIndonesia
                    ? "SUM Harga + SUM Fee GO"
                    : "Total Harga Bersih Semua Row"}
              </div>
            </div>
            <div className="text-[20px] font-black text-[#EC4899] tracking-tight tabular-nums">
              {formatIDR(summary.totalTagihanBuyer)}
            </div>
          </div>

          {/* Selisih: Harga Total - Subtotal TF Seller */}
          <div className="flex justify-between items-center text-xs p-2.5 rounded-[10px] bg-zinc-50 border border-zinc-200/80">
            <div>
              <span className="font-semibold text-[#18181B] block">
                Selisih (Laba Kotor Batch)
              </span>
              <span className="text-[10px] text-[#71717A]">
                Harga Total &minus; Subtotal TF Seller
              </span>
            </div>
            <span className="font-bold text-zinc-900 tabular-nums text-sm">
              {formatIDR(summary.selisihHarga)}
            </span>
          </div>

          {/* Estimasi Laba Bersih GO */}
          <div className="flex justify-between items-center text-xs pt-1">
            <div>
              <span className="text-[#71717A] font-medium block">
                Estimasi Laba Bersih GO
              </span>
              <span className="text-[10px] text-[#71717A]">
                Selisih &minus; Fee Rekap &minus; Fee Nyelem
              </span>
            </div>
            <span
              className={`font-black text-sm tabular-nums ${summary.estimasiLabaBersih >= 0 ? "text-[#16A34A]" : "text-red-500"}`}
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
