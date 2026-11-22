import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CountryFlag } from "@/components/icons/CountryFlag";
import { BatchRowActions } from "./BatchRowActions";
import { TablePagination } from "@/components/verification/TablePagination";
import type { BatchItem, BatchStatus } from "@/types/batch";

const BATCH_PAGE_SIZE = 10;

interface BatchTableProps {
  batches: BatchItem[];
  totalBatchesCount: number;
  onEditBatch?: (batchId: string) => void;
  onCalculateBatch: (batch: BatchItem) => void;
  onCopyBatch: (batch: BatchItem) => void;
  onToggleHideBatch: (batchId: string) => void;
  onUpdateBatchStatus: (batchId: string, status: BatchStatus) => void;
  onDeleteBatch?: (batchId: string) => void;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount);
}

export const BatchTable: React.FC<BatchTableProps> = ({
  batches,
  onEditBatch,
  onCalculateBatch,
  onCopyBatch,
  onToggleHideBatch,
  onUpdateBatchStatus,
  onDeleteBatch,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(batches.length / BATCH_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = batches.length === 0 ? 0 : (safePage - 1) * BATCH_PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * BATCH_PAGE_SIZE, batches.length);
  const paginatedBatches = batches.slice(
    (safePage - 1) * BATCH_PAGE_SIZE,
    safePage * BATCH_PAGE_SIZE,
  );

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="min-w-[880px]">
          <TableHeader>
            <TableRow className="bg-[#FFF5FA]/60 border-b border-[#FCE7F3] hover:bg-[#FFF5FA]/60">
              <TableHead className="py-3 px-5 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                NOMOR BATCH
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                NEGARA
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                TANGGAL
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                WAREHOUSE / PROXY
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                BUYER
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                TOTAL PC
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                STATUS
              </TableHead>
              <TableHead className="py-3 px-4 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                KALKULASI INTERNAL
              </TableHead>
              <TableHead className="py-3 px-4 w-12 text-center text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                <span className="sr-only">Aksi</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedBatches.length > 0 ? (
              paginatedBatches.map((batch) => {
                return (
                  <TableRow
                    key={batch.id}
                    className="border-b border-[#FCE7F3]/70 hover:bg-[#FFF5FA]/40 transition-colors"
                  >
                    {/* Nomor Batch */}
                    <TableCell className="py-3.5 px-5 font-bold text-xs text-[#18181B]">
                      {batch.batchNumber}
                      {batch.isHidden && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-500">
                          Tersembunyi
                        </span>
                      )}
                    </TableCell>

                    {/* Negara Pill */}
                    <TableCell className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] bg-white border border-[#FBCFE8] text-xs font-semibold text-[#18181B] shadow-2xs">
                        <CountryFlag
                          code={batch.countryCode}
                          className="w-4 h-3 rounded-[2px]"
                        />
                        <span>{batch.countryCode}</span>
                      </div>
                    </TableCell>

                    {/* Tanggal */}
                    <TableCell className="py-3.5 px-4 text-xs text-[#71717A]">
                      {batch.date}
                    </TableCell>

                    {/* Warehouse / Proxy */}
                    <TableCell className="py-3.5 px-4 text-xs font-medium text-[#18181B]">
                      {batch.warehouseProxy}
                    </TableCell>

                    {/* Buyer */}
                    <TableCell className="py-3.5 px-4 text-xs text-[#71717A]">
                      {batch.buyerCount} buyer
                    </TableCell>

                    {/* Total PC */}
                    <TableCell className="py-3.5 px-4 text-xs font-bold text-[#18181B]">
                      {batch.totalPc} PC
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3.5 px-4">
                      {batch.status === "Open" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Open</span>
                        </span>
                      )}
                      {batch.status === "Closed" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          <span>Closed</span>
                        </span>
                      )}
                      {batch.status === "Archived" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span>Archived</span>
                        </span>
                      )}
                    </TableCell>

                    {/* Kalkulasi Internal */}
                    <TableCell className="py-3.5 px-4">
                      {batch.labaAmount !== null ? (
                        <button
                          type="button"
                          onClick={() => onCalculateBatch(batch)}
                          className="inline-flex cursor-pointer transition-transform hover:scale-105"
                          title="Klik untuk lihat / ubah internal calculation"
                        >
                          <Badge
                            variant="secondary"
                            className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full hover:bg-emerald-100"
                          >
                            Laba Rp {formatRupiah(batch.labaAmount)}
                          </Badge>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onCalculateBatch(batch)}
                          className="text-xs text-[#71717A] hover:text-[#EC4899] hover:underline cursor-pointer transition-colors"
                          title="Klik untuk hitung internal calculation"
                        >
                          Belum dihitung
                        </button>
                      )}
                    </TableCell>

                    {/* Action Dropdown Menu */}
                    <TableCell className="py-3.5 px-4 text-center">
                      <BatchRowActions
                        batch={batch}
                        onEdit={onEditBatch}
                        onCalculate={onCalculateBatch}
                        onCopy={onCopyBatch}
                        onToggleHide={onToggleHideBatch}
                        onUpdateStatus={onUpdateBatchStatus}
                        onDelete={onDeleteBatch}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-12 text-center text-xs text-[#71717A]"
                >
                  Tidak ada batch yang cocok dengan filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Pagination Footer */}
      <TablePagination
        currentPage={safePage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalCount={batches.length}
        itemLabel="batch"
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default BatchTable;
