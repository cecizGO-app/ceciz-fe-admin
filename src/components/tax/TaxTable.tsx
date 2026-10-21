import React from "react";
import {
  Eye,
  Pencil,
  FileText,
  CheckCircle2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TaxInvoiceItem } from "./types";

export type TaxSortField =
  | "buyer"
  | "batch"
  | "items"
  | "amount"
  | "deadline"
  | "status";

export type SortOrder = "asc" | "desc";

export interface TaxSortConfig {
  field: TaxSortField;
  order: SortOrder;
}

interface TaxTableProps {
  items: TaxInvoiceItem[];
  onViewDetail: (item: TaxInvoiceItem) => void;
  onEdit: (item: TaxInvoiceItem) => void;
  sortConfig: TaxSortConfig | null;
  onToggleSort: (field: TaxSortField) => void;
}

export const TaxTable: React.FC<TaxTableProps> = ({
  items,
  onViewDetail,
  onEdit,
  sortConfig,
  onToggleSort,
}) => {
  // Helper to render sort indicator arrow for any column
  const renderSortIcon = (field: TaxSortField) => {
    if (sortConfig?.field === field) {
      return sortConfig.order === "asc" ? (
        <ArrowUp className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
      ) : (
        <ArrowDown className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
      );
    }
    return (
      <ArrowUpDown className="w-3.5 h-3.5 text-[#71717A]/40 group-hover:text-[#EC4899] shrink-0 transition-colors" />
    );
  };

  // Render status badge with dot and details
  const renderStatusBadge = (item: TaxInvoiceItem) => {
    switch (item.status) {
      case "Pending":
        return (
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Pending
            </span>
            <div className="flex items-center gap-1 text-[11px] text-sky-600 font-medium mt-1">
              <FileText className="w-3 h-3 text-sky-600 shrink-0" />
              <span>Ada bukti transfer</span>
            </div>
          </div>
        );
      case "Unpaid":
        return (
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Unpaid
            </span>
            <span className="text-[11px] text-[#71717A] font-medium mt-1 block">
              Belum upload
            </span>
          </div>
        );
      case "Approved": {
        const bank = item.bankName || "BCA";
        return (
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Approved
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>Terverifikasi [{bank}]</span>
            </div>
          </div>
        );
      }
      case "Overdue":
        return (
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Overdue
            </span>
            <span className="text-[11px] text-[#71717A] font-medium mt-1 block">
              Belum upload
            </span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-[20px] border border-[#FBCFE8]/60 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#FCE7F3] bg-[#FFF5FA]/40 hover:bg-[#FFF5FA]/40">
              {/* Kolom 1: Invoice & Buyer (Sortable) */}
              <TableHead
                onClick={() => onToggleSort("buyer")}
                title="Klik untuk mengurutkan berdasarkan nama buyer"
                className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase py-3.5 px-4 min-w-[180px] cursor-pointer select-none group transition-colors hover:text-[#EC4899]"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={
                      sortConfig?.field === "buyer" ? "text-[#EC4899]" : ""
                    }
                  >
                    Invoice &amp; Buyer
                  </span>
                  {renderSortIcon("buyer")}
                </div>
              </TableHead>

              {/* Kolom 2: Batch Tercakup (Sortable) */}
              <TableHead
                onClick={() => onToggleSort("batch")}
                title="Klik untuk mengurutkan berdasarkan jumlah batch"
                className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase py-3.5 px-4 min-w-[140px] cursor-pointer select-none group transition-colors hover:text-[#EC4899]"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={
                      sortConfig?.field === "batch" ? "text-[#EC4899]" : ""
                    }
                  >
                    Batch Tercakup
                  </span>
                  {renderSortIcon("batch")}
                </div>
              </TableHead>

              {/* Kolom 3: Total Item (Sortable) */}
              <TableHead
                onClick={() => onToggleSort("items")}
                title="Klik untuk mengurutkan berdasarkan jumlah item"
                className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase py-3.5 px-4 min-w-[130px] cursor-pointer select-none group transition-colors hover:text-[#EC4899]"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={
                      sortConfig?.field === "items" ? "text-[#EC4899]" : ""
                    }
                  >
                    Total Item
                  </span>
                  {renderSortIcon("items")}
                </div>
              </TableHead>

              {/* Kolom 4: Total Tax (Sortable) */}
              <TableHead
                onClick={() => onToggleSort("amount")}
                title="Klik untuk mengurutkan berdasarkan total nominal tax"
                className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase py-3.5 px-4 min-w-[130px] cursor-pointer select-none group transition-colors hover:text-[#EC4899]"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={
                      sortConfig?.field === "amount" ? "text-[#EC4899]" : ""
                    }
                  >
                    Total Tax
                  </span>
                  {renderSortIcon("amount")}
                </div>
              </TableHead>

              {/* Kolom 5: Deadline (Sortable) */}
              <TableHead
                onClick={() => onToggleSort("deadline")}
                title="Klik untuk mengurutkan berdasarkan batas waktu pembayaran"
                className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase py-3.5 px-4 min-w-[140px] cursor-pointer select-none group transition-colors hover:text-[#EC4899]"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={
                      sortConfig?.field === "deadline" ? "text-[#EC4899]" : ""
                    }
                  >
                    Deadline
                  </span>
                  {renderSortIcon("deadline")}
                </div>
              </TableHead>

              {/* Kolom 6: Status (Sortable) */}
              <TableHead
                onClick={() => onToggleSort("status")}
                title="Klik untuk mengurutkan berdasarkan status pembayaran"
                className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase py-3.5 px-4 min-w-[150px] cursor-pointer select-none group transition-colors hover:text-[#EC4899]"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={
                      sortConfig?.field === "status" ? "text-[#EC4899]" : ""
                    }
                  >
                    Status
                  </span>
                  {renderSortIcon("status")}
                </div>
              </TableHead>

              {/* Kolom 7: Aksi */}
              <TableHead className="text-[11px] font-bold text-[#71717A] tracking-wider uppercase py-3.5 px-4 text-right min-w-[120px]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length > 0 ? (
              items.map((item) => {
                const isOverdue = item.status === "Overdue";
                const totalItemCount =
                  item.totalItemsCount ||
                  item.batches.reduce((sum, b) => sum + b.qty, 0);

                return (
                  <TableRow
                    key={item.id}
                    className="border-b border-[#FCE7F3]/60 hover:bg-[#FFF5FA]/25 transition-colors"
                  >
                    {/* Invoice & Buyer */}
                    <TableCell className="py-3 px-4 align-top">
                      <div className="font-bold text-xs sm:text-[13px] text-[#18181B] tracking-tight">
                        {item.id}
                      </div>
                      <div className="text-xs font-semibold text-[#18181B] mt-0.5">
                        {item.buyerName}
                      </div>
                      <div className="text-[11px] text-[#71717A] font-medium">
                        {item.buyerHandle}
                      </div>
                    </TableCell>

                    {/* Batch Tercakup */}
                    <TableCell className="py-3 px-4 align-top">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.batches.map((batch, idx) => (
                          <span
                            key={`${batch.batchCode}-${idx}`}
                            className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFF0F7] border border-[#FBCFE8] text-[11px] font-bold text-[#EC4899]"
                          >
                            {batch.batchCode}
                          </span>
                        ))}
                      </div>
                    </TableCell>

                    {/* Total Item */}
                    <TableCell className="py-3 px-4 align-top">
                      <div className="text-xs font-bold text-[#18181B]">
                        {totalItemCount} item
                      </div>
                      <div className="text-[11px] text-[#71717A] font-medium mt-0.5 line-clamp-1">
                        {item.itemSummary ||
                          item.batches
                            .map(
                              (b) =>
                                `${b.qty} ${b.isPhotocard ? "PC" : "Item"}`
                            )
                            .join(", ")}
                      </div>
                    </TableCell>

                    {/* Total Tax */}
                    <TableCell className="py-3 px-4 align-top">
                      <div className="text-xs font-bold text-[#18181B]">
                        Rp {item.totalAmount.toLocaleString("id-ID")}
                      </div>
                      {isOverdue &&
                        item.penaltyAmount > 0 &&
                        !item.penaltyWaived && (
                          <div className="text-[11px] font-semibold text-rose-600 mt-0.5">
                            + Denda Rp{" "}
                            {item.penaltyAmount.toLocaleString("id-ID")} &middot;
                            2 hr
                          </div>
                        )}
                    </TableCell>

                    {/* Deadline */}
                    <TableCell className="py-3 px-4 align-top">
                      <div
                        className={`text-xs font-semibold ${
                          isOverdue
                            ? "text-rose-600 font-bold"
                            : "text-[#18181B]"
                        }`}
                      >
                        {item.deadline}
                      </div>
                      <div className="text-[11px] text-[#71717A] font-medium mt-0.5">
                        Max CO: {item.maxCheckoutDate}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3 px-4 align-top">
                      {renderStatusBadge(item)}
                    </TableCell>

                    {/* Aksi & Edit Icon */}
                    <TableCell className="py-3 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Detail Button */}
                        <button
                          type="button"
                          onClick={() => onViewDetail(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[10px] border border-[#FBCFE8] bg-white hover:bg-[#FFF0F7] text-xs font-semibold text-[#EC4899] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 stroke-[2.2]" />
                          <span>Detail</span>
                        </button>

                        {/* Edit Icon Button */}
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          title={`Edit Invoice ${item.id}`}
                          aria-label={`Edit Invoice ${item.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] border border-transparent hover:border-[#FBCFE8] hover:bg-[#FFF0F7] text-[#71717A] hover:text-[#EC4899] transition-all cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-xs text-[#71717A] font-medium"
                >
                  Tidak ada invoice tax yang cocok dengan filter yang dipilih.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
