import React from "react";
import type { CalculationSummary } from "./types";
import { Sparkle } from "../icons/Sparkle";

interface BatchCalculationSummaryProps {
  summary: CalculationSummary;
  currency: string;
  kursRate: number;
  shippingForeign: number;
  onPublish: () => void;
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
> = ({ summary, currency, kursRate, shippingForeign, onPublish }) => {
  return (
    <div className="bg-white rounded-[24px] shadow-ceciz-surface border border-[#FBCFE8]/40 p-6 sm:p-7 space-y-5 lg:sticky lg:top-24">
      <h2 className="text-[17px] font-bold text-[#18181B] tracking-tight">
        Ringkasan Kalkulasi
      </h2>

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
      <div className="space-y-2.5 text-xs text-[#71717A]">
        <div className="flex justify-between items-center">
          <span>Total Harga Asli Barang</span>
          <span className="font-semibold text-[#18181B]">
            {summary.totalHargaAsliValas.toLocaleString("id-ID")} {currency}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Konversi ke IDR (Kurs {kursRate.toLocaleString("id-ID")})</span>
          <span className="font-semibold text-[#18181B]">
            {formatIDR(summary.konversiIDR)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>
            {summary.isJapan ? "Shiploc Jepang (Lokal WH)" : "Shipping Luar Negeri"} ({shippingForeign} {currency})
          </span>
          <span className="font-semibold text-[#18181B]">
            {formatIDR(summary.shippingLuarNegeriIDR)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Fee Warehouse + Proxy</span>
          <span className="font-semibold text-[#18181B]">
            {formatIDR(summary.feeWHProxyTotal)}
          </span>
        </div>

        {!summary.isJapan && (
          <>
            <div className="flex justify-between items-center">
              <span>Fee GO Batch</span>
              <span className="font-semibold text-[#18181B]">
                {formatIDR(summary.feeGO)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span>Fee Rekap ({summary.tierLabel})</span>
                <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-bold bg-[#FCE7F3] text-[#EC4899] inline-flex items-center gap-1 shrink-0">
                  <Sparkle className="w-3.5 h-3.5" />
                  <span>auto</span>
                </span>
              </span>
              <span className="font-semibold text-[#18181B]">
                {formatIDR(summary.feeRekap)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Totals Section */}
      <div className="border-t border-[#FCE7F3] pt-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-[#71717A]">
            Total Modal Batch (Nett)
          </span>
          <span className="font-semibold text-[#18181B]">
            {formatIDR(summary.totalModalBatch)}
          </span>
        </div>

        {/* Total Tagihan Buyer Box */}
        <div className="p-3.5 rounded-[14px] bg-[#FFF5FA] border border-[#FBCFE8] flex items-center justify-between">
          <div className="text-[11px] font-bold text-[#18181B] tracking-wider uppercase">
            TOTAL TAGIHAN BUYER
          </div>
          <div className="text-[20px] font-black text-[#EC4899] tracking-tight">
            {formatIDR(summary.totalTagihanBuyer)}
          </div>
        </div>

        {/* Estimasi Laba Bersih GO */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#71717A]">Estimasi Laba Bersih GO</span>
          <span className={`font-bold ${summary.estimasiLabaBersih >= 0 ? 'text-[#16A34A]' : 'text-red-500'}`}>
            {summary.estimasiLabaBersih >= 0 ? '+ ' : ''}{formatIDR(summary.estimasiLabaBersih)}
          </span>
        </div>
      </div>

      {/* Publish Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onPublish}
          className="w-full h-11 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] active:scale-[0.99] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <span>Terbitkan & Simpan Batch</span>
        </button>
        <p className="text-[11px] text-[#71717A] text-center mt-2 leading-relaxed">
          Invoice akan otomatis dibuat untuk tiap buyer
        </p>
      </div>
    </div>
  );
};

export default BatchCalculationSummary;
