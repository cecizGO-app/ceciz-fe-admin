import React from "react";
import { Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "./formatters";
import type { ProfitPeriodHistoryItem } from "@/types/reports";

interface LabaGoHistoryTableProps {
  history: ProfitPeriodHistoryItem[];
  onDelete?: (id: string) => void;
}

export const LabaGoHistoryTable: React.FC<LabaGoHistoryTableProps> = ({
  history,
  onDelete,
}) => {
  return (
    <Card className="rounded-[20px] border border-[#FBCFE8]/60 shadow-xs bg-white overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-[#FBCFE8]/30 flex flex-row items-center justify-between">
        <CardTitle className="text-[17px] font-bold text-[#18181B] tracking-tight">
          Riwayat Laba per Periode
        </CardTitle>
        <span className="text-xs text-[#71717A]">
          Total {history.length} periode tersimpan
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-[#FFF5FA]/60">
            <TableRow className="border-[#FBCFE8]/30 hover:bg-transparent">
              <TableHead className="w-[160px] text-xs font-semibold text-[#18181B] pl-6">
                Periode
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B]">
                Tanggal
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B]">
                Batch
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B] text-right">
                Pemasukan
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B] text-right">
                Modal
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B] text-right">
                Laba Bersih
              </TableHead>
              <TableHead className="text-xs font-semibold text-[#18181B]">
                Keterangan
              </TableHead>
              {onDelete && (
                <TableHead className="w-[60px] text-center text-xs font-semibold text-[#18181B] pr-6">
                  Aksi
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={onDelete ? 8 : 7}
                  className="h-28 text-center text-xs text-[#71717A]"
                >
                  Belum ada data periode laba yang disimpan. Silakan simpan periode di atas.
                </TableCell>
              </TableRow>
            ) : (
              history.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-[#FBCFE8]/30 hover:bg-[#FFF5FA]/40 transition-colors"
                >
                  <TableCell className="font-semibold text-xs text-[#18181B] pl-6">
                    {row.periodName}
                  </TableCell>
                  <TableCell className="text-xs text-[#71717A]">
                    {row.dateRange}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {row.batches.map((b) => (
                        <Badge
                          key={b}
                          variant="secondary"
                          className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-[#FFF5FA] border-[#FBCFE8] text-[#18181B]"
                        >
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-[#18181B] text-right">
                    {formatRupiah(row.pemasukan)}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-[#71717A] text-right">
                    {formatRupiah(row.modal)}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-emerald-600 text-right">
                    {formatRupiah(row.labaBersih)}
                  </TableCell>
                  <TableCell className="text-xs text-[#71717A] max-w-[200px] truncate">
                    {row.notes}
                  </TableCell>
                  {onDelete && (
                    <TableCell className="text-center pr-6">
                      <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        className="p-1 rounded-md text-[#71717A] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus riwayat periode"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

