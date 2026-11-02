import React, { useState } from "react";
import { Plus, X, Check, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PoAlbumOrder, PoAlbumDraft, OrderType } from "@/types/po-album";

interface PoAlbumInputPanelProps {
  onClose: () => void;
  onSave: (rows: Omit<PoAlbumOrder, "id">[]) => void;
}

let draftKeyCounter = 1;
const blankDraft = (): PoAlbumDraft => ({
  key: draftKeyCounter++,
  member: "",
  price: "",
  buyer: "",
  dp: "",
  dpDone: false,
  fp: "",
  fpDone: false,
  note: "",
});

const money = (v: string) => v.replace(/\D/g, "");
const fmtMoney = (v: string) => (v ? Number(v).toLocaleString("id-ID") : "");

export const PoAlbumInputPanel: React.FC<PoAlbumInputPanelProps> = ({
  onClose,
  onSave,
}) => {
  const [batch, setBatch] = useState("KR-ALB-07");
  const [album, setAlbum] = useState("CATBBI Album Ver.");
  const [type, setType] = useState<OrderType>("PO Album");
  const [rows, setRows] = useState<PoAlbumDraft[]>([
    blankDraft(),
    blankDraft(),
    blankDraft(),
  ]);

  const setRow = (k: number, patch: Partial<PoAlbumDraft>) =>
    setRows((rs) => rs.map((r) => (r.key === k ? { ...r, ...patch } : r)));

  const valid = rows.filter((r) => r.buyer.trim() && r.dp);
  const ok = batch.trim() && album.trim() && valid.length > 0;

  const handleSave = () => {
    onSave(
      valid.map((r) => ({
        batch: batch.trim().toUpperCase(),
        buyer: r.buyer.trim().startsWith("@")
          ? r.buyer.trim()
          : `@${r.buyer.trim()}`,
        album: album.trim(),
        member: r.member.trim() || "All Member",
        qty: 1,
        dp: Number(r.dp),
        dpDone: r.dpDone,
        dpMethod: "BCA",
        fp: Number(r.fp || 0),
        fpDone: r.fpDone,
        fpMethod: "BCA",
        co: "Not Started",
        note: r.note.trim(),
        type,
      }))
    );
  };

  const headClass =
    "py-3 pr-2 text-left text-[11px] uppercase tracking-wider text-ink-2 font-bold whitespace-nowrap";

  return (
    <Card
      size="sm"
      className="p-0 rounded-panel bg-surface border border-border shadow-xs overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3 border-b border-divider px-6 py-4 bg-subpanel/50">
        <div>
          <h2 className="text-lg font-bold text-ink tracking-tight">
            Input PO Album / CO Web
          </h2>
          <p className="mt-0.5 text-xs text-ink-2">
            Data ini akan tampil di dashboard buyer masing-masing setelah
            disimpan.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Tutup panel"
          className="text-ink-2 hover:text-ink hover:bg-subpanel rounded-control"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Top Batch Metadata */}
      <div className="grid grid-cols-1 gap-3 px-6 pt-5 sm:grid-cols-3">
        <div>
          <label className="text-[11px] font-bold text-ink-2 tracking-wider uppercase block mb-1.5">
            Nomor Batch
          </label>
          <Input
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            placeholder="KR-ALB-07"
            className="font-mono h-10 rounded-control border-border bg-surface text-xs font-semibold text-ink"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-ink-2 tracking-wider uppercase block mb-1.5">
            Item / Judul Album
          </label>
          <Input
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            placeholder="CATBBI Album Ver."
            className="h-10 rounded-control border-border bg-surface text-xs font-semibold text-ink"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-ink-2 tracking-wider uppercase block mb-1.5">
            Tipe Pemesanan
          </label>
          <Select
            value={type}
            onValueChange={(val) => setType(val as OrderType)}
          >
            <SelectTrigger className="h-10 rounded-control border-border bg-surface text-xs font-semibold text-ink">
              <SelectValue placeholder="Pilih Tipe" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-border shadow-card">
              <SelectItem value="PO Album">PO Album</SelectItem>
              <SelectItem value="CO Web">CO Web</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Spreadsheet Table */}
      <div className="mx-6 mt-5 hidden overflow-hidden rounded-control border border-border/80 lg:block">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[16%]" />
            <col className="w-[12%]" />
            <col className="w-[6%]" />
            <col className="w-[12%]" />
            <col className="w-[6%]" />
            <col className="w-[17%]" />
            <col className="w-[5%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-divider bg-subpanel">
              <th className={`${headClass} pl-4`}>Fix Member</th>
              <th className={headClass}>Harga Satuan</th>
              <th className={headClass}>Nama Buyer</th>
              <th className={headClass}>Nominal DP</th>
              <th className={`${headClass} text-center`}>DP ✓</th>
              <th className={headClass}>Nominal FP</th>
              <th className={`${headClass} text-center`}>FP ✓</th>
              <th className={headClass}>Catatan</th>
              <th className={`${headClass} pr-3`}>
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.key}
                className="border-b border-divider/70 last:border-b-0 hover:bg-subpanel/30 transition-colors"
              >
                <td className="py-2.5 pl-4 pr-2">
                  <Input
                    value={r.member}
                    onChange={(e) => setRow(r.key, { member: e.target.value })}
                    placeholder="Shotaro"
                    className="h-9 rounded-[8px] border-border/70 bg-surface text-xs text-ink"
                  />
                </td>
                <td className="py-2.5 pr-2">
                  <Input
                    inputMode="numeric"
                    value={fmtMoney(r.price)}
                    onChange={(e) =>
                      setRow(r.key, { price: money(e.target.value) })
                    }
                    placeholder="305.000"
                    className="h-9 rounded-[8px] border-border/70 bg-surface text-xs text-ink tabular-nums"
                  />
                </td>
                <td className="py-2.5 pr-2">
                  <Input
                    value={r.buyer}
                    onChange={(e) => setRow(r.key, { buyer: e.target.value })}
                    placeholder="@username"
                    className="h-9 rounded-[8px] border-border/70 bg-surface text-xs text-ink"
                  />
                </td>
                <td className="py-2.5 pr-2">
                  <Input
                    inputMode="numeric"
                    value={fmtMoney(r.dp)}
                    onChange={(e) =>
                      setRow(r.key, { dp: money(e.target.value) })
                    }
                    placeholder="205.000"
                    className="h-9 rounded-[8px] border-border/70 bg-surface text-xs text-ink tabular-nums"
                  />
                </td>
                <td className="py-2.5 pr-2">
                  <div className="flex justify-center items-center">
                    <Checkbox
                      checked={r.dpDone}
                      onCheckedChange={(checked) =>
                        setRow(r.key, { dpDone: !!checked })
                      }
                      aria-label={`DP lunas baris ${i + 1}`}
                    />
                  </div>
                </td>
                <td className="py-2.5 pr-2">
                  <Input
                    inputMode="numeric"
                    value={fmtMoney(r.fp)}
                    onChange={(e) =>
                      setRow(r.key, { fp: money(e.target.value) })
                    }
                    placeholder="100.000"
                    className="h-9 rounded-[8px] border-border/70 bg-surface text-xs text-ink tabular-nums"
                  />
                </td>
                <td className="py-2.5 pr-2">
                  <div className="flex justify-center items-center">
                    <Checkbox
                      checked={r.fpDone}
                      onCheckedChange={(checked) =>
                        setRow(r.key, { fpDone: !!checked })
                      }
                      aria-label={`FP lunas baris ${i + 1}`}
                    />
                  </div>
                </td>
                <td className="py-2.5 pr-2">
                  <Input
                    value={r.note}
                    onChange={(e) => setRow(r.key, { note: e.target.value })}
                    placeholder="titip sealed"
                    className="h-9 rounded-[8px] border-border/70 bg-surface text-xs text-ink"
                  />
                </td>
                <td className="py-2.5 pr-3">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={rows.length === 1}
                    onClick={() =>
                      setRows((rs) => rs.filter((x) => x.key !== r.key))
                    }
                    className="w-8 h-8 rounded-[8px] text-ink-3 hover:bg-rose-50 hover:text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Rows List */}
      <ul className="mt-5 flex flex-col gap-3 px-6 lg:hidden">
        {rows.map((r, i) => (
          <li
            key={r.key}
            className="rounded-control border border-border bg-subpanel/40 p-3.5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Baris {i + 1}
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                disabled={rows.length === 1}
                onClick={() =>
                  setRows((rs) => rs.filter((x) => x.key !== r.key))
                }
                className="w-7 h-7 text-ink-2 hover:text-error"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Input
                value={r.buyer}
                onChange={(e) => setRow(r.key, { buyer: e.target.value })}
                placeholder="@username buyer"
                className="col-span-2 h-9 text-xs"
              />
              <Input
                value={r.member}
                onChange={(e) => setRow(r.key, { member: e.target.value })}
                placeholder="Fix member"
                className="h-9 text-xs"
              />
              <Input
                inputMode="numeric"
                value={fmtMoney(r.price)}
                onChange={(e) =>
                  setRow(r.key, { price: money(e.target.value) })
                }
                placeholder="Harga satuan"
                className="h-9 text-xs tabular-nums"
              />
              <Input
                inputMode="numeric"
                value={fmtMoney(r.dp)}
                onChange={(e) => setRow(r.key, { dp: money(e.target.value) })}
                placeholder="Nominal DP"
                className="h-9 text-xs tabular-nums"
              />
              <Input
                inputMode="numeric"
                value={fmtMoney(r.fp)}
                onChange={(e) => setRow(r.key, { fp: money(e.target.value) })}
                placeholder="Nominal FP"
                className="h-9 text-xs tabular-nums"
              />
              <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                <Checkbox
                  checked={r.dpDone}
                  onCheckedChange={(checked) =>
                    setRow(r.key, { dpDone: !!checked })
                  }
                />
                DP lunas
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                <Checkbox
                  checked={r.fpDone}
                  onCheckedChange={(checked) =>
                    setRow(r.key, { fpDone: !!checked })
                  }
                />
                FP lunas
              </label>
              <Input
                value={r.note}
                onChange={(e) => setRow(r.key, { note: e.target.value })}
                placeholder="Catatan"
                className="col-span-2 h-9 text-xs"
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Footer Controls */}
      <div className="mt-5 flex flex-col gap-3 border-t border-divider px-6 py-4 sm:flex-row sm:items-center bg-surface">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRows((rs) => [...rs, blankDraft()])}
          className="h-10 px-3.5 rounded-control text-ink hover:text-primary sm:mr-auto"
        >
          <Plus className="w-4 h-4 text-primary" />
          <span>Tambah Baris</span>
        </Button>
        <span className="text-[11px] text-ink-2 font-medium sm:mr-2">
          {valid.length} baris siap disimpan (buyer & DP wajib)
        </span>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 px-4 rounded-control text-ink-2 hover:text-ink"
          >
            Batal / Tutup
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!ok}
            onClick={handleSave}
            className="h-10 px-5 rounded-control text-white"
          >
            <Check className="w-4 h-4" />
            <span>Simpan & Tampilkan di Buyer</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

