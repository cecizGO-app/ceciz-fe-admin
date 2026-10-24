import React, { useState, useEffect } from "react";
import { Check, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { STAGES, type Stage, type Pkg } from "@/types/tracking";
import { SwitchToggle, TrackingSelect } from "./TrackingBadges";

interface TrackingDrawerProps {
  pkg: Pkg;
  warehouses: string[];
  onAddWarehouse: (w: string) => void;
  onClose: () => void;
  onSave: (p: Pkg) => void;
}

const now = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][d.getMonth()]}, ${p(d.getHours())}:${p(d.getMinutes())}`;
};

export const TrackingDrawer: React.FC<TrackingDrawerProps> = ({
  pkg,
  warehouses,
  onAddWarehouse,
  onClose,
  onSave,
}) => {
  const [d, setD] = useState<Pkg>({
    ...pkg,
    resi: pkg.resi.length ? [...pkg.resi] : [""],
  });
  const [newWh, setNewWh] = useState<string | null>(null);
  const idx = STAGES.indexOf(d.stage);
  const set = <K extends keyof Pkg>(k: K, v: Pkg[K]) =>
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

  const save = (stage?: Stage) =>
    onSave({
      ...d,
      stage: stage ?? d.stage,
      resi: d.resi.map((r) => r.trim()).filter(Boolean),
      updated: now(),
    });

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-card sm:max-w-md sm:rounded-l-[24px] animate-in slide-in-from-right duration-200"
      >
        <div className="flex items-start gap-3 border-b border-[#FBCFE8]/50 px-6 py-5">
          <div className="flex-1">
            <h2 className="text-[20px] font-bold text-[#18181B] tracking-tight">
              Edit Tracking Pengiriman
            </h2>
            <p className="mt-1 text-xs text-[#71717A]">
              <span className="font-mono text-[#18181B] font-semibold">{pkg.batch}</span> ·{" "}
              {pkg.buyer}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-[10px] text-[#71717A] hover:bg-[#FFF5FA] hover:text-[#EC4899]"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Vertical Stepper 7 Tahap */}
          <section className="rounded-[16px] bg-[#FFF5FA]/70 p-4 border border-[#FBCFE8]">
            <p className="mb-3 text-xs font-semibold text-[#18181B]">Progres 7 Tahap Pengiriman</p>
            <ol className="flex flex-col">
              {STAGES.map((s, i) => {
                const done = i < idx;
                const active = i === idx;
                return (
                  <li key={s} className="relative flex gap-3 pb-3 last:pb-0">
                    {i < STAGES.length - 1 && (
                      <span
                        className={cn(
                          "absolute left-[11px] top-6 h-[calc(100%-18px)] w-0.5 rounded",
                          done ? "bg-primary" : "bg-zinc-200"
                        )}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => set("stage", s)}
                      aria-label={`Set status ${s}`}
                      className={cn(
                        "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all duration-150 cursor-pointer",
                        active
                          ? "border-primary bg-primary text-white shadow-focus scale-110"
                          : done
                            ? "border-primary bg-primary text-white"
                            : "border-zinc-300 bg-white text-[#71717A] hover:border-primary"
                      )}
                    >
                      {done ? <Check className="size-3" /> : i + 1}
                    </button>
                    <div className="flex min-h-6 flex-1 items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-xs",
                          active
                            ? "text-primary font-bold"
                            : done
                              ? "text-[#18181B] font-medium"
                              : "text-[#71717A]"
                        )}
                      >
                        {s}
                      </span>
                      {active && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                          Saat ini
                        </Badge>
                      )}
                      {s === "Done" && !active && (
                        <span className="text-[11px] text-[#71717A]">otomatis arsip</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="mt-5 flex flex-col gap-4">
            <div>
              <Label htmlFor="drawer-stage">Status saat ini</Label>
              <TrackingSelect
                value={d.stage}
                onChange={(v) => set("stage", v as Stage)}
                options={[...STAGES]}
              />
            </div>

            <div>
              <Label htmlFor="drawer-warehouse">Warehouse</Label>
              {newWh === null ? (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <TrackingSelect
                      value={d.warehouse}
                      onChange={(v) => set("warehouse", v)}
                      options={warehouses}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNewWh("")}
                    className="h-11 px-3 text-xs gap-1.5 shrink-0"
                    aria-label="Tambah warehouse baru"
                  >
                    <Plus className="size-4" /> Baru
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    autoFocus
                    value={newWh}
                    onChange={(e) => setNewWh(e.target.value)}
                    placeholder="Nama warehouse baru"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    disabled={!newWh.trim()}
                    onClick={() => {
                      const w = newWh.trim();
                      onAddWarehouse(w);
                      set("warehouse", w);
                      setNewWh(null);
                    }}
                    className="h-11 px-3 text-xs shrink-0"
                  >
                    Tambah
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setNewWh(null)}
                    className="h-11 w-11 shrink-0"
                    aria-label="Batal"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="drawer-box">Nomor box / paket</Label>
              <Input
                id="drawer-box"
                value={d.box}
                onChange={(e) => set("box", e.target.value)}
                placeholder="BOX-CH-025-03"
                className="font-mono text-xs"
              />
            </div>

            <div>
              <Label>Nomor resi</Label>
              <div className="flex flex-col gap-2">
                {d.resi.map((r, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={r}
                      onChange={(e) =>
                        set(
                          "resi",
                          d.resi.map((x, j) => (j === i ? e.target.value : x)),
                        )
                      }
                      placeholder={`Resi seller ${i + 1}`}
                      className="font-mono text-xs"
                    />
                    {d.resi.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          set(
                            "resi",
                            d.resi.filter((_, j) => j !== i),
                          )
                        }
                        aria-label="Hapus resi"
                        className="h-11 w-11 shrink-0 text-[#71717A] hover:text-rose-600 hover:bg-rose-50"
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => set("resi", [...d.resi, ""])}
                  className="flex items-center gap-1.5 self-start text-xs font-semibold text-primary transition-colors hover:text-[#BE185D] cursor-pointer mt-1"
                >
                  <Plus className="size-3.5" /> Tambah Resi Lain
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Label>Checklist admin internal</Label>
              <SwitchToggle
                on={d.co}
                onChange={() => set("co", !d.co)}
                label="Sudah Checkout (CO) di Shopee"
                hint="Monitoring konfirmasi packing admin"
              />
              <SwitchToggle
                on={d.album}
                onChange={() => set("album", !d.album)}
                label="Foto Sudah Diupload ke Album LINE"
                hint="Monitoring share ke grup buyer"
              />
            </div>

            <div className="pt-1">
              <Label htmlFor="drawer-note">Catatan internal</Label>
              <Textarea
                id="drawer-note"
                rows={3}
                value={d.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder="Contoh: Barang digabung dengan batch KR-019, butuh bubble wrap tebal"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#FBCFE8]/50 px-6 py-4 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            className="sm:mr-auto h-11 px-4 text-xs"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-11 px-4 text-xs"
            onClick={() => save("Done")}
          >
            Arsipkan Paket
          </Button>
          <Button
            type="button"
            className="h-11 px-4 text-xs gap-1.5"
            onClick={() => save()}
          >
            <Check className="size-4" /> Simpan Pembaruan
          </Button>
        </div>
      </aside>
    </div>
  );
};
