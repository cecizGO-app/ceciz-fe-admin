import React from "react";
import { BookmarkCheck, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "./formatters";
import type {
  ProfitPeriodFormData,
  ProfitPeriodSummary,
} from "@/types/reports";

interface LabaGoSummaryCardProps {
  formData: ProfitPeriodFormData;
  summary: ProfitPeriodSummary;
  onSave: () => Promise<void> | void;
  isSaving?: boolean;
}

export const LabaGoSummaryCard: React.FC<LabaGoSummaryCardProps> = ({
  formData,
  summary,
  onSave,
  isSaving = false,
}) => {
  const periodTitle = formData.periodName.trim() || "Preview Periode";
  const dateRangeLabel =
    formData.startDate && formData.endDate
      ? `${formData.startDate} s/d ${formData.endDate}`
      : "Rentang tanggal belum ditentukan";

  const rows = [
    {
      id: "packing",
      label: "Total beli bahan packing",
      value: summary.totalPackingExpense,
      annotation: "modal packing",
      isHighlight: false,
    },
    {
      id: "other",
      label: "Pengeluaran lain",
      value: summary.totalOtherExpense,
      annotation: formData.otherExpenseNotes.trim() || "biaya operasional",
      isHighlight: false,
    },
    {
      id: "total-modal",
      label: "Total Modal Keseluruhan",
      value: summary.totalModal,
      annotation: "Total semua biaya",
      isHighlight: true,
      borderTop: true,
    },
    {
      id: "pemasukan",
      label: "Total Laba Keseluruhan (Pemasukan)",
      value: summary.totalLabaBatch,
      annotation: `Dari ${formData.selectedBatchIds.length} batch terpilih`,
      isHighlight: false,
    },
    {
      id: "laba-bersih",
      label: "Laba Bersih",
      value: summary.labaBersih,
      annotation: "Pemasukan - Modal",
      isHighlight: true,
      isNetProfit: true,
      borderTop: true,
      borderBottom: true,
    },
    {
      id: "admin-a",
      label: "Gaji Admin A",
      value: summary.gajiAdminA,
      annotation: `${formData.adminASplit}%`,
      isHighlight: false,
    },
    {
      id: "admin-b",
      label: "Gaji Admin B",
      value: summary.gajiAdminB,
      annotation: `${formData.adminBSplit}%`,
      isHighlight: false,
    },
    {
      id: "tabungan-go",
      label: "Tabungan GO",
      value: summary.tabunganGO,
      annotation: `${formData.savingsPercent}%`,
      isHighlight: false,
    },
  ];

  return (
    <Card className="rounded-[20px] border border-[#FBCFE8]/60 shadow-xs bg-white flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 border-b border-[#FBCFE8]/30 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-[17px] font-bold text-[#18181B] tracking-tight">
              {periodTitle}
            </CardTitle>
            <CardDescription className="text-xs text-[#71717A] mt-0.5">
              {dateRangeLabel}
            </CardDescription>
          </div>

          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving || formData.selectedBatchIds.length === 0}
            size="sm"
            className="h-9 px-4 rounded-[10px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Menyimpan...
              </>
            ) : (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 mr-1.5" />
                Simpan periode
              </>
            )}
          </Button>
        </CardHeader>

        <CardContent className="pt-3 px-4 sm:px-6 divide-y divide-[#FBCFE8]/30">
          {rows.map((row) => (
            <div
              key={row.id}
              className={`py-2.5 flex items-center justify-between text-xs transition-colors ${
                row.isHighlight ? "font-semibold bg-[#FFF5FA]/30 -mx-4 px-4 sm:-mx-6 sm:px-6" : ""
              }`}
            >
              <span className={`text-[#18181B] ${row.isHighlight ? "font-bold" : "font-medium"}`}>
                {row.label}
              </span>

              <div className="flex items-center gap-4 text-right">
                <span
                  className={`${
                    row.isNetProfit
                      ? row.value >= 0
                        ? "text-emerald-600 font-bold text-sm"
                        : "text-rose-600 font-bold text-sm"
                      : row.isHighlight
                      ? "text-[#18181B] font-bold"
                      : "text-[#18181B]"
                  }`}
                >
                  {formatRupiah(row.value)}
                </span>
                <span className="w-28 text-[11px] text-[#71717A] truncate text-right">
                  {row.annotation}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </div>

      <div className="px-6 py-3 bg-[#FFF5FA]/40 border-t border-[#FBCFE8]/30 rounded-b-[20px] text-[11px] text-[#71717A] flex items-center justify-between">
        <span>* Perhitungan live reaktif Dual-Layer PRD v1.4</span>
        <span className="font-semibold text-[#EC4899]">
          Total Batch: {formData.selectedBatchIds.length}
        </span>
      </div>
    </Card>
  );
};

