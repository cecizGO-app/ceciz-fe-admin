import React from "react";
import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TablePagination } from "./TablePagination";
import type { PaymentItem } from "./types";

interface VerificationTableProps {
  items: PaymentItem[];
  selectedIds: string[];
  onToggleSelectRow: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewProof: (item: PaymentItem) => void;
  onApproveSingle: (item: PaymentItem) => void;
  onRejectSingle: (item: PaymentItem) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalFilteredCount: number;
  pageSize: number;
}

function formatRupiah(val: number): string {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    val,
  );
}

const METHOD_DOTS: Record<string, string> = {
  BCA: "bg-blue-600",
  QRIS: "bg-fuchsia-600",
  SeaBank: "bg-orange-500",
  ShopeePay: "bg-amber-600",
  "Tunai / Cash": "bg-emerald-600",
};

export const VerificationTable: React.FC<VerificationTableProps> = ({
  items,
  selectedIds,
  onToggleSelectRow,
  onToggleSelectAll,
  onViewProof,
  onApproveSingle,
  onRejectSingle,
  currentPage,
  totalPages,
  onPageChange,
  totalFilteredCount,
  pageSize,
}) => {
  const allSelected =
    items.length > 0 && items.every((item) => selectedIds.includes(item.id));
  const someSelected =
    items.some((item) => selectedIds.includes(item.id)) && !allSelected;

  const startIndex =
    totalFilteredCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalFilteredCount);

  return (
    <div className="bg-white rounded-[20px] border border-[#FBCFE8]/50 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#FCE7F3] bg-[#FFF5FA]/30 hover:bg-[#FFF5FA]/30">
              <TableHead className="w-12 px-4 py-3.5 text-center">
                <Checkbox
                  checked={
                    allSelected ? true : someSelected ? "indeterminate" : false
                  }
                  onCheckedChange={onToggleSelectAll}
                  aria-label="Pilih semua baris"
                />
              </TableHead>
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase min-w-[160px]">
                Buyer
              </TableHead>
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase min-w-[85px]">
                Batch
              </TableHead>
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase min-w-[120px]">
                Nominal
              </TableHead>
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase min-w-[100px]">
                Metode
              </TableHead>
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase min-w-[85px]">
                Sumber
              </TableHead>
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase min-w-[160px]">
                Keterangan
              </TableHead>
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase min-w-[120px]">
                Waktu Upload
              </TableHead>
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase min-w-[110px]">
                Bukti Bayar
              </TableHead>
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase min-w-[100px]">
                Status
              </TableHead>
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase text-center min-w-[90px]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-12 text-center text-xs text-[#71717A]"
                >
                  Tidak ada data pembayaran yang sesuai dengan filter.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <TableRow
                    key={item.id}
                    className={`border-b border-[#FCE7F3]/70 transition-colors ${
                      isSelected ? "bg-[#FFF5FA]/60" : "hover:bg-[#FFF5FA]/30"
                    }`}
                  >
                    <TableCell className="px-4 py-3.5 text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelectRow(item.id)}
                      />
                    </TableCell>

                    <TableCell className="py-3.5">
                      <div className="font-bold text-xs text-[#18181B] leading-tight">
                        {item.buyerName}
                      </div>
                      <div className="text-[11px] text-[#71717A] mt-0.5">
                        {item.buyerUsername}
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-[#FBCFE8] bg-[#FFF5FA] text-[#EC4899] font-bold text-[11px]">
                        {item.batchCode}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <div className="font-bold text-xs text-[#18181B]">
                        Rp {formatRupiah(item.nominal)}
                      </div>
                      {item.denda && item.denda > 0 && (
                        <div className="inline-block mt-0.5 px-1.5 py-0.2 text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded">
                          + Denda Rp {formatRupiah(item.denda)}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#18181B]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            METHOD_DOTS[item.paymentMethod] || "bg-sky-600"
                          } shrink-0`}
                        />
                        <span>{item.paymentMethod}</span>
                      </div>
                    </TableCell>

                    {/* Sumber Column */}
                    <TableCell className="py-3.5">
                      {item.source === "Admin" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF5FA] border border-[#FBCFE8] text-[#EC4899]">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-[#71717A]">
                          Buyer
                        </span>
                      )}
                    </TableCell>

                    {/* Keterangan Column */}
                    <TableCell className="py-3.5 max-w-[170px]">
                      <div
                        className="text-xs text-[#18181B] truncate font-normal"
                        title={item.keterangan || "-"}
                      >
                        {item.keterangan || "-"}
                      </div>
                      {item.rejectReason && item.status === "REJECTED" && (
                        <div
                          className="text-[10px] text-rose-600 truncate mt-0.5 font-medium"
                          title={`Alasan tolak: ${item.rejectReason}`}
                        >
                          Alasan: {item.rejectReason}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5 text-xs text-[#18181B] whitespace-nowrap">
                      {item.uploadTime}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <button
                        type="button"
                        onClick={() => onViewProof(item)}
                        className="group inline-flex items-center gap-2 text-xs font-semibold text-[#EC4899] hover:text-[#DB2777] cursor-pointer"
                        title="Klik untuk melihat bukti transfer"
                      >
                        <div className="w-7 h-9 rounded-[6px] overflow-hidden border border-[#FBCFE8] bg-white shadow-2xs shrink-0 group-hover:border-[#EC4899] transition-all">
                          {item.proofImageUrl ? (
                            <img
                              src={item.proofImageUrl}
                              alt={`Bukti bayar ${item.buyerName}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-150"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[9px] text-slate-400">
                              -
                            </div>
                          )}
                        </div>
                        <span className="underline-offset-2 group-hover:underline">
                          Lihat Bukti
                        </span>
                      </button>
                    </TableCell>

                    <TableCell className="py-3.5">
                      {item.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50/70 border border-amber-200/60 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          Menunggu
                        </span>
                      )}
                      {item.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50/70 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          Disetujui
                        </span>
                      )}
                      {item.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50/70 border border-rose-200/60 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                          Ditolak
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5 text-center">
                      {item.status === "PENDING" ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onApproveSingle(item)}
                            title="Setujui Pembayaran"
                            className="w-8 h-8 rounded-[10px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectSingle(item)}
                            title="Tolak Pembayaran"
                            className="w-8 h-8 rounded-[10px] bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#A1A1AA] italic">
                          Selesai
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalCount={totalFilteredCount}
        onPageChange={onPageChange}
      />
    </div>
  );
};
