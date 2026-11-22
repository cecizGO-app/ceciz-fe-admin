import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Users,
  Clock,
  Check,
  X,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { TablePagination } from "@/components/verification/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getBuyerRequestsApi,
  verifyBuyerAccountApi,
  bulkVerifyBuyerAccountsApi,
} from "@/services/buyer-approval.service";
import {
  REJECT_REASON_PRESETS,
  type BuyerAccountRequest,
  type BuyerApprovalStats,
  type BuyerApprovalStatus,
  type LineGroup,
} from "@/types/buyer-approval";

interface BuyerApprovalPageProps {
  currentAdminName?: string;
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export const BuyerApprovalPage: React.FC<BuyerApprovalPageProps> = ({
  currentAdminName = "Owner",
}) => {
  const [items, setItems] = useState<BuyerAccountRequest[]>([]);
  const [stats, setStats] = useState<BuyerApprovalStats>({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    go1Count: 0,
    go2Count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState<BuyerApprovalStatus | "ALL">("PENDING");
  const [lineGroupFilter, setLineGroupFilter] = useState<LineGroup | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = items.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * PAGE_SIZE, items.length);
  const paginatedItems = items.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // Multi-select
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Reject Modal
  const [rejectTargetIds, setRejectTargetIds] = useState<string[] | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getBuyerRequestsApi({
        status: activeTab,
        lineGroup: lineGroupFilter,
        search: searchQuery,
      });
      setItems(res.items);
      setStats(res.stats);
      setSelectedIds([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, lineGroupFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showNotice = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4500);
  };

  const handleApproveSingle = async (item: BuyerAccountRequest) => {
    setIsProcessing(true);
    try {
      await verifyBuyerAccountApi({
        id: item.id,
        action: "APPROVE",
        adminName: currentAdminName,
      });
      showNotice(
        "success",
        `Akun ${item.dnLine} (@${item.idLine}) disetujui masuk ke ${item.lineGroup.replace("_", " ")}.`,
      );
      await loadData();
    } catch (err) {
      showNotice(
        "error",
        err instanceof Error ? err.message : "Gagal menyetujui akun buyer.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);
    try {
      await bulkVerifyBuyerAccountsApi({
        ids: selectedIds,
        action: "APPROVE",
        adminName: currentAdminName,
      });
      showNotice(
        "success",
        `${selectedIds.length} pengajuan akun buyer berhasil disetujui.`,
      );
      await loadData();
    } catch (err) {
      showNotice(
        "error",
        err instanceof Error ? err.message : "Gagal melakukan persetujuan massal.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectTargetIds || rejectTargetIds.length === 0) return;
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      showNotice("error", "Alasan penolakan wajib diisi agar buyer dapat memperbaiki data.");
      return;
    }

    setIsProcessing(true);
    try {
      if (rejectTargetIds.length === 1) {
        await verifyBuyerAccountApi({
          id: rejectTargetIds[0],
          action: "REJECT",
          rejectReason: trimmed,
          adminName: currentAdminName,
        });
      } else {
        await bulkVerifyBuyerAccountsApi({
          ids: rejectTargetIds,
          action: "REJECT",
          rejectReason: trimmed,
          adminName: currentAdminName,
        });
      }
      showNotice(
        "success",
        `${rejectTargetIds.length} pengajuan akun buyer ditolak dengan alasan tercatat.`,
      );
      setRejectTargetIds(null);
      setRejectReason("");
      await loadData();
    } catch (err) {
      showNotice(
        "error",
        err instanceof Error ? err.message : "Gagal menolak pengajuan akun buyer.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingItems = items.filter((i) => i.approvalStatus === "PENDING");
  const allPendingSelected =
    pendingItems.length > 0 && pendingItems.every((i) => selectedIds.includes(i.id));

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(pendingItems.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id),
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <nav className="flex items-center gap-1.5 text-xs text-[#71717A] mb-1">
            <span className="text-[#71717A]">Operasional</span>
            <span>&gt;</span>
            <span className="text-[#EC4899] font-medium">
              Persetujuan Akun Buyer
            </span>
          </nav>
          <h1 className="text-[24px] sm:text-[30px] font-bold text-[#18181B] tracking-tight">
            Persetujuan Akun Buyer
          </h1>
          <p className="text-xs sm:text-[14px] text-[#71717A] mt-1 leading-relaxed">
            Verifikasi keanggotaan grup LINE Ceciz (DN LINE, ID LINE, Group GO 1 / GO 2)
            sebelum buyer dapat mengakses Buyer Dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <Button
            type="button"
            variant="outline"
            onClick={loadData}
            disabled={isLoading}
            className="h-10 sm:h-11 px-3.5 rounded-[12px] text-xs font-semibold border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#71717A] hover:text-[#EC4899] gap-1.5 shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#EC4899] ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`px-4 py-3 rounded-[12px] border text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* 4 KPI Cards (Identik dengan CashflowStatsCards & Design Token index.css) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Menunggu Persetujuan</span>
          </div>
          <div className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight mt-1">
            {stats.pendingCount}
          </div>
          <p className="text-xs text-[#71717A]">Antrean verifikasi LINE</p>
        </Card>

        <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Akun Disetujui</span>
          </div>
          <div className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight mt-1">
            {stats.approvedCount}
          </div>
          <p className="text-xs text-[#71717A]">Aktif di daftar buyer batch</p>
        </Card>

        <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
            <span>Pengajuan Ditolak</span>
          </div>
          <div className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight mt-1">
            {stats.rejectedCount}
          </div>
          <p className="text-xs text-[#71717A]">Menunggu perbaikan buyer</p>
        </Card>

        <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
            <span className="w-2 h-2 rounded-full bg-[#EC4899] shrink-0" />
            <span>Total Member Aktif</span>
          </div>
          <div className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight mt-1">
            {stats.go1Count + stats.go2Count}
          </div>
          <p className="text-xs text-[#71717A]">
            Member aktif di grup LINE GO 1 &amp; GO 2
          </p>
        </Card>
      </div>

      {/* Main Content Card (--radius-panel: 24px) */}
      <Card className="p-5 sm:p-6 rounded-[24px] border border-[#FBCFE8]/50 bg-white shadow-2xs space-y-5">
        {/* Tabs + Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-[12px] bg-[#FFF5FA] border border-[#FCE7F3] overflow-x-auto">
            {(
              [
                { id: "PENDING", label: "Pending", count: stats.pendingCount },
                { id: "APPROVED", label: "Approved", count: stats.approvedCount },
                { id: "REJECTED", label: "Rejected", count: stats.rejectedCount },
                { id: "ALL", label: "All", count: stats.pendingCount + stats.approvedCount + stats.rejectedCount },
              ] as const
            ).map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-8 px-3 rounded-[9px] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-[#EC4899] text-white shadow-2xs"
                      : "text-[#71717A] hover:text-[#18181B] hover:bg-white/70"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      active
                        ? "bg-white/25 text-white"
                        : "bg-[#FCE7F3] text-[#BE185D]"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Group Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari DN LINE, ID LINE, email..."
                className="h-10 pl-9 rounded-[10px] border-[#FBCFE8] text-xs bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#71717A] hidden sm:block" />
              <Select
                value={lineGroupFilter}
                onValueChange={(val) => setLineGroupFilter(val as LineGroup | "ALL")}
              >
                <SelectTrigger className="h-10 w-full sm:w-36 rounded-[10px] border-[#FBCFE8] text-xs font-medium bg-white">
                  <SelectValue placeholder="Semua Grup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Grup</SelectItem>
                  <SelectItem value="GO_1">Group GO 1</SelectItem>
                  <SelectItem value="GO_2">Group GO 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="px-4 py-3 rounded-[12px] bg-[#FFF5FA] border border-[#FBCFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-semibold text-[#BE185D]">
              {selectedIds.length} pengajuan buyer dipilih
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                disabled={isProcessing}
                onClick={handleBulkApprove}
                className="h-8 px-3.5 rounded-[9px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Setujui Semua ({selectedIds.length})</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isProcessing}
                onClick={() => {
                  setRejectTargetIds(selectedIds);
                  setRejectReason("");
                }}
                className="h-8 px-3.5 rounded-[9px] border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tolak Semua</span>
              </Button>
            </div>
          </div>
        )}

        {/* Empty / Loading State */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-[#71717A]">
            Memuat daftar pengajuan akun buyer...
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center space-y-2 border border-dashed border-[#FBCFE8] rounded-[14px] bg-[#FFF5FA]/30">
            <Users className="w-8 h-8 text-[#EC4899]/50 mx-auto" />
            <p className="text-sm font-semibold text-[#18181B]">
              Tidak ada pengajuan akun pada filter ini
            </p>
            <p className="text-xs text-[#71717A]">
              Pendaftar buyer baru yang masuk lewat Google OAuth & mengisi form LINE akan tampil di sini.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card List (< md) */}
            <div className="md:hidden space-y-3">
              {paginatedItems.map((item) => {
                const isPending = item.approvalStatus === "PENDING";
                const checked = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-[14px] border border-[#FCE7F3] bg-[#FFF5FA]/25 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        {isPending && (
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(c) => toggleSelectOne(item.id, Boolean(c))}
                            className="mt-0.5"
                          />
                        )}
                        <div>
                          <div className="text-xs font-bold text-[#18181B] leading-tight">
                            {item.dnLine}
                          </div>
                          <div className="text-[11px] text-[#71717A] mt-0.5">{item.email}</div>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          item.lineGroup === "GO_1" ? "text-[#EC4899]" : "text-[#2563EB]"
                        }`}
                      >
                        {item.lineGroup.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-[10px] border border-[#FCE7F3]">
                      <span className="text-[#71717A]">ID LINE:</span>
                      <span className="font-medium text-[#18181B]">
                        @{item.idLine}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(item.requestedAt)}
                      </span>
                      <StatusBadge status={item.approvalStatus} />
                    </div>

                    {item.rejectReason && item.approvalStatus === "REJECTED" && (
                      <div className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-2.5 py-1.5">
                        <strong>Alasan:</strong> {item.rejectReason}
                      </div>
                    )}

                    {isPending && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                          type="button"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleApproveSingle(item)}
                          className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui</span>
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isProcessing}
                          onClick={() => {
                            setRejectTargetIds([item.id]);
                            setRejectReason("");
                          }}
                          className="h-9 border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold gap-1.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop / Tablet Table (md+) */}
            <div className="hidden md:block overflow-x-auto">
              <div className="rounded-[14px] border border-[#FCE7F3] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#FFF5FA] border-b border-[#FCE7F3] hover:bg-[#FFF5FA]">
                      <TableHead className="w-10 text-center">
                        {pendingItems.length > 0 && (
                          <Checkbox
                            checked={allPendingSelected}
                            onCheckedChange={(c) => toggleSelectAll(Boolean(c))}
                            aria-label="Pilih semua pengajuan pending"
                          />
                        )}
                      </TableHead>
                      <TableHead className="text-[11px] font-bold text-[#71717A] uppercase">
                        Identitas Buyer (DN LINE &amp; Email)
                      </TableHead>
                      <TableHead className="text-[11px] font-bold text-[#71717A] uppercase">
                        ID LINE
                      </TableHead>
                      <TableHead className="text-[11px] font-bold text-[#71717A] uppercase">
                        Grup LINE
                      </TableHead>
                      <TableHead className="text-[11px] font-bold text-[#71717A] uppercase">
                        Waktu Pengajuan
                      </TableHead>
                      <TableHead className="text-[11px] font-bold text-[#71717A] uppercase">
                        Status
                      </TableHead>
                      <TableHead className="text-center text-[11px] font-bold text-[#71717A] uppercase">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.map((item) => {
                      const isPending = item.approvalStatus === "PENDING";
                      const checked = selectedIds.includes(item.id);
                      return (
                        <TableRow
                          key={item.id}
                          className="border-b border-[#FCE7F3] hover:bg-[#FFF5FA]/40 transition-colors"
                        >
                          <TableCell className="text-center">
                            {isPending && (
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(c) => toggleSelectOne(item.id, Boolean(c))}
                              />
                            )}
                          </TableCell>
                          <TableCell className="py-3.5">
                            <div className="font-bold text-xs text-[#18181B] leading-tight">
                              {item.dnLine}
                            </div>
                            <div className="text-[11px] text-[#71717A] mt-0.5">
                              {item.email}
                            </div>
                            {item.rejectReason && item.approvalStatus === "REJECTED" && (
                              <div className="text-[11px] text-rose-600 mt-1">
                                Alasan: {item.rejectReason}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-3.5 text-xs font-medium text-[#18181B]">
                            @{item.idLine}
                          </TableCell>
                          <TableCell className="py-3.5">
                            <span
                              className={`text-xs font-semibold ${
                                item.lineGroup === "GO_1" ? "text-[#EC4899]" : "text-[#2563EB]"
                              }`}
                            >
                              {item.lineGroup.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell className="py-3.5 text-xs text-[#71717A] whitespace-nowrap">
                            {formatDateTime(item.requestedAt)}
                          </TableCell>
                          <TableCell className="py-3.5">
                            <StatusBadge status={item.approvalStatus} />
                          </TableCell>
                          <TableCell className="py-3.5 text-center">
                            {isPending ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleApproveSingle(item)}
                                  title="Setujui Akun Buyer"
                                  className="w-8 h-8 rounded-[10px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => {
                                    setRejectTargetIds([item.id]);
                                    setRejectReason("");
                                  }}
                                  title="Tolak Akun Buyer"
                                  className="w-8 h-8 rounded-[10px] bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-[#A1A1AA] italic">
                                Done
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                currentPage={safePage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                totalCount={items.length}
                itemLabel="pengajuan buyer"
                onPageChange={setCurrentPage}
              />
            </div>
            <div className="md:hidden rounded-[14px] border border-[#FCE7F3] overflow-hidden bg-white">
              <TablePagination
                currentPage={safePage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                totalCount={items.length}
                itemLabel="pengajuan buyer"
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </Card>

      {/* Reject Reason Modal */}
      <Dialog
        open={Boolean(rejectTargetIds)}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTargetIds(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md rounded-[18px] border-[#FBCFE8]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#18181B]">
              Tolak Pengajuan Akun Buyer
            </DialogTitle>
            <DialogDescription className="text-xs text-[#71717A]">
              Alasan penolakan wajib diisi. Buyer akan melihat alasan ini untuk memperbaiki
              data DN LINE / ID LINE / Grup dan mengirim ulang pengajuan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#71717A] uppercase">
                Pilih Alasan Cepat:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {REJECT_REASON_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRejectReason(preset)}
                    className="text-left text-[11px] px-2.5 py-1.5 rounded-[8px] border border-[#FBCFE8] bg-[#FFF5FA] hover:bg-[#FCE7F3] text-[#BE185D] font-medium transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18181B]">
                Alasan Penolakan *
              </label>
              <Textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Tuliskan alasan mengapa pengajuan akun buyer ini ditolak..."
                className="rounded-[10px] border-[#FBCFE8] text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRejectTargetIds(null);
                setRejectReason("");
              }}
              className="h-9 rounded-[10px] text-xs border-[#FBCFE8]"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={!rejectReason.trim() || isProcessing}
              onClick={handleConfirmReject}
              className="h-9 rounded-[10px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
            >
              Konfirmasi Tolak ({rejectTargetIds?.length || 0})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function StatusBadge({ status }: { status: BuyerApprovalStatus }) {
  if (status === "APPROVED") {
    return (
      <Badge variant="success">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Approved
      </Badge>
    );
  }
  if (status === "REJECTED") {
    return (
      <Badge variant="destructive">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge variant="warning">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Pending
    </Badge>
  );
}

export default BuyerApprovalPage;

