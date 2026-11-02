import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Plus,
} from "lucide-react";
import {
  CASHFLOW_CATEGORIES,
  type CashflowEntry,
} from "@/types/cashflow";

interface CashflowTableProps {
  entries: CashflowEntry[];
  loading?: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (entry: CashflowEntry) => void;
  onDelete: (entry: CashflowEntry) => void;
  onAddNew: () => void;
}

const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// Styling Akun Kas persis seperti kolom Metode di halaman Verifikasi Pembayaran (VerificationTable)
const METHOD_DOTS: Record<string, string> = {
  BCA: "bg-blue-600",
  QRIS: "bg-fuchsia-600",
  SeaBank: "bg-orange-500",
  SEABANK: "bg-orange-500",
  ShopeePay: "bg-amber-600",
  SPAY: "bg-amber-600",
  CASH: "bg-emerald-600",
  "Tunai / Cash": "bg-emerald-600",
};

const METHOD_LABELS: Record<string, string> = {
  BCA: "BCA",
  QRIS: "QRIS",
  SEABANK: "SeaBank",
  SeaBank: "SeaBank",
  SPAY: "ShopeePay",
  ShopeePay: "ShopeePay",
  CASH: "Tunai / Cash",
};

export const CashflowTable: React.FC<CashflowTableProps> = ({
  entries,
  loading = false,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEntries = entries.slice(startIndex, startIndex + pageSize);

  const getCategoryLabel = (categoryValue: string) => {
    const found =
      CASHFLOW_CATEGORIES.EXPENSE.find((c) => c.value === categoryValue) ||
      CASHFLOW_CATEGORIES.INCOME.find((c) => c.value === categoryValue);
    return found ? found.label : categoryValue;
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-10 h-10 border-3 border-[#EC4899] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#71717A]">Memuat catatan transaksi cashflow...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FFF5FA] border border-[#FBCFE8] flex items-center justify-center text-[#EC4899] mb-3">
          <Receipt className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-[#18181B]">
          Belum Ada Transaksi Cashflow
        </h3>
        <p className="text-xs text-[#71717A] max-w-sm mt-1 mb-4 leading-relaxed">
          Catat arus kas masuk &amp; keluar untuk melacak saldo operasional, pembelian packing, pembayaran seller, dan fee admin.
        </p>
        <Button
          type="button"
          onClick={onAddNew}
          className="h-9 px-4 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold gap-1.5 shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Transaksi Pertama</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* =========================================================================
          1. DESKTOP & TABLET VIEW (TABLE) - Visible on md & lg screens (>= 768px)
         ========================================================================= */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#FFF5FA]/60 border-b border-[#FBCFE8]/40 hover:bg-[#FFF5FA]/60">
              <TableHead className="w-[120px] text-xs font-semibold text-[#71717A]">
                Tanggal
              </TableHead>
              <TableHead className="w-[170px] text-xs font-semibold text-[#71717A]">
                Tipe &amp; Kategori
              </TableHead>
              <TableHead className="min-w-[240px] text-xs font-semibold text-[#71717A]">
                Deskripsi &amp; Keperluan
              </TableHead>
              <TableHead className="w-[130px] text-xs font-semibold text-[#71717A]">
                Akun Kas
              </TableHead>
              <TableHead className="w-[160px] text-right text-xs font-semibold text-[#71717A]">
                Nominal
              </TableHead>
              <TableHead className="w-[140px] text-xs font-semibold text-[#71717A]">
                Dibuat Oleh
              </TableHead>
              <TableHead className="w-[90px] text-right text-xs font-semibold text-[#71717A]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEntries.map((item) => {
              const isIncome = item.type === "INCOME";

              return (
                <TableRow
                  key={item.id}
                  className="border-b border-[#FBCFE8]/20 hover:bg-[#FFF5FA]/40 transition-colors"
                >
                  {/* Tanggal */}
                  <TableCell className="text-xs text-[#18181B] font-medium">
                    <div className="flex items-center gap-1.5 text-[#71717A]">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[#18181B]">{formatDate(item.entryDate)}</span>
                    </div>
                  </TableCell>

                  {/* Tipe & Kategori */}
                  <TableCell className="space-y-1">
                    <div className="flex items-center gap-1">
                      {isIncome ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-md gap-0.5"
                        >
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                          <span>Masuk</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-semibold px-2 py-0.5 rounded-md gap-0.5"
                        >
                          <ArrowUpRight className="w-3 h-3 text-rose-600" />
                          <span>Keluar</span>
                        </Badge>
                      )}
                    </div>
                    <p
                      className="text-[11px] text-[#71717A] truncate max-w-[160px]"
                      title={getCategoryLabel(item.category)}
                    >
                      {getCategoryLabel(item.category)}
                    </p>
                  </TableCell>

                  {/* Deskripsi & Catatan */}
                  <TableCell>
                    <p className="text-xs font-semibold text-[#18181B] line-clamp-1">
                      {item.description}
                    </p>
                    {item.notes && (
                      <p className="text-[11px] text-[#71717A] line-clamp-1 mt-0.5 italic">
                        {item.notes}
                      </p>
                    )}
                  </TableCell>

                  {/* Akun Kas - Mengikuti gaya titik + teks persis halaman Verifikasi Pembayaran */}
                  <TableCell className="py-3.5">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#18181B]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          METHOD_DOTS[item.paymentMethod] || "bg-sky-600"
                        } shrink-0`}
                      />
                      <span>{METHOD_LABELS[item.paymentMethod] || item.paymentMethod}</span>
                    </div>
                  </TableCell>

                  {/* Nominal */}
                  <TableCell className="text-right">
                    <span
                      className={`text-xs font-bold ${
                        isIncome ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isIncome ? "+ " : "- "}
                      {formatRupiah(item.amount)}
                    </span>
                  </TableCell>

                  {/* Dibuat Oleh */}
                  <TableCell className="text-xs text-[#71717A]">
                    <span className="truncate block max-w-[120px]">
                      {item.createdByName || "Owner (Aurel)"}
                    </span>
                  </TableCell>

                  {/* Aksi */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(item)}
                        className="w-7 h-7 text-[#71717A] hover:text-[#EC4899] hover:bg-[#FFF5FA] rounded-lg cursor-pointer"
                        title="Edit transaksi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(item)}
                        className="w-7 h-7 text-[#71717A] hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Hapus transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* =========================================================================
          2. MOBILE VIEW (CARD LIST) - Optimized for Phone screens (< 768px)
         ========================================================================= */}
      <div className="block md:hidden divide-y divide-[#FBCFE8]/30">
        {paginatedEntries.map((item) => {
          const isIncome = item.type === "INCOME";

          return (
            <div
              key={item.id}
              className="p-4 space-y-2.5 hover:bg-[#FFF5FA]/30 transition-colors"
            >
              {/* Header Card: Tipe, Akun Kas (Dot + Text), Tanggal */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {isIncome ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-md gap-0.5"
                    >
                      <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                      <span>Masuk</span>
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-semibold px-2 py-0.5 rounded-md gap-0.5"
                    >
                      <ArrowUpRight className="w-3 h-3 text-rose-600" />
                      <span>Keluar</span>
                    </Badge>
                  )}

                  {/* Akun Kas: Dot + Label */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#18181B]">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        METHOD_DOTS[item.paymentMethod] || "bg-sky-600"
                      } shrink-0`}
                    />
                    <span>{METHOD_LABELS[item.paymentMethod] || item.paymentMethod}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#71717A] flex items-center gap-1 shrink-0">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(item.entryDate)}</span>
                </div>
              </div>

              {/* Deskripsi & Kategori */}
              <div>
                <h4 className="text-xs font-bold text-[#18181B] leading-snug">
                  {item.description}
                </h4>
                <p className="text-[11px] text-[#71717A] mt-0.5">
                  {getCategoryLabel(item.category)}
                </p>
                {item.notes && (
                  <p className="text-[10.5px] text-[#71717A]/80 italic mt-1 bg-[#FFF5FA] p-1.5 rounded-md border border-[#FBCFE8]/30">
                    &ldquo;{item.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Bottom: Nominal & Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-[#FBCFE8]/20">
                <span
                  className={`text-sm font-bold ${
                    isIncome ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isIncome ? "+ " : "- "}
                  {formatRupiah(item.amount)}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="h-8 px-2.5 text-xs text-[#71717A] hover:text-[#EC4899] hover:bg-[#FFF5FA] rounded-lg gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          3. PAGINATION BAR
         ========================================================================= */}
      <div className="p-3.5 sm:p-4 border-t border-[#FBCFE8]/40 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[#71717A]">
          Menampilkan{" "}
          <span className="font-semibold text-[#18181B]">
            {entries.length === 0 ? 0 : startIndex + 1}
          </span>{" "}
          -{" "}
          <span className="font-semibold text-[#18181B]">
            {Math.min(startIndex + pageSize, entries.length)}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-[#18181B]">{entries.length}</span>{" "}
          transaksi
        </p>

        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 px-2.5 text-xs rounded-xl border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#71717A] disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            <span>Sebelumnya</span>
          </Button>

          <span className="text-xs font-semibold px-2 text-[#18181B]">
            {currentPage} / {totalPages}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 px-2.5 text-xs rounded-xl border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#71717A] disabled:opacity-40 cursor-pointer"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
