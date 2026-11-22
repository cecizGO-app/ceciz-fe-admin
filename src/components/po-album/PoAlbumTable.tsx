import React from "react";
import { Pencil, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/verification/TablePagination";
import type {
  PoAlbumOrder,
  PaymentMethodType,
  CoWebStatus,
} from "@/types/po-album";

interface PoAlbumTableProps {
  orders: PoAlbumOrder[];
  onEdit: (order: PoAlbumOrder) => void;
  currentPage: number;
  totalPages: number;
  totalFiltered: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");

const coTone: Record<CoWebStatus, string> = {
  "Not Started": "bg-slate-100 text-slate-700 border-slate-200",
  "CO Open": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Order Submitted": "bg-purple-50 text-purple-700 border-purple-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function CoBadge({ status }: { status: CoWebStatus }) {
  const tone = coTone[status] || coTone["Not Started"];
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-semibold ${tone}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function PayBadge({ done, wait }: { done: boolean; wait: "pending" | "fp" }) {
  if (done) {
    return (
      <span className="inline-flex h-5 items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2 text-[11px] text-emerald-700 font-semibold">
        <Check className="w-3 h-3 stroke-[3]" /> Paid
      </span>
    );
  }
  return wait === "pending" ? (
    <span className="inline-flex h-5 items-center whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2 text-[11px] text-amber-700 font-semibold">
      Pending
    </span>
  ) : (
    <span className="inline-flex h-5 items-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-100 px-2 text-[11px] text-slate-600 font-semibold">
      Waiting FP
    </span>
  );
}

function PayCell({
  amount,
  done,
  method,
  wait,
}: {
  amount: number;
  done: boolean;
  method: PaymentMethodType;
  wait: "pending" | "fp";
}) {
  return (
    <div className="min-w-0">
      <p className="text-[14px] text-ink font-bold tabular-nums">
        {rp(amount)}
      </p>
      <div className="mt-1 flex items-center gap-1.5">
        <PayBadge done={done} wait={wait} />
        {done && (
          <span className="truncate text-[11px] text-ink-2 font-medium">
            {method}
          </span>
        )}
      </div>
    </div>
  );
}

export const PoAlbumTable: React.FC<PoAlbumTableProps> = ({
  orders,
  onEdit,
  currentPage,
  totalPages,
  totalFiltered,
  pageSize,
  onPageChange,
}) => {
  return (
    <div className="rounded-[14px] border border-[#FCE7F3] overflow-hidden bg-white">
      {/* Desktop Table View */}
      <div className="hidden xl:block overflow-x-auto">
        <Table className="w-full table-fixed">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[22%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[12%]" />
            <col className="w-[13%]" />
            <col className="w-[8%]" />
          </colgroup>
          <TableHeader>
            <TableRow className="border-b border-[#FCE7F3] bg-[#FFF5FA]/60 hover:bg-[#FFF5FA]/60">
              <TableHead className="py-3.5 pl-5 pr-4 text-left text-[11px] uppercase tracking-wider text-ink-2 font-bold whitespace-nowrap">
                Batch & Buyer
              </TableHead>
              <TableHead className="py-3.5 pr-4 text-left text-[11px] uppercase tracking-wider text-ink-2 font-bold whitespace-nowrap">
                Album & Member
              </TableHead>
              <TableHead className="py-3.5 pr-4 text-left text-[11px] uppercase tracking-wider text-ink-2 font-bold whitespace-nowrap">
                Skema DP
              </TableHead>
              <TableHead className="py-3.5 pr-4 text-left text-[11px] uppercase tracking-wider text-ink-2 font-bold whitespace-nowrap">
                Skema FP
              </TableHead>
              <TableHead className="py-3.5 pr-4 text-left text-[11px] uppercase tracking-wider text-ink-2 font-bold whitespace-nowrap">
                Total
              </TableHead>
              <TableHead className="py-3.5 pr-4 text-left text-[11px] uppercase tracking-wider text-ink-2 font-bold whitespace-nowrap">
                Status CO
              </TableHead>
              <TableHead className="py-3.5 pr-5 text-right text-[11px] uppercase tracking-wider text-ink-2 font-bold whitespace-nowrap">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((r) => (
                <TableRow
                  key={r.id}
                  className="border-b border-divider/60 last:border-b-0 hover:bg-subpanel/30 transition-colors"
                >
                  <TableCell className="py-3.5 pl-5 pr-4 align-middle">
                    <p className="truncate font-mono text-xs font-bold text-ink">
                      {r.batch}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-primary font-medium">
                      {r.buyer}
                    </p>
                  </TableCell>
                  <TableCell className="py-3.5 pr-4 align-middle">
                    <p
                      className="truncate text-xs font-semibold text-ink"
                      title={r.album}
                    >
                      {r.album}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-ink-2">
                      Member:{" "}
                      <span className="font-semibold text-ink">{r.member}</span>{" "}
                      &middot; {r.qty} pcs
                    </p>
                    {r.note && (
                      <p
                        className="mt-0.5 truncate text-[11px] italic text-ink-3"
                        title={r.note}
                      >
                        &ldquo;{r.note}&rdquo;
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5 pr-4 align-middle">
                    <PayCell
                      amount={r.dp}
                      done={r.dpDone}
                      method={r.dpMethod}
                      wait="pending"
                    />
                  </TableCell>
                  <TableCell className="py-3.5 pr-4 align-middle">
                    <PayCell
                      amount={r.fp}
                      done={r.fpDone}
                      method={r.fpMethod}
                      wait="fp"
                    />
                  </TableCell>
                  <TableCell className="py-3.5 pr-4 align-middle text-[14px] text-ink font-bold tabular-nums">
                    {rp(r.dp + r.fp)}
                  </TableCell>
                  <TableCell className="py-3.5 pr-4 align-middle">
                    <CoBadge status={r.co} />
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 align-middle text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(r)}
                      aria-label={`Edit ${r.batch} ${r.buyer}`}
                      title="Edit / Pelunasan FP"
                      className="h-8 px-2.5 rounded-[10px] text-primary hover:text-primary-hover hover:bg-subpanel text-xs font-semibold"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : null}
          </TableBody>
        </Table>
      </div>

      {/* Mobile / Tablet List Cards */}
      <ul className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:hidden bg-slate-50/50">
        {orders.map((r) => (
          <li
            key={r.id}
            className="flex flex-col rounded-control border border-border/80 bg-surface p-4 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-sm font-bold text-ink">{r.batch}</p>
                <p className="text-xs text-primary font-medium">{r.buyer}</p>
              </div>
              <CoBadge status={r.co} />
            </div>
            <p className="mt-3 text-xs font-semibold text-ink">{r.album}</p>
            <p className="text-[11px] text-ink-2 mt-0.5">
              Member: {r.member}
              {r.note ? ` &middot; "${r.note}"` : ""}
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-2 rounded-[12px] bg-subpanel/60 p-2.5 border border-border/50">
              <div className="min-w-0">
                <dt className="text-[10px] text-ink-2 uppercase font-bold">DP</dt>
                <dd className="truncate text-xs font-bold text-ink tabular-nums">
                  {rp(r.dp)}
                </dd>
                <dd className="mt-0.5">
                  <PayBadge done={r.dpDone} wait="pending" />
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] text-ink-2 uppercase font-bold">FP</dt>
                <dd className="truncate text-xs font-bold text-ink tabular-nums">
                  {rp(r.fp)}
                </dd>
                <dd className="mt-0.5">
                  <PayBadge done={r.fpDone} wait="fp" />
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] text-ink-2 uppercase font-bold">Total</dt>
                <dd className="truncate text-xs font-extrabold text-primary tabular-nums">
                  {rp(r.dp + r.fp)}
                </dd>
              </div>
            </dl>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(r)}
              className="mt-3 w-full h-9 rounded-control text-primary hover:text-primary-hover hover:bg-subpanel text-xs font-semibold"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit / Pelunasan FP</span>
            </Button>
          </li>
        ))}
      </ul>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="py-14 text-center px-4">
          <p className="text-sm font-semibold text-ink">
            Tidak ada pesanan yang cocok
          </p>
          <p className="mt-1 text-xs text-ink-2">
            Coba ubah kata kunci atau sesuaikan filter status bayar, status CO,
            dan negara.
          </p>
        </div>
      )}

      {/* Pagination Footer */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1}
        endIndex={Math.min(currentPage * pageSize, totalFiltered)}
        totalCount={totalFiltered}
        itemLabel="pesanan album"
        onPageChange={onPageChange}
      />
    </div>
  );
};

