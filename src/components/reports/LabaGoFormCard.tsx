import React, { useState } from "react";
import { X, Calendar, Check, ChevronDown } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRupiah } from "./formatters";
import type { BatchOptionForProfit, ProfitPeriodFormData } from "@/types/reports";

interface LabaGoFormCardProps {
  formData: ProfitPeriodFormData;
  onChange: (newData: Partial<ProfitPeriodFormData>) => void;
  availableBatches: BatchOptionForProfit[];
}

export const LabaGoFormCard: React.FC<LabaGoFormCardProps> = ({
  formData,
  onChange,
  availableBatches,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedBatches = availableBatches.filter((b) =>
    formData.selectedBatchIds.includes(b.id)
  );

  const totalSelectedLaba = selectedBatches.reduce(
    (sum, b) => sum + (b.labaAmount || 0),
    0
  );

  const handleToggleBatch = (batchId: string) => {
    const isSelected = formData.selectedBatchIds.includes(batchId);
    let updated: string[];
    if (isSelected) {
      updated = formData.selectedBatchIds.filter((id) => id !== batchId);
    } else {
      updated = [...formData.selectedBatchIds, batchId];
    }
    onChange({ selectedBatchIds: updated });
  };

  const handleRemoveBatch = (batchId: string) => {
    onChange({
      selectedBatchIds: formData.selectedBatchIds.filter((id) => id !== batchId),
    });
  };

  return (
    <Card className="rounded-[20px] border border-[#FBCFE8]/60 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-[#FBCFE8]/30">
        <CardTitle className="text-[17px] font-bold text-[#18181B] tracking-tight">
          Input Laba per Periode
        </CardTitle>
        <CardDescription className="text-xs text-[#71717A] leading-relaxed">
          Batch diambil dari data batch: laba bersih sudah terhitung & tracking
          Done / Arrived INA / tagihan diceklis
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Row 1: Nama Periode & Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Nama periode
            </Label>
            <Input
              type="text"
              value={formData.periodName}
              onChange={(e) => onChange({ periodName: e.target.value })}
              placeholder="Contoh: TAX 1-3"
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
              Dari tanggal
            </Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
              Sampai tanggal
            </Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>
        </div>

        {/* Row 2: Batch Selector with Multi-select */}
        <div>
          <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
            Batch
          </Label>

          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs hover:border-[#EC4899] transition-all cursor-pointer shadow-2xs group"
              >
                <span className="font-medium text-[#18181B]">
                  {selectedBatches.length > 0
                    ? `${selectedBatches.length} batch dipilih · ${formatRupiah(
                        totalSelectedLaba
                      )}`
                    : "Pilih batch yang sudah selesai..."}
                </span>
                <ChevronDown className="w-4 h-4 text-[#71717A] group-hover:text-[#EC4899] transition-transform" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-[calc(100vw-3rem)] sm:w-[460px] p-2 rounded-[14px] border-[#FBCFE8] shadow-lg max-h-64 overflow-y-auto"
            >
              <div className="px-2 py-1 text-[11px] font-semibold text-[#71717A] uppercase tracking-wider">
                Daftar Batch Siap Rekap Laba
              </div>
              {availableBatches.map((batch) => {
                const isSelected = formData.selectedBatchIds.includes(batch.id);
                return (
                  <DropdownMenuItem
                    key={batch.id}
                    onClick={() => handleToggleBatch(batch.id)}
                    className="flex items-center justify-between px-3 py-2 rounded-[10px] cursor-pointer hover:bg-[#FFF5FA]"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-[#EC4899] border-[#EC4899] text-white"
                            : "border-[#FBCFE8] bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 h-4 font-bold border-zinc-200"
                      >
                        {batch.countryCode}
                      </Badge>
                      <span className="text-xs font-semibold text-[#18181B]">
                        {batch.batchNumber}
                      </span>
                      <span className="text-[11px] text-[#71717A]">
                        ({batch.totalPc} pcs)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600">
                        {formatRupiah(batch.labaAmount)}
                      </span>
                      <span className="text-[10px] text-[#71717A] bg-zinc-100 px-1.5 py-0.5 rounded">
                        {batch.status}
                      </span>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Selected Badges display under dropdown */}
          {selectedBatches.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-2.5">
              {selectedBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-[10px] bg-[#FFF5FA] border border-[#FBCFE8] text-xs shadow-2xs animate-in fade-in zoom-in-95 duration-100"
                >
                  <span className="font-bold text-[10px] text-[#EC4899] uppercase">
                    {batch.countryCode}
                  </span>
                  <span className="font-semibold text-[#18181B]">
                    {batch.batchNumber}
                  </span>
                  <span className="text-[#71717A] text-[11px]">
                    · {formatRupiah(batch.labaAmount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBatch(batch.id)}
                    className="p-0.5 ml-1 rounded-full text-[#71717A] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title={`Hapus ${batch.batchNumber}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Row 3: Biaya Operasional (Bahan Packing & Pengeluaran Lain) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Total beli bahan packing (Rp)
            </Label>
            <Input
              type="number"
              min={0}
              value={formData.packingExpense || ""}
              onChange={(e) =>
                onChange({ packingExpense: Number(e.target.value) || 0 })
              }
              placeholder="0"
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Pengeluaran lain (Rp)
            </Label>
            <Input
              type="number"
              min={0}
              value={formData.otherExpense || ""}
              onChange={(e) =>
                onChange({ otherExpense: Number(e.target.value) || 0 })
              }
              placeholder="0"
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>
        </div>

        {/* Row 4: Keterangan Pengeluaran Lain */}
        <div>
          <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
            Keterangan pengeluaran lain
          </Label>
          <Input
            type="text"
            value={formData.otherExpenseNotes}
            onChange={(e) => onChange({ otherExpenseNotes: e.target.value })}
            placeholder="Contoh: desain logo commis, toploader extra"
            className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
          />
        </div>

        {/* Row 5: Pembagian Gaji Admin A (%) & Admin B (%) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Pembagian Gaji Admin A (%)
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={formData.adminASplit}
              onChange={(e) =>
                onChange({ adminASplit: Number(e.target.value) || 0 })
              }
              placeholder="80"
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Pembagian Gaji Admin B (%)
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={formData.adminBSplit}
              onChange={(e) =>
                onChange({ adminBSplit: Number(e.target.value) || 0 })
              }
              placeholder="20"
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>
        </div>

        {/* Row 6: Sisihan Tabungan GO (%) & Keterangan Periode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Sisihan Tabungan GO (%)
            </Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={formData.savingsPercent}
              onChange={(e) =>
                onChange({ savingsPercent: Number(e.target.value) || 0 })
              }
              placeholder="0"
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Keterangan Periode
            </Label>
            <Input
              type="text"
              value={formData.periodNotes}
              onChange={(e) => onChange({ periodNotes: e.target.value })}
              placeholder="Catatan penutupan periode (opsional)"
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

