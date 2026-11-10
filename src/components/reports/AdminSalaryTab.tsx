import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  FileText,
  FileSpreadsheet,
  Layers,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Save,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { formatRupiah } from "./formatters";
import type { AdminFeePeriodRecord, AdminFeeBatchRow } from "@/types/reports";

interface AdminSalaryTabProps {
  periods: AdminFeePeriodRecord[];
  onAddPeriod: (data: Omit<AdminFeePeriodRecord, "id">) => void;
  onDeletePeriod: (id: string) => void;
}

export const AdminSalaryTab: React.FC<AdminSalaryTabProps> = ({
  periods,
  onAddPeriod,
  onDeletePeriod,
}) => {
  // Top Filter State
  const [searchAdminQuery, setSearchAdminQuery] = useState("");
  const [adminFilter, setAdminFilter] = useState("ALL");
  const [periodFilter, setPeriodFilter] = useState("ALL");

  // Inner Table Filter State
  const [innerSearchQuery, setInnerSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal State: Tambah Periode
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formPeriodName, setFormPeriodName] = useState("");
  const [formAdminName, setFormAdminName] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [batchRows, setBatchRows] = useState<AdminFeeBatchRow[]>([
    { id: "row-1", batchNumber: "CH-022", feeNyelem: 8000, feeRekap: 15000 },
  ]);

  // Modal State: Detail
  const [selectedDetail, setSelectedDetail] =
    useState<AdminFeePeriodRecord | null>(null);

  // Filtered Periods
  const filteredPeriods = useMemo(() => {
    return periods.filter((item) => {
      const matchSearchTop =
        !searchAdminQuery ||
        item.adminName.toLowerCase().includes(searchAdminQuery.toLowerCase()) ||
        item.periodName.toLowerCase().includes(searchAdminQuery.toLowerCase());

      const matchAdmin =
        adminFilter === "ALL" ||
        item.adminName.toLowerCase() === adminFilter.toLowerCase();

      const matchPeriod =
        periodFilter === "ALL" || item.periodName === periodFilter;

      const matchInner =
        !innerSearchQuery ||
        item.adminName.toLowerCase().includes(innerSearchQuery.toLowerCase()) ||
        item.notes.toLowerCase().includes(innerSearchQuery.toLowerCase());

      return matchSearchTop && matchAdmin && matchPeriod && matchInner;
    });
  }, [periods, searchAdminQuery, adminFilter, periodFilter, innerSearchQuery]);

  // 3 KPI calculations based on filtered data
  const totalFeeSelected = useMemo(() => {
    return filteredPeriods.reduce((sum, p) => sum + p.totalFee, 0);
  }, [filteredPeriods]);

  const totalPeriodsCount = filteredPeriods.length;

  const totalBatchesCount = useMemo(() => {
    return filteredPeriods.reduce((sum, p) => sum + p.batchCount, 0);
  }, [filteredPeriods]);

  // Modal dynamic total
  const formTotalFee = useMemo(() => {
    return batchRows.reduce(
      (sum, r) => sum + (Number(r.feeNyelem) || 0) + (Number(r.feeRekap) || 0),
      0,
    );
  }, [batchRows]);

  const handleAddBatchRow = () => {
    const newRow: AdminFeeBatchRow = {
      id: `row-${Date.now()}`,
      batchNumber: `KR-01${batchRows.length + 7}`,
      feeNyelem: 7000,
      feeRekap: 15000,
    };
    setBatchRows((prev) => [...prev, newRow]);
  };

  const handleRemoveBatchRow = (id: string) => {
    setBatchRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateBatchRow = (
    id: string,
    field: keyof AdminFeeBatchRow,
    value: string | number,
  ) => {
    setBatchRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const handleSaveModal = () => {
    if (!formPeriodName.trim() || !formAdminName.trim()) {
      alert("Nama Periode dan Nama Admin wajib diisi");
      return;
    }

    const totalFeeNyelem = batchRows.reduce(
      (sum, r) => sum + (Number(r.feeNyelem) || 0),
      0,
    );
    const totalFeeRekap = batchRows.reduce(
      (sum, r) => sum + (Number(r.feeRekap) || 0),
      0,
    );

    onAddPeriod({
      periodName: formPeriodName,
      adminName: formAdminName,
      startDate: formStartDate || "2026-09-01",
      endDate: formEndDate || "2026-09-30",
      batchCount: Math.max(1, batchRows.length),
      batches: batchRows,
      feeNyelem: totalFeeNyelem,
      feeRekap: totalFeeRekap,
      totalFee: totalFeeNyelem + totalFeeRekap,
      notes: formNotes || "Fee admin periode baru",
    });

    // Reset form
    setFormPeriodName("");
    setFormAdminName("");
    setFormStartDate("");
    setFormEndDate("");
    setFormNotes("");
    setBatchRows([
      { id: "row-1", batchNumber: "CH-022", feeNyelem: 8000, feeRekap: 15000 },
    ]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar: Search admin, Admin Dropdown, Period Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white p-2.5 rounded-[16px] border border-[#FBCFE8]/60 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA] pointer-events-none" />
          <Input
            type="text"
            value={searchAdminQuery}
            onChange={(e) => setSearchAdminQuery(e.target.value)}
            placeholder="Search admin..."
            className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899] bg-[#FFF5FA]/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-full sm:w-36">
            <Select value={adminFilter} onValueChange={setAdminFilter}>
              <SelectTrigger
                size="sm"
                className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70"
              >
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Admin</SelectItem>
                <SelectItem value="Ira">Ira</SelectItem>
                <SelectItem value="Nadia">Nadia</SelectItem>
                <SelectItem value="Aurel">Aurel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-40">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger
                size="sm"
                className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70"
              >
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Periode</SelectItem>
                <SelectItem value="September 2026">September 2026</SelectItem>
                <SelectItem value="Agustus 2026">Agustus 2026</SelectItem>
                <SelectItem value="Juli 2026">Juli 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards Sesuai Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Total fee periode terpilih */}
        <Card
          size="sm"
          className="gap-0 rounded-[18px] bg-white border border-[#FBCFE8]/60 p-4 sm:p-5 flex items-center justify-between shadow-2xs hover:border-[#EC4899]/60 hover:shadow-xs transition-all"
        >
          <div>
            <span className="text-xs font-medium text-[#71717A] block">
              Total fee periode terpilih
            </span>
            <p className="text-[22px] font-bold text-[#18181B] tracking-tight mt-1.5">
              {formatRupiah(totalFeeSelected)}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        </Card>

        {/* Card 2: Periode admin */}
        <Card
          size="sm"
          className="gap-0 rounded-[18px] bg-white border border-[#FBCFE8]/60 p-4 sm:p-5 flex items-center justify-between shadow-2xs hover:border-[#EC4899]/60 hover:shadow-xs transition-all"
        >
          <div>
            <span className="text-xs font-medium text-[#71717A] block">
              Periode admin
            </span>
            <p className="text-[22px] font-bold text-[#18181B] tracking-tight mt-1.5">
              {totalPeriodsCount}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        </Card>

        {/* Card 3: Batch dalam periode */}
        <Card
          size="sm"
          className="gap-0 rounded-[18px] bg-white border border-[#FBCFE8]/60 p-4 sm:p-5 flex items-center justify-between shadow-2xs hover:border-[#EC4899]/60 hover:shadow-xs transition-all"
        >
          <div>
            <span className="text-xs font-medium text-[#71717A] block">
              Batch dalam periode
            </span>
            <p className="text-[22px] font-bold text-[#18181B] tracking-tight mt-1.5">
              {totalBatchesCount}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
        </Card>
      </div>

      {/* Main Card: Fee Admin per Periode */}
      <Card className="rounded-[20px] border border-[#FBCFE8]/60 shadow-xs bg-white overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-[#FBCFE8]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-[17px] font-bold text-[#18181B] tracking-tight">
            Fee Admin per Periode
          </CardTitle>

          <Button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="h-9 px-4 rounded-[10px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Tambah Periode
          </Button>
        </CardHeader>

        {/* Inner Search / Filter Bar */}
        <div className="p-4 border-b border-[#FBCFE8]/30 bg-[#FFF5FA]/20 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Input
              type="text"
              value={innerSearchQuery}
              onChange={(e) => setInnerSearchQuery(e.target.value)}
              placeholder="Cari admin atau keterangan..."
              className="h-9 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899] bg-white"
            />
          </div>

          <div className="w-full sm:w-36">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                size="sm"
                className="h-9 text-xs rounded-[10px] border-[#FBCFE8]/70 bg-white"
              >
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="ARCHIVED">Arsip</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Fee Admin */}
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#FFF5FA]/60">
              <TableRow className="border-[#FBCFE8]/30 hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-[#18181B] pl-6">
                  Periode
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B]">
                  Admin
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B] text-center">
                  Batch
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B] text-right">
                  Fee Nyelem
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B] text-right">
                  Fee Rekap
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B] text-right">
                  Total Fee
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B]">
                  Keterangan
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B] text-center pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredPeriods.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-28 text-center text-xs text-[#71717A]"
                  >
                    Tidak ada data periode admin yang sesuai filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPeriods.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-[#FBCFE8]/30 hover:bg-[#FFF5FA]/40 transition-colors"
                  >
                    <TableCell className="font-semibold text-xs text-[#18181B] pl-6">
                      {item.periodName}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-[#18181B]">
                      {item.adminName}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-center text-[#71717A]">
                      {item.batchCount}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-[#71717A] text-right">
                      {formatRupiah(item.feeNyelem)}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-[#71717A] text-right">
                      {formatRupiah(item.feeRekap)}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-[#18181B] text-right">
                      {formatRupiah(item.totalFee)}
                    </TableCell>
                    <TableCell className="text-xs text-[#71717A]">
                      {item.notes}
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          onClick={() => setSelectedDetail(item)}
                          className="h-7 px-2.5 rounded-[8px] text-[11px] font-semibold border-[#FBCFE8] hover:bg-[#FFF5FA] hover:text-[#EC4899] shadow-2xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Detail
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setSelectedDetail(item)}
                          className="size-7 rounded-md text-[#71717A] hover:text-[#EC4899] hover:bg-[#FFF5FA]"
                          title="Edit periode"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onDeletePeriod(item.id)}
                          className="size-7 rounded-md text-[#71717A] hover:text-rose-600 hover:bg-rose-50"
                          title="Hapus periode"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL: Tambah Fee Periode (Sesuai Image 2) */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[560px] p-6 rounded-[20px] border-[#FBCFE8]">
          <DialogHeader className="pb-3 border-b border-[#FBCFE8]/40">
            <DialogTitle className="text-[18px] font-bold text-[#18181B]">
              Tambah Fee Periode
            </DialogTitle>
            <DialogDescription className="text-xs text-[#71717A]">
              Fee nyelem dan rekap dalam periode admin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Row 1: Nama Periode & Admin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                  Nama Periode
                </Label>
                <Input
                  type="text"
                  value={formPeriodName}
                  onChange={(e) => setFormPeriodName(e.target.value)}
                  placeholder="Contoh: September 2026"
                  className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                  Admin
                </Label>
                <Input
                  type="text"
                  value={formAdminName}
                  onChange={(e) => setFormAdminName(e.target.value)}
                  placeholder="Contoh: Ira / Nadia"
                  className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>

            {/* Row 2: Dari Tanggal & Sampai Tanggal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
                  Dari tanggal
                </Label>
                <Input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
                  Sampai tanggal
                </Label>
                <Input
                  type="date"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                  className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>

            {/* Row 3: Keterangan Periode */}
            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Keterangan Periode
              </Label>
              <Input
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Catatan periode (misal: Fee JP dan CH)"
                className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
              />
            </div>

            {/* Section: Batch dalam Periode */}
            <div className="pt-2 border-t border-[#FBCFE8]/30">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-[#18181B]">
                  Batch dalam Periode
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleAddBatchRow}
                  className="h-8 px-3 rounded-[8px] text-xs font-semibold border-[#FBCFE8] hover:bg-[#FFF5FA] hover:text-[#EC4899]"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Tambah Row dari Batch
                </Button>
              </div>

              {/* Dynamic Rows */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {batchRows.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center gap-2 p-2 rounded-[10px] bg-[#FFF5FA]/40 border border-[#FBCFE8]/50"
                  >
                    <Input
                      type="text"
                      value={row.batchNumber}
                      onChange={(e) =>
                        handleUpdateBatchRow(
                          row.id,
                          "batchNumber",
                          e.target.value,
                        )
                      }
                      placeholder="No Batch"
                      className="w-24 h-8 text-xs rounded-[8px] bg-white border-[#FBCFE8]/60"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[#71717A]">
                        Nyelem:
                      </span>
                      <Input
                        type="number"
                        min={0}
                        value={row.feeNyelem || ""}
                        onChange={(e) =>
                          handleUpdateBatchRow(
                            row.id,
                            "feeNyelem",
                            Number(e.target.value) || 0,
                          )
                        }
                        placeholder="Nyelem"
                        className="w-20 h-8 text-xs rounded-[8px] bg-white border-[#FBCFE8]/60"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[#71717A]">Rekap:</span>
                      <Input
                        type="number"
                        min={0}
                        value={row.feeRekap || ""}
                        onChange={(e) =>
                          handleUpdateBatchRow(
                            row.id,
                            "feeRekap",
                            Number(e.target.value) || 0,
                          )
                        }
                        placeholder="Rekap"
                        className="w-20 h-8 text-xs rounded-[8px] bg-white border-[#FBCFE8]/60"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemoveBatchRow(row.id)}
                      className="size-6 p-0 text-[#71717A] hover:text-rose-600 hover:bg-rose-50 ml-auto"
                      title="Hapus row"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Fee Footer */}
            <div className="pt-2 text-sm font-bold text-[#18181B] flex items-center justify-between">
              <span>Total Fee:</span>
              <span className="text-[#EC4899] text-[16px]">
                {formatRupiah(formTotalFee)}
              </span>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-[#FBCFE8]/40 flex sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className="h-9 px-4 rounded-[10px] text-xs font-semibold border-[#FBCFE8]"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveModal}
              className="h-9 px-4 rounded-[10px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs shadow-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Simpan Fee Periode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Detail Fee Periode */}
      {selectedDetail && (
        <Dialog
          open={Boolean(selectedDetail)}
          onOpenChange={(open) => !open && setSelectedDetail(null)}
        >
          <DialogContent className="sm:max-w-[480px] p-6 rounded-[20px] border-[#FBCFE8]">
            <DialogHeader className="pb-3 border-b border-[#FBCFE8]/40">
              <DialogTitle className="text-[18px] font-bold text-[#18181B]">
                Detail Fee: {selectedDetail.adminName}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#71717A]">
                Periode {selectedDetail.periodName} ({selectedDetail.startDate}{" "}
                s/d {selectedDetail.endDate})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                <span className="text-[#71717A]">Fee Nyelem Total</span>
                <span className="font-semibold text-[#18181B]">
                  {formatRupiah(selectedDetail.feeNyelem)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                <span className="text-[#71717A]">Fee Rekap Tiered</span>
                <span className="font-semibold text-[#18181B]">
                  {formatRupiah(selectedDetail.feeRekap)}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 font-bold text-sm bg-[#FFF5FA] px-3 rounded-[10px]">
                <span className="text-[#18181B]">Total Fee Admin</span>
                <span className="text-[#EC4899]">
                  {formatRupiah(selectedDetail.totalFee)}
                </span>
              </div>

              {selectedDetail.notes && (
                <div className="pt-2 text-[#71717A]">
                  <span className="font-semibold text-[#18181B] block mb-0.5">
                    Keterangan:
                  </span>
                  <p className="bg-zinc-50 p-2.5 rounded-[10px] border border-zinc-200/60">
                    {selectedDetail.notes}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="pt-3 border-t border-[#FBCFE8]/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedDetail(null)}
                className="h-9 px-4 rounded-[10px] text-xs font-semibold border-[#FBCFE8]"
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
