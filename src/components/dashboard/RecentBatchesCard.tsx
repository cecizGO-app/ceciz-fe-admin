import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { RecentBatch } from "./types";

interface RecentBatchesCardProps {
  batches: RecentBatch[];
  totalBatchesMonth: number;
  onViewAllBatches?: () => void;
  className?: string;
}

export const RecentBatchesCard: React.FC<RecentBatchesCardProps> = ({
  batches,
  totalBatchesMonth,
  onViewAllBatches,
  className,
}) => {
  return (
    <Card
      className={cn(
        "gap-2.5 rounded-[20px] p-5 sm:p-6 bg-white border border-[#FBCFE8]/50 shadow-[0_4px_20px_rgba(236,72,153,0.04)]",
        className,
      )}
    >
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base font-bold text-[#18181B]">
          Batch Terbaru
        </CardTitle>
        <button
          type="button"
          onClick={onViewAllBatches}
          className="text-xs font-semibold text-[#EC4899] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Lihat semua</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-[#FCE7F3]/70 hover:bg-transparent">
                <TableHead className="h-8.5 px-2 text-[12px] font-medium text-[#71717A]">
                  Batch
                </TableHead>
                <TableHead className="h-8.5 px-2 text-[12px] font-medium text-[#71717A]">
                  Negara
                </TableHead>
                <TableHead className="h-8.5 px-2 text-[12px] font-medium text-[#71717A]">
                  Tanggal
                </TableHead>
                <TableHead className="h-8.5 px-2 text-[12px] font-medium text-[#71717A]">
                  Buyer
                </TableHead>
                <TableHead className="h-8.5 px-2 text-[12px] font-medium text-[#71717A]">
                  Total
                </TableHead>
                <TableHead className="h-8.5 px-2 text-right text-[12px] font-medium text-[#71717A]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow
                  key={batch.id}
                  className="border-b border-[#FCE7F3]/40 hover:bg-[#FFF5FA]/50 transition-colors cursor-pointer"
                  onClick={onViewAllBatches}
                >
                  {/* Batch Number */}
                  <TableCell className="px-2 py-2.5 font-semibold text-xs text-[#18181B]">
                    {batch.batchNumber}
                  </TableCell>

                  {/* Negara Badge */}
                  <TableCell className="px-2 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="secondary"
                        className="px-1.5 py-0 h-5 text-[10px] font-bold rounded"
                      >
                        {batch.countryCode}
                      </Badge>
                      <span className="text-xs text-[#71717A]">
                        {batch.countryName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Tanggal */}
                  <TableCell className="px-2 py-2.5 text-xs text-[#71717A]">
                    {batch.date}
                  </TableCell>

                  {/* Buyer */}
                  <TableCell className="px-2 py-2.5 text-xs text-[#71717A]">
                    {batch.buyerCount} buyer
                  </TableCell>

                  {/* Total */}
                  <TableCell className="px-2 py-2.5 font-bold text-xs text-[#18181B]">
                    {batch.totalAmount}
                  </TableCell>

                  {/* Status (Open / Closed) */}
                  <TableCell className="px-2 py-2.5 text-right">
                    {batch.status === "Open" ? (
                      <Badge
                        variant="success"
                        className="gap-1.5 font-medium text-[11px] h-6 px-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Open
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1.5 font-medium text-[11px] h-6 px-2.5 bg-zinc-100 text-zinc-600 border-zinc-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                        Closed
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer Info — Tepat di bawah tabel tanpa white-space kosong */}
        <div className="pt-3 text-[11px] text-[#71717A]">
          Menampilkan {batches.length} batch terbaru dari {totalBatchesMonth} batch bulan ini
        </div>
      </CardContent>
    </Card>
  );
};
