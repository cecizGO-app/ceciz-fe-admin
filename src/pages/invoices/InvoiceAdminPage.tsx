import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  Search,
  Filter,
  FilePlus2,
  ShieldOff,
  CheckCircle2,
  XCircle,
  ReceiptText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { TablePagination } from "@/components/verification/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  getAdminInvoicesApi,
  getAdminInvoiceStatsApi,
  generateBatchInvoicesApi,
  waiveInvoicePenaltyApi,
} from "@/services/invoice.service";
import { getBatchesApi, type BackendBatch } from "@/services/batch.service";
import type {
  AdminInvoiceItem,
  AdminInvoiceStats,
  AdminInvoiceStatus,
} from "@/types/invoice";
import type { CountryCode } from "@/types/common";

function formatIDR(val: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Math.round(val));
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export const InvoiceAdminPage: React.FC = () => {
  const [invoices, setInvoices] = useState<AdminInvoiceItem[]>([]);
  const [stats, setStats] = useState<AdminInvoiceStats>({
    totalInvoices: 0,
    unpaidCount: 0,
    awaitingVerificationCount: 0,
    paidCount: 0,
    overdueCount: 0,
    totalOutstandingAmount: 0,
    totalPenaltyAmount: 0,
  });
  const [batches, setBatches] = useState<BackendBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<AdminInvoiceStatus | "ALL">("ALL");
  const [countryFilter, setCountryFilter] = useState<CountryCode | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const totalPages = Math.max(1, Math.ceil(invoices.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = invoices.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * PAGE_SIZE, invoices.length);
  const paginatedInvoices = invoices.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // Generate Modal
  const [generateOpen, setGenerateOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");

  // Waive Penalty Modal
  const [waiveTarget, setWaiveTarget] = useState<AdminInvoiceItem | null>(null);
  const [waiveReason, setWaiveReason] = useState("");

  // Toast
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotice = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, listRes, batchRes] = await Promise.allSettled([
        getAdminInvoiceStatsApi(),
        getAdminInvoicesApi({
          status: statusFilter,
          country: countryFilter,
          search: searchQuery,
        }),
        getBatchesApi(),
      ]);

      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value);
      }
      if (listRes.status === "fulfilled") {
        setInvoices(listRes.value);
      }
      if (batchRes.status === "fulfilled") {
        setBatches(batchRes.value);
      }
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, countryFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerateInvoices = async () => {
    if (!selectedBatchId) {
      showNotice("error", "Pilih batch terlebih dahulu.");
      return;
    }
    setIsProcessing(true);
    try {
      await generateBatchInvoicesApi({
        batchId: selectedBatchId,
        deadlinePayment: deadlineInput || undefined,
      });
      setGenerateOpen(false);
      setSelectedBatchId("");
      setDeadlineInput("");
      showNotice("success", "Invoice batch berhasil di-generate untuk seluruh buyer.");
      await loadData();
    } catch (err) {
      showNotice(
        "error",
        err instanceof Error ? err.message : "Gagal generate invoice batch.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmWaive = async () => {
    if (!waiveTarget) return;
    if (waiveReason.trim().length < 5) {
      showNotice("error", "Alasan waive denda minimal 5 karakter.");
      return;
    }
    setIsProcessing(true);
    try {
      await waiveInvoicePenaltyApi(waiveTarget.id, waiveReason.trim());
      setWaiveTarget(null);
      setWaiveReason("");
      showNotice("success", `Denda pada invoice ${waiveTarget.invoiceCode} berhasil di-waive.`);
      await loadData();
    } catch (err) {
      showNotice(
        "error",
        err instanceof Error ? err.message : "Gagal melakukan waive denda.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <nav className="flex items-center gap-1.5 text-xs text-[#71717A] mb-1">
            <span className="text-[#71717A]">Operasional</span>
            <span>&gt;</span>
            <span className="text-[#EC4899] font-medium">Invoice Admin</span>
          </nav>
          <h1 className="text-[24px] sm:text-[30px] font-bold text-[#18181B] tracking-tight">
            Invoice Admin
          </h1>
          <p className="text-xs sm:text-[14px] text-[#71717A] mt-1 leading-relaxed">
            Monitoring tagihan batch per buyer, denda keterlambatan berjalan, generate
            invoice batch, serta waive denda beralasan.
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
          <Button
            type="button"
            onClick={() => setGenerateOpen(true)}
            className="h-10 sm:h-11 px-4 sm:px-5 rounded-[12px] text-xs sm:text-sm font-semibold bg-[#EC4899] hover:bg-[#DB2777] text-white gap-2 shadow-xs cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Generate Invoice</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`px-4 py-3 rounded-[12px] border text-xs flex items-center gap-2.5 ${
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

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Total Outstanding</span>
          </div>
          <div className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight mt-1 truncate">
            {formatIDR(stats.totalOutstandingAmount)}
          </div>
          <p className="text-xs text-[#71717A]">
            {stats.unpaidCount + stats.overdueCount} invoice belum lunas
          </p>
        </Card>

        <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span>Awaiting Verification</span>
          </div>
          <div className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight mt-1">
            {stats.awaitingVerificationCount}
          </div>
          <p className="text-xs text-[#71717A]">Bukti bayar menunggu cek</p>
        </Card>

        <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
            <span>Overdue &amp; Denda</span>
          </div>
          <div
            className={`text-[24px] sm:text-[28px] font-bold tracking-tight mt-1 truncate ${
              stats.totalPenaltyAmount > 0 ? "text-[#DC2626]" : "text-[#18181B]"
            }`}
          >
            {formatIDR(stats.totalPenaltyAmount)}
          </div>
          <p className="text-xs text-[#71717A]">{stats.overdueCount} invoice lewat deadline</p>
        </Card>

        <Card className="p-5 sm:p-6 gap-2 rounded-[20px] bg-white border border-[#FBCFE8]/50 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71717A]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
            <span>Invoice Paid</span>
          </div>
          <div className="text-[24px] sm:text-[28px] font-bold text-[#18181B] tracking-tight mt-1">
            {stats.paidCount}
          </div>
          <p className="text-xs text-[#71717A]">Dari total {stats.totalInvoices} invoice</p>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="p-5 sm:p-6 rounded-[24px] border border-[#FBCFE8]/50 bg-white shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari buyer, kode batch, atau invoice..."
              className="h-10 pl-9 rounded-[10px] border-[#FBCFE8] text-xs bg-white"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-[#71717A] hidden sm:block" />
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as AdminInvoiceStatus | "ALL")}
            >
              <SelectTrigger className="h-10 w-44 rounded-[10px] border-[#FBCFE8] text-xs bg-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
                <SelectItem value="AWAITING_VERIFICATION">Awaiting Verification</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={countryFilter}
              onValueChange={(v) => setCountryFilter(v as CountryCode | "ALL")}
            >
              <SelectTrigger className="h-10 w-36 rounded-[10px] border-[#FBCFE8] text-xs bg-white">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Countries</SelectItem>
                <SelectItem value="CH">China (CH)</SelectItem>
                <SelectItem value="KR">Korea (KR)</SelectItem>
                <SelectItem value="TH">Thailand (TH)</SelectItem>
                <SelectItem value="JP">Jepang (JP)</SelectItem>
                <SelectItem value="INA">Indonesia (INA)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-[#71717A]">
            Memuat data invoice dari backend...
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-12 text-center space-y-2 border border-dashed border-[#FBCFE8] rounded-[14px] bg-[#FFF5FA]/30">
            <ReceiptText className="w-8 h-8 text-[#EC4899]/50 mx-auto" />
            <p className="text-sm font-semibold text-[#18181B]">
              Belum ada invoice pada filter ini
            </p>
            <p className="text-xs text-[#71717A]">
              Klik tombol &ldquo;Generate Invoice&rdquo; untuk menerbitkan tagihan dari batch aktif.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View (< md) */}
            <div className="md:hidden space-y-3">
              {paginatedInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-[14px] border border-[#FCE7F3] bg-[#FFF5FA]/25 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-xs text-[#18181B] leading-tight">
                        {inv.buyerName}
                      </div>
                      <div className="text-[11px] text-[#71717A] mt-0.5">
                        {inv.buyerHandle}
                      </div>
                    </div>
                    <InvoiceStatusBadge status={inv.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-[10px] border border-[#FCE7F3]">
                    <span className="font-semibold text-[#EC4899]">{inv.batchCode}</span>
                    <span className="font-bold text-[#18181B]">{formatIDR(inv.amount)}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                    <span>Deadline: {formatDate(inv.deadlinePayment)}</span>
                    <span>
                      Denda:{" "}
                      {inv.penaltyWaived ? (
                        <strong className="text-emerald-600">Waived</strong>
                      ) : inv.penaltyAmount > 0 ? (
                        <strong className="text-[#DC2626]">+{formatIDR(inv.penaltyAmount)}</strong>
                      ) : (
                        "Rp 0"
                      )}
                    </span>
                  </div>

                  {inv.penaltyAmount > 0 && !inv.penaltyWaived && inv.status !== "PAID" && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setWaiveTarget(inv);
                        setWaiveReason("");
                      }}
                      className="w-full h-9 rounded-[10px] border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold gap-1.5 cursor-pointer"
                    >
                      <ShieldOff className="w-3.5 h-3.5" />
                      <span>Waive Denda</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop / Tablet Table (md+) */}
            <div className="hidden md:block overflow-x-auto">
              <div className="rounded-[14px] border border-[#FCE7F3] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FFF5FA] border-b border-[#FCE7F3] hover:bg-[#FFF5FA]">
                    <TableHead className="text-[11px] font-bold text-[#71717A] uppercase">
                      Buyer
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-[#71717A] uppercase">
                      Batch
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-[#71717A] uppercase text-right">
                      Tagihan
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-[#71717A] uppercase text-right">
                      Denda
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-[#71717A] uppercase">
                      Deadline
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-[#71717A] uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-[#71717A] uppercase text-center">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((inv) => (
                    <TableRow
                      key={inv.id}
                      className="border-b border-[#FCE7F3] hover:bg-[#FFF5FA]/40 transition-colors"
                    >
                      <TableCell className="py-3.5">
                        <div className="font-bold text-xs text-[#18181B] leading-tight">
                          {inv.buyerName}
                        </div>
                        <div className="text-[11px] text-[#71717A] mt-0.5">
                          {inv.buyerHandle}
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <div className="font-semibold text-xs text-[#EC4899]">
                          {inv.batchCode}
                        </div>
                        <div className="text-[11px] text-[#71717A] truncate max-w-[180px]">
                          {inv.batchTitle}
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 text-right font-bold text-xs text-[#18181B] whitespace-nowrap">
                        {formatIDR(inv.amount)}
                      </TableCell>
                      <TableCell className="py-3.5 text-right text-xs whitespace-nowrap">
                        {inv.penaltyWaived ? (
                          <span className="text-emerald-600 font-medium">Waived</span>
                        ) : inv.penaltyAmount > 0 ? (
                          <span className="text-[#DC2626] font-bold">
                            +{formatIDR(inv.penaltyAmount)}
                          </span>
                        ) : (
                          <span className="text-[#A1A1AA]">Rp 0</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs text-[#71717A] whitespace-nowrap">
                        {formatDate(inv.deadlinePayment)}
                      </TableCell>
                      <TableCell className="py-3.5">
                        <InvoiceStatusBadge status={inv.status} />
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        {inv.penaltyAmount > 0 && !inv.penaltyWaived && inv.status !== "PAID" ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setWaiveTarget(inv);
                              setWaiveReason("");
                            }}
                            className="h-8 px-2.5 rounded-[9px] border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-semibold gap-1 cursor-pointer"
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                            <span>Waive</span>
                          </Button>
                        ) : (
                          <span className="text-[11px] text-[#A1A1AA] italic">Done</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              currentPage={safePage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalCount={invoices.length}
              itemLabel="invoice"
              onPageChange={setCurrentPage}
            />
          </div>
          <div className="md:hidden rounded-[14px] border border-[#FCE7F3] overflow-hidden bg-white">
            <TablePagination
              currentPage={safePage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalCount={invoices.length}
              itemLabel="invoice"
              onPageChange={setCurrentPage}
            />
          </div>
          </>
        )}
      </Card>

      {/* Generate Invoice Modal */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-md rounded-[18px] border-[#FBCFE8]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#18181B]">
              Generate Invoice Batch
            </DialogTitle>
            <DialogDescription className="text-xs text-[#71717A]">
              Terbitkan invoice otomatis untuk seluruh buyer yang terdaftar dalam batch terpilih.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18181B]">Pilih Batch *</label>
              <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger className="h-10 rounded-[10px] border-[#FBCFE8] text-xs">
                  <SelectValue placeholder="Pilih batch..." />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.countryCode}-{String(b.batchNumber).padStart(3, "0")} · {b.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18181B]">
                Deadline Pembayaran (Opsional — default +24 jam)
              </label>
              <Input
                type="date"
                value={deadlineInput}
                onChange={(e) => setDeadlineInput(e.target.value)}
                className="h-10 rounded-[10px] border-[#FBCFE8] text-xs"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setGenerateOpen(false)}
              className="h-9 rounded-[10px] text-xs border-[#FBCFE8]"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={!selectedBatchId || isProcessing}
              onClick={handleGenerateInvoices}
              className="h-9 rounded-[10px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold cursor-pointer"
            >
              Generate Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waive Penalty Modal */}
      <Dialog
        open={Boolean(waiveTarget)}
        onOpenChange={(open) => {
          if (!open) setWaiveTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md rounded-[18px] border-[#FBCFE8]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#18181B]">
              Waive Denda Keterlambatan
            </DialogTitle>
            <DialogDescription className="text-xs text-[#71717A]">
              Pembebasan denda untuk <strong>{waiveTarget?.buyerName}</strong> ({waiveTarget?.batchCode})
              akan dicatat secara permanen di AuditLog.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold text-[#18181B]">
              Alasan Waive Denda * (min. 5 karakter)
            </label>
            <Textarea
              rows={3}
              value={waiveReason}
              onChange={(e) => setWaiveReason(e.target.value)}
              placeholder="Contoh: Buyer sudah konfirmasi kendala mutasi bank sebelum deadline..."
              className="rounded-[10px] border-[#FBCFE8] text-xs"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setWaiveTarget(null)}
              className="h-9 rounded-[10px] text-xs border-[#FBCFE8]"
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={waiveReason.trim().length < 5 || isProcessing}
              onClick={handleConfirmWaive}
              className="h-9 rounded-[10px] bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
            >
              Konfirmasi Waive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function InvoiceStatusBadge({ status }: { status: AdminInvoiceStatus }) {
  if (status === "PAID") {
    return (
      <Badge variant="success">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Paid
      </Badge>
    );
  }
  if (status === "OVERDUE") {
    return (
      <Badge variant="destructive">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Overdue
      </Badge>
    );
  }
  if (status === "AWAITING_VERIFICATION") {
    return (
      <Badge variant="info">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Awaiting Verification
      </Badge>
    );
  }
  return (
    <Badge variant="warning">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Unpaid
    </Badge>
  );
}

export default InvoiceAdminPage;

