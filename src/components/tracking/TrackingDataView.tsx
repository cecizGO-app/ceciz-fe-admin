import React from "react";
import { Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Pkg } from "@/types/tracking";
import { StageBadge, CheckBadge, MiniCheck, ResiChip } from "./TrackingBadges";
import { TRACKING_PAGE_SIZE } from "@/hooks";

interface TrackingDataViewProps {
  items: Pkg[];
  totalFilteredCount: number;
  tab: "active" | "done" | "all";
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onEdit: (pkg: Pkg) => void;
  onCopyResi: (resi: string) => void;
}

export const TrackingDataView: React.FC<TrackingDataViewProps> = ({
  items,
  totalFilteredCount,
  tab,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onCopyResi,
}) => {
  return (
    <>
      {/* Desktop View (xl+) using shadcn Table */}
      <div className="hidden xl:block overflow-x-auto">
        <Table className="w-full table-fixed min-w-[880px]">
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[20%]" />
            <col className="w-[15%]" />
            <col className="w-[17%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
          </colgroup>
          <TableHeader className="bg-[#FFF5FA]/70 border-y border-[#FBCFE8]/50">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="pl-6 pr-3 text-[11px] uppercase tracking-wider text-[#71717A] font-bold">
                Batch &amp; Buyer
              </TableHead>
              <TableHead className="px-3 text-[11px] uppercase tracking-wider text-[#71717A] font-bold">
                Barang &amp; Warehouse
              </TableHead>
              <TableHead className="px-3 text-[11px] uppercase tracking-wider text-[#71717A] font-bold">
                No. Resi
              </TableHead>
              <TableHead className="px-3 text-[11px] uppercase tracking-wider text-[#71717A] font-bold">
                Status Logistik
              </TableHead>
              <TableHead className="px-3 text-[11px] uppercase tracking-wider text-[#71717A] font-bold">
                Checklist
              </TableHead>
              <TableHead className="pl-3 pr-6 text-right text-[11px] uppercase tracking-wider text-[#71717A] font-bold">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow
                key={p.id}
                className="border-b border-[#FBCFE8]/30 last:border-b-0 hover:bg-[#FFF5FA]/40 transition-colors"
              >
                <TableCell className="pl-6 pr-3 py-4 align-middle">
                  <p className="font-mono text-xs font-bold text-[#18181B]">
                    {p.batch}
                  </p>
                  <p
                    className="mt-0.5 truncate text-xs font-semibold text-[#18181B]"
                    title={`${p.buyer} ${p.handle}`}
                  >
                    {p.buyer}
                  </p>
                  <p className="truncate text-[11px] text-[#71717A]">
                    {p.handle}
                  </p>
                </TableCell>
                <TableCell className="px-3 py-4 align-middle">
                  <p
                    className="truncate text-xs font-medium text-[#18181B]"
                    title={p.item}
                  >
                    {p.item}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-[#71717A]">
                    {p.warehouse}
                  </p>
                </TableCell>
                <TableCell className="px-3 py-4 align-middle">
                  <ResiChip resi={p.resi} onCopy={onCopyResi} />
                </TableCell>
                <TableCell className="px-3 py-4 align-middle">
                  <StageBadge s={p.stage} />
                  <p className="mt-1 whitespace-nowrap text-[11px] text-[#71717A]">
                    {p.updated} WIB
                  </p>
                </TableCell>
                <TableCell className="px-4 py-4 align-middle">
                  <div className="flex items-center gap-1.5">
                    <MiniCheck
                      on={p.co}
                      label="CO"
                      title={p.co ? "Sudah CO Shopee" : "Belum CO Shopee"}
                    />
                    <MiniCheck
                      on={p.album}
                      label="Album"
                      title={
                        p.album
                          ? "Foto album LINE terupload"
                          : "Album LINE belum"
                      }
                    />
                  </div>
                </TableCell>
                <TableCell className="pl-3 pr-6 py-4 text-right align-middle">
                  <div className="flex items-center justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 gap-1.5 text-xs text-primary border-[#FBCFE8] hover:bg-[#FFF5FA] hover:text-[#BE185D] hover:border-primary shadow-2xs"
                      onClick={() => onEdit(p)}
                      aria-label={`Edit tracking ${p.batch} ${p.buyer}`}
                    >
                      <Edit3 className="size-3.5" /> Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile / Tablet View (xl:hidden) */}
      <ul className="grid grid-cols-1 gap-3 border-t border-[#FBCFE8]/40 bg-[#FFF5FA]/40 p-3 sm:p-4 md:grid-cols-2 xl:hidden">
        {items.map((p) => (
          <li
            key={p.id}
            className="flex flex-col rounded-[16px] border border-[#FBCFE8]/60 bg-white p-4 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-sm font-bold text-[#18181B]">
                  {p.batch}
                </p>
                <p className="mt-0.5 text-xs text-[#71717A]">
                  {p.buyer} {p.handle}
                </p>
              </div>
              <StageBadge s={p.stage} />
            </div>
            <p className="mt-3 text-xs font-semibold text-[#18181B]">{p.item}</p>
            <p className="mt-0.5 text-[11px] text-[#71717A]">
              {p.warehouse} · Update {p.updated} WIB
            </p>
            <div className="mt-3">
              <ResiChip resi={p.resi} onCopy={onCopyResi} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#FBCFE8]/40 pt-3">
              <CheckBadge on={p.co} yes="CO: ✓" no="CO: —" />
              <CheckBadge on={p.album} yes="Album: ✓" no="Album: —" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-auto h-8 px-2.5 gap-1.5 text-xs text-primary border-[#FBCFE8] hover:bg-[#FFF5FA] hover:text-[#BE185D]"
                onClick={() => onEdit(p)}
              >
                <Edit3 className="size-3.5" /> Update Status
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <div className="border-t border-[#FBCFE8]/40 px-5 py-14 text-center">
          <p className="text-sm font-semibold text-[#18181B]">
            Tidak ada paket yang cocok
          </p>
          <p className="mt-1 text-xs text-[#71717A]">
            Coba ubah kata kunci atau filter negara, warehouse, dan status.
          </p>
        </div>
      )}

      {/* Pagination Toolbar */}
      <div className="flex flex-col gap-3 border-t border-[#FBCFE8]/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#71717A]">
          {totalFilteredCount === 0
            ? "Tidak ada data"
            : `Menampilkan ${(currentPage - 1) * TRACKING_PAGE_SIZE + 1}–${Math.min(
                currentPage * TRACKING_PAGE_SIZE,
                totalFilteredCount
              )} dari ${totalFilteredCount} ${
                tab === "active"
                  ? "paket berjalan"
                  : tab === "done"
                    ? "paket arsip"
                    : "pengiriman"
              }`}
        </p>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-9 px-3 text-xs"
          >
            Sebelumnya
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              type="button"
              variant={n === currentPage ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(n)}
              className={cn(
                "size-9 p-0 text-xs tabular-nums",
                n !== currentPage && "text-[#71717A] hover:bg-[#FFF5FA] hover:text-primary"
              )}
            >
              {n}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-9 px-3 text-xs"
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </>
  );
};
