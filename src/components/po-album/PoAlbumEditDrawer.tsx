import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  PoAlbumOrder,
  PaymentMethodType,
  CoWebStatus,
} from "@/types/po-album";

interface PoAlbumEditDrawerProps {
  order: PoAlbumOrder;
  onClose: () => void;
  onSave: (order: PoAlbumOrder) => void;
  methods: PaymentMethodType[];
  coList: CoWebStatus[];
}

const rp = (n: number) => "Rp " + n.toLocaleString("id-ID");
const money = (v: string) => v.replace(/\D/g, "");
const fmtMoney = (v: string) => (v ? Number(v).toLocaleString("id-ID") : "");

const coTone: Record<CoWebStatus, string> = {
  "Not Started": "bg-slate-100 text-slate-700 border-slate-200",
  "CO Open": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Order Submitted": "bg-purple-50 text-purple-700 border-purple-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export const PoAlbumEditDrawer: React.FC<PoAlbumEditDrawerProps> = ({
  order,
  onClose,
  onSave,
  methods,
  coList,
}) => {
  const [d, setD] = useState(order);
  const set = <K extends keyof PoAlbumOrder>(k: K, v: PoAlbumOrder[K]) =>
    setD((x) => ({ ...x, [k]: v }));

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-surface shadow-2xl sm:max-w-md border-l border-border animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-divider px-6 py-5 bg-subpanel/50">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-ink tracking-tight">
              Detail Pesanan Album
            </h2>
            <p className="mt-1 text-xs text-ink-2">
              <span className="font-mono text-ink font-bold">
                {order.batch}
              </span>{" "}
              &middot; {order.buyer}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-control text-ink-2 hover:text-ink hover:bg-subpanel"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body Content */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          {/* Summary Card */}
          <section className="rounded-control bg-subpanel border border-border/80 p-5 space-y-3">
            <div>
              <p className="text-sm font-bold text-ink">{d.album}</p>
              <p className="text-xs text-ink-2 mt-0.5">
                Member: <strong className="text-ink">{d.member}</strong>{" "}
                &middot; {d.qty} pcs &middot; {d.type}
              </p>
            </div>
            <div className="flex items-end justify-between gap-3 border-t border-border/60 pt-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ink-2 font-bold">
                  Total Harga
                </p>
                <p className="text-2xl font-extrabold text-ink tabular-nums mt-0.5">
                  {rp(d.dp + d.fp)}
                </p>
              </div>
              <span
                className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-semibold ${
                  coTone[d.co] || coTone["Not Started"]
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {d.co}
              </span>
            </div>
          </section>

          {/* Section Down Payment (DP) */}
          <section className="flex flex-col gap-3 rounded-control border border-border/70 p-4 bg-surface">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
              Down Payment (DP)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-ink-2 tracking-wider uppercase block mb-1.5">
                  Nominal DP
                </label>
                <Input
                  inputMode="numeric"
                  value={fmtMoney(String(d.dp))}
                  onChange={(e) =>
                    set("dp", Number(money(e.target.value) || 0))
                  }
                  className="h-10 rounded-control border-border bg-surface text-xs font-semibold tabular-nums"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink-2 tracking-wider uppercase block mb-1.5">
                  Metode Bayar DP
                </label>
                <Select
                  value={d.dpMethod}
                  onValueChange={(v) => set("dpMethod", v as PaymentMethodType)}
                >
                  <SelectTrigger className="h-10 rounded-control border-border bg-surface text-xs font-semibold text-ink">
                    <SelectValue placeholder="Metode DP" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[16px] border-border shadow-card">
                    {methods.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggle Status DP Lunas */}
            <div className="flex items-center justify-between gap-3 rounded-control border border-border/60 bg-surface px-3.5 py-3 mt-1">
              <span className="text-xs font-semibold text-ink">
                Status DP Lunas
              </span>
              <Switch
                checked={d.dpDone}
                onCheckedChange={(checked) => set("dpDone", checked)}
              />
            </div>
          </section>

          {/* Section Final Payment (FP) */}
          <section className="flex flex-col gap-3 rounded-control border border-border/70 p-4 bg-surface">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
              Final Payment (FP)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-ink-2 tracking-wider uppercase block mb-1.5">
                  Nominal FP
                </label>
                <Input
                  inputMode="numeric"
                  value={fmtMoney(String(d.fp))}
                  onChange={(e) =>
                    set("fp", Number(money(e.target.value) || 0))
                  }
                  className="h-10 rounded-control border-border bg-surface text-xs font-semibold tabular-nums"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-ink-2 tracking-wider uppercase block mb-1.5">
                  Metode Bayar FP
                </label>
                <Select
                  value={d.fpMethod}
                  onValueChange={(v) => set("fpMethod", v as PaymentMethodType)}
                >
                  <SelectTrigger className="h-10 rounded-control border-border bg-surface text-xs font-semibold text-ink">
                    <SelectValue placeholder="Metode FP" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[16px] border-border shadow-card">
                    {methods.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggle Status FP Lunas */}
            <div className="flex items-center justify-between gap-3 rounded-control border border-border/60 bg-surface px-3.5 py-3 mt-1">
              <span className="text-xs font-semibold text-ink">
                Status FP Lunas (Pelunasan Selesai)
              </span>
              <Switch
                checked={d.fpDone}
                onCheckedChange={(checked) => set("fpDone", checked)}
              />
            </div>

            {d.fpDone && !d.dpDone && (
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-[8px] border border-amber-200">
                FP ditandai lunas, tapi DP belum. Pastikan DP juga sudah dibayar.
              </p>
            )}
          </section>

          {/* Status CO Web */}
          <div>
            <label className="text-[11px] font-bold text-ink-2 tracking-wider uppercase block mb-1.5">
              Status CO Web
            </label>
            <Select
              value={d.co}
              onValueChange={(v) => set("co", v as CoWebStatus)}
            >
              <SelectTrigger className="h-10 rounded-control border-border bg-surface text-xs font-semibold text-ink">
                <SelectValue placeholder="Status CO" />
              </SelectTrigger>
              <SelectContent className="rounded-[16px] border-border shadow-card">
                {coList.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="text-[11px] font-bold text-ink-2 tracking-wider uppercase block mb-1.5">
              Catatan Tambahan
            </label>
            <Textarea
              rows={3}
              value={d.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="Contoh: titip sealed, denda 2k DP"
              className="resize-none rounded-control border-border bg-surface text-xs font-medium text-ink"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse gap-2 border-t border-divider px-6 py-4 sm:flex-row sm:justify-end bg-subpanel/40">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 px-4 rounded-control text-ink-2 hover:text-ink"
          >
            Batal
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onSave(d)}
            className="h-10 px-5 rounded-control text-white"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </Button>
        </div>
      </aside>
    </div>
  );
};

