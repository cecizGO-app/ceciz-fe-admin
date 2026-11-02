import React, { useEffect, useMemo, useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PoAlbumStatsCards,
  PoAlbumFilterBar,
  PoAlbumTable,
  PoAlbumInputPanel,
  PoAlbumEditDrawer,
} from "@/components/po-album";
import type {
  PoAlbumOrder,
  PaymentMethodType,
  CoWebStatus,
} from "@/types/po-album";
import {
  fetchPoAlbumOrders,
  savePoAlbumBatch,
  updatePoAlbumOrder,
} from "@/services/po-album.service";

const CO_LIST: CoWebStatus[] = [
  "Not Started",
  "CO Open",
  "Order Submitted",
  "Completed",
];

const METHODS: PaymentMethodType[] = ["BCA", "QRIS", "SeaBank", "ShopeePay"];

const PAGE_SIZE = 6;
const payStatus = (r: PoAlbumOrder) =>
  r.dpDone && r.fpDone ? "Paid (Lunas)" : r.dpDone ? "DP Paid" : "Pending";
const countryOf = (b: string) => b.split("-")[0];

export const PoAlbumPage: React.FC = () => {
  const [rows, setRows] = useState<PoAlbumOrder[]>([]);
  const [q, setQ] = useState("");
  const [pay, setPay] = useState("ALL");
  const [co, setCo] = useState("ALL");
  const [country, setCountry] = useState("ALL");
  const [page, setPage] = useState(1);
  const [inputOpen, setInputOpen] = useState(false);
  const [editItem, setEditItem] = useState<PoAlbumOrder | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchPoAlbumOrders().then((data) => {
      setRows(data);
    });
  }, []);

  const notify = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (pay !== "ALL" && payStatus(r) !== pay) return false;
      if (co !== "ALL" && r.co !== co) return false;
      if (country !== "ALL" && countryOf(r.batch) !== country) return false;
      if (
        s &&
        ![r.batch, r.buyer, r.album, r.member].some((x) =>
          x.toLowerCase().includes(s)
        )
      ) {
        return false;
      }
      return true;
    });
  }, [rows, q, pay, co, country]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const resetPage = () => setPage(1);

  // Dynamic KPI Stats Calculation
  const stats = useMemo(() => {
    let waitingFp = 0;
    let coWebOpen = 0;
    let totalCollected = 0;

    for (const r of rows) {
      if (r.dpDone && !r.fpDone) waitingFp++;
      if (r.co === "CO Open") coWebOpen++;
      if (r.dpDone) totalCollected += r.dp;
      if (r.fpDone) totalCollected += r.fp;
    }

    return {
      totalOrders: rows.length,
      waitingFp,
      coWebOpen,
      totalCollected,
    };
  }, [rows]);

  const activeBatchCount = useMemo(
    () => new Set(rows.map((r) => r.batch)).size,
    [rows]
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-control text-xs font-semibold shadow-lg flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-emerald-200 bg-surface text-emerald-900 shadow-emerald-500/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Section matching Ceciz GO Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-[#71717A] mb-1">
            <span className="text-[#71717A]">Operasional</span>
            <span>&gt;</span>
            <span className="text-[#EC4899] font-medium">
              PO Album / CO Web
            </span>
          </nav>
          <h1 className="text-[24px] sm:text-[30px] font-bold text-ink tracking-tight">
            PO Album / CO Web
          </h1>
          <p className="text-xs sm:text-[14px] text-ink-2 mt-1 leading-relaxed">
            Kelola pesanan album pre-order dengan skema bertahap DP & FP,
            pantau progres checkout web seller, dan rekapitulasi member.
          </p>
        </div>

        {!inputOpen && (
          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <Button
              type="button"
              onClick={() => setInputOpen(true)}
              className="h-10 sm:h-11 px-4 sm:px-5 rounded-control bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-hover transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Input PO Album Baru</span>
            </Button>
          </div>
        )}
      </div>

      {/* 4 Stats Cards */}
      <PoAlbumStatsCards
        stats={stats}
        activeBatchCount={activeBatchCount}
      />

      {/* Spreadsheet Input Panel (Conditional) */}
      {inputOpen && (
        <PoAlbumInputPanel
          onClose={() => setInputOpen(false)}
          onSave={async (added) => {
            const saved = await savePoAlbumBatch(added);
            setRows((rs) => [...saved, ...rs]);
            setInputOpen(false);
            resetPage();
            notify(
              `${added.length} pesanan disimpan & tampil di dashboard buyer`
            );
          }}
        />
      )}

      {/* Filter and Search Bar with Select Components */}
      <PoAlbumFilterBar
        searchQuery={q}
        onSearchChange={(val) => {
          setQ(val);
          resetPage();
        }}
        payStatusFilter={pay}
        onPayStatusFilterChange={(val) => {
          setPay(val);
          resetPage();
        }}
        coStatusFilter={co}
        onCoStatusFilterChange={(val) => {
          setCo(val);
          resetPage();
        }}
        countryFilter={country}
        onCountryFilterChange={(val) => {
          setCountry(val);
          resetPage();
        }}
        coStatusList={CO_LIST}
      />

      {/* Table Section with Pagination */}
      <PoAlbumTable
        orders={paginatedOrders}
        onEdit={(item) => setEditItem(item)}
        currentPage={currentPage}
        totalPages={totalPages}
        totalFiltered={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={(p) => setPage(p)}
      />

      {/* Edit & Pelunasan Drawer (Slide-out) */}
      {editItem && (
        <PoAlbumEditDrawer
          order={editItem}
          onClose={() => setEditItem(null)}
          onSave={async (updated) => {
            await updatePoAlbumOrder(updated.id, updated);
            setRows((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
            setEditItem(null);
            notify(`Pesanan ${updated.batch} · ${updated.buyer} diperbarui`);
          }}
          methods={METHODS}
          coList={CO_LIST}
        />
      )}
    </div>
  );
};

export default PoAlbumPage;
