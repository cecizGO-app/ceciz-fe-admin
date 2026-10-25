import { useState, useMemo, useEffect, useCallback } from "react";
import type { Pkg, TrackingTab } from "@/types/tracking";
import { SEED_TRACKING_PACKAGES } from "@/mocks/mockTrackingData";
import {
  getAllTrackingApi,
  updateTrackingApi,
  mapBackendTrackingToPkg,
  mapFrontendStageToBackend,
} from "@/services/tracking.service";

export const TRACKING_PAGE_SIZE = 8;
export type { TrackingTab };

const BASE_WAREHOUSES = [
  "Guangzhou A",
  "Seoul WH",
  "Osaka Hub",
  "Bangkok 2",
  "Jakarta Admin",
];

export function useTracking() {
  const [rows, setRows] = useState<Pkg[]>(SEED_TRACKING_PACKAGES);
  const [tab, setTab] = useState<TrackingTab>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState("Semua Negara");
  const [warehouse, setWarehouse] = useState("Semua Warehouse");
  const [stage, setStage] = useState("Semua Status");
  const [page, setPage] = useState(1);
  const [editingPkg, setEditingPkg] = useState<Pkg | null>(null);
  const [warehouses, setWarehouses] = useState<string[]>(BASE_WAREHOUSES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Status sinkronisasi backend
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  /**
   * Fetch seluruh data tracking dari API backend
   */
  const loadTrackingData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);
      else setIsSyncing(true);
      setFetchError(null);

      const data = await getAllTrackingApi();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((t, idx) => mapBackendTrackingToPkg(t, idx));
        setRows(mapped);

        // Ekstrak nama warehouse unik
        const uniqueWhs = Array.from(
          new Set(
            [...BASE_WAREHOUSES, ...mapped.map((p) => p.warehouse)].filter(
              Boolean,
            ),
          ),
        );
        setWarehouses(uniqueWhs);
      }
    } catch (err: unknown) {
      console.warn("Backend tracking API unavailable, using fallback:", err);
      setFetchError(
        err instanceof Error
          ? err.message
          : "Belum dapat terhubung ke server tracking. Menggunakan data cadangan.",
      );
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadTrackingData(true);
  }, [loadTrackingData]);

  const copyResi = async (resi: string) => {
    try {
      await navigator.clipboard.writeText(resi);
      notify(`Resi ${resi} berhasil disalin ke clipboard`);
    } catch {
      notify(`Resi ${resi} disalin`);
    }
  };

  const activeCount = useMemo(
    () => rows.filter((r) => r.stage !== "Done").length,
    [rows],
  );
  const doneCount = useMemo(() => rows.length - activeCount, [rows, activeCount]);

  const filteredRows = useMemo(() => {
    const s = searchQuery.trim().toLowerCase();
    const code = country.split(" ").pop();
    return rows.filter(
      (r) =>
        (tab === "all" ||
          (tab === "done" ? r.stage === "Done" : r.stage !== "Done")) &&
        (country === "Semua Negara" || r.country === code) &&
        (warehouse === "Semua Warehouse" || r.warehouse === warehouse) &&
        (stage === "Semua Status" || r.stage === stage) &&
        (!s ||
          [r.batch, r.buyer, r.handle, r.item, ...r.resi].some((x) =>
            x.toLowerCase().includes(s),
          )),
    );
  }, [rows, tab, searchQuery, country, warehouse, stage]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / TRACKING_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = useMemo(() => {
    return filteredRows.slice(
      (currentPage - 1) * TRACKING_PAGE_SIZE,
      currentPage * TRACKING_PAGE_SIZE,
    );
  }, [filteredRows, currentPage]);

  const resetPage = () => setPage(1);

  /**
   * Simpan pembaruan status tracking (Optimistik + Kirim ke PATCH /api/v1/admin/tracking/:batchId)
   */
  const handleSavePkg = async (updated: Pkg) => {
    // 1. Optimistic Update
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditingPkg(null);
    notify(
      updated.stage === "Done"
        ? `Paket ${updated.batch} · ${updated.buyer} otomatis diarsipkan (Done)`
        : `Tracking ${updated.batch} · ${updated.buyer} berhasil diperbarui`,
    );

    // 2. Kirim ke backend jika batchId tersedia
    if (updated.batchId) {
      try {
        await updateTrackingApi(updated.batchId, {
          trackingStatus: mapFrontendStageToBackend(updated.stage),
          resiNumber: updated.resi,
          whName: updated.warehouse,
          boxNo: updated.box,
          checkedOut: updated.co,
          uploadedToAlbum: updated.album,
          notes: updated.note,
        });
      } catch (err: unknown) {
        console.warn("Backend update tracking failed (optimistic state kept):", err);
      }
    }
  };

  const handleAddWarehouse = (newWh: string) => {
    setWarehouses((prev) => (prev.includes(newWh) ? prev : [...prev, newWh]));
  };

  const stats = useMemo(
    () => [
      {
        label: "Total Paket Berjalan",
        value: String(activeCount),
        unit: "barang",
        note: "Sedang dalam proses pengiriman",
        dot: "bg-sky-500",
      },
      {
        label: "Tiba di Warehouse ID",
        value: String(rows.filter((r) => r.stage === "Arrived WH INA").length),
        unit: "barang",
        note: "Siap disortir admin",
        dot: "bg-emerald-500",
      },
      {
        label: "Siap di-CO Shopee",
        value: String(rows.filter((r) => r.stage === "Bisa di CO").length),
        unit: "barang",
        note: "Status 'Bisa di CO'",
        dot: "bg-amber-500",
      },
      {
        label: "Paket Selesai (Arsip)",
        value: String(doneCount),
        unit: "barang",
        note: "Status 'Done' otomatis arsip",
        dot: "bg-slate-500",
      },
    ],
    [rows, activeCount, doneCount],
  );

  return {
    rows,
    tab,
    setTab,
    searchQuery,
    setSearchQuery,
    country,
    setCountry,
    warehouse,
    setWarehouse,
    stage,
    setStage,
    currentPage,
    setPage,
    totalPages,
    filteredRows,
    paginatedRows,
    editingPkg,
    setEditingPkg,
    warehouses,
    toastMessage,
    activeCount,
    doneCount,
    stats,
    isLoading,
    isSyncing,
    fetchError,
    refetch: () => loadTrackingData(false),
    resetPage,
    copyResi,
    handleSavePkg,
    handleAddWarehouse,
  };
}
