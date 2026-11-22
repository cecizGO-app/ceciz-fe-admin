import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/verification/TablePagination";
import { formatRupiah } from "./formatters";
import type { ProfitPeriodHistoryItem } from "@/types/reports";

const HISTORY_PAGE_SIZE = 10;

interface LabaGoHistoryTableProps {
  history: ProfitPeriodHistoryItem[];
  onDelete?: (id: string) => void;
}

export const LabaGoHistoryTable: React.FC<LabaGoHistoryTableProps> = ({
  history,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(history.length / HISTORY_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = history.length === 0 ? 0 : (safePage - 1) * HISTORY_PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * HISTORY_PAGE_SIZE, history.length);
  const paginatedHistory = history.slice(
    (safePage - 1) * HISTORY_PAGE_SIZE,
    safePage * HISTORY_PAGE_SIZE,
  );

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
                  Belum ada data periode laba yang disimpan. Silakan simpan
                  periode di atas.
                </TableCell>
              </TableRow>
            ) : (
              paginatedHistory.map((row) => (
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
                        <span
                          key={b}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-[#FBCFE8] bg-[#FFF5FA] text-[#EC4899] font-bold text-[11px]"
                        >
                          {b}
                        </span>
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onDelete(row.id)}
                        className="size-7 rounded-md text-[#71717A] hover:text-rose-600 hover:bg-rose-50"
                        title="Hapus riwayat periode"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={safePage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalCount={history.length}
          itemLabel="periode"
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
};
