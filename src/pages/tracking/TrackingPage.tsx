import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  X,
  Plus,
  Search,
  Edit3,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const STAGES = [
  "PO",
  "On Seller Hand",
  "Arrived WH Luar",
  "OTW INA",
  "Arrived WH INA",
  "Bisa di CO",
  "Done",
] as const;
export type Stage = (typeof STAGES)[number];

// Palette warna status sesuai aturan Ceciz GO Admin — RAG Semantik murni
const stageTone: Record<Stage, string> = {
  PO: "bg-sky-50 text-sky-700 border-sky-200",
  "On Seller Hand": "bg-amber-50 text-amber-700 border-amber-200",
  "Arrived WH Luar": "bg-purple-50 text-purple-700 border-purple-200",
  "OTW INA": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Arrived WH INA": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Bisa di CO": "bg-orange-50 text-orange-700 border-orange-200",
  Done: "bg-slate-100 text-slate-700 border-slate-200",
};

export type Pkg = {
  id: number;
  batch: string;
  country: string;
  buyer: string;
  handle: string;
  item: string;
  warehouse: string;
  resi: string[];
  box: string;
  stage: Stage;
  co: boolean;
  album: boolean;
  updated: string;
  note: string;
};

const flags: Record<string, string> = {
  CH: "🇨🇳",
  KR: "🇰🇷",
  JP: "🇯🇵",
  TH: "🇹🇭",
  INA: "🇮🇩",
};

const seed: Pkg[] = [
  {
    id: 1,
    batch: "CH-025",
    country: "CH",
    buyer: "Maya Putri",
    handle: "@mayaputri",
    item: "IVE Switch MD (1 pcs)",
    warehouse: "Guangzhou A",
    resi: ["YT72840193", "YT72840207"],
    box: "BOX-CH-025-03",
    stage: "Arrived WH Luar",
    co: false,
    album: false,
    updated: "17 Sep, 08:20",
    note: "",
  },
  {
    id: 2,
    batch: "KR-019",
    country: "KR",
    buyer: "Nadya Salsabila",
    handle: "@nadyasalsa",
    item: "NCT Wish Album (2 pcs)",
    warehouse: "Seoul WH",
    resi: ["KR0194827"],
    box: "BOX-KR-019-01",
    stage: "OTW INA",
    co: false,
    album: false,
    updated: "16 Sep, 19:45",
    note: "Barang digabung dengan batch KR-018, butuh bubble wrap tebal",
  },
  {
    id: 3,
    batch: "JP-014",
    country: "JP",
    buyer: "Rania Yusuf",
    handle: "@raniays",
    item: "SKZ Japan MD (1 pcs)",
    warehouse: "Osaka Hub",
    resi: ["JP5228104"],
    box: "BOX-JP-014-02",
    stage: "Arrived WH INA",
    co: false,
    album: true,
    updated: "16 Sep, 16:10",
    note: "",
  },
  {
    id: 4,
    batch: "TH-011",
    country: "TH",
    buyer: "Dita Anggraini",
    handle: "@ditaang",
    item: "BUS Fan Kit (1 pcs)",
    warehouse: "Bangkok 2",
    resi: ["TH0088291"],
    box: "BOX-TH-011-01",
    stage: "Bisa di CO",
    co: true,
    album: true,
    updated: "15 Sep, 14:02",
    note: "",
  },
  {
    id: 5,
    batch: "INA-032",
    country: "INA",
    buyer: "Shafira Zahra",
    handle: "@shafirazh",
    item: "Local Official Merch (1 pcs)",
    warehouse: "Jakarta Admin",
    resi: ["ID0982231"],
    box: "BOX-INA-032-01",
    stage: "Bisa di CO",
    co: true,
    album: true,
    updated: "15 Sep, 11:20",
    note: "",
  },
  {
    id: 6,
    batch: "CH-022",
    country: "CH",
    buyer: "Citra Nabila",
    handle: "@citranbl",
    item: "Aespa Photobook (1 pcs)",
    warehouse: "Guangzhou A",
    resi: ["ID7719280"],
    box: "BOX-CH-022-04",
    stage: "Done",
    co: true,
    album: true,
    updated: "14 Sep, 11:24",
    note: "",
  },
  {
    id: 7,
    batch: "CH-025",
    country: "CH",
    buyer: "Talia Novita",
    handle: "@talianov",
    item: "IVE Switch MD (2 pcs)",
    warehouse: "Guangzhou A",
    resi: ["YT72840211"],
    box: "BOX-CH-025-03",
    stage: "On Seller Hand",
    co: false,
    album: false,
    updated: "17 Sep, 07:55",
    note: "",
  },
  {
    id: 8,
    batch: "KR-019",
    country: "KR",
    buyer: "Citra Nabila",
    handle: "@citranbl",
    item: "RIIZE Photocard Set (3 pcs)",
    warehouse: "Seoul WH",
    resi: ["KR0194833", "KR0194840"],
    box: "BOX-KR-019-02",
    stage: "OTW INA",
    co: false,
    album: false,
    updated: "16 Sep, 19:45",
    note: "",
  },
  {
    id: 9,
    batch: "JP-014",
    country: "JP",
    buyer: "Laras Wulandari",
    handle: "@laraswl",
    item: "NiziU Lightstick (1 pcs)",
    warehouse: "Osaka Hub",
    resi: [],
    box: "",
    stage: "PO",
    co: false,
    album: false,
    updated: "16 Sep, 10:12",
    note: "",
  },
  {
    id: 10,
    batch: "CH-025",
    country: "CH",
    buyer: "Keisha Amalia",
    handle: "@keishaaml",
    item: "LE SSERAFIM Album (1 pcs)",
    warehouse: "Guangzhou A",
    resi: ["YT72840225"],
    box: "BOX-CH-025-04",
    stage: "Arrived WH Luar",
    co: false,
    album: false,
    updated: "16 Sep, 09:30",
    note: "",
  },
  {
    id: 11,
    batch: "TH-011",
    country: "TH",
    buyer: "Aulia Rahma",
    handle: "@auliarhm",
    item: "BUS Photo Strip (2 pcs)",
    warehouse: "Bangkok 2",
    resi: ["TH0088305"],
    box: "BOX-TH-011-01",
    stage: "Arrived WH INA",
    co: false,
    album: true,
    updated: "15 Sep, 18:44",
    note: "",
  },
  {
    id: 12,
    batch: "INA-032",
    country: "INA",
    buyer: "Bella Kirana",
    handle: "@bellakrn",
    item: "Local Official Merch (2 pcs)",
    warehouse: "Jakarta Admin",
    resi: ["ID0982240"],
    box: "BOX-INA-032-01",
    stage: "Bisa di CO",
    co: false,
    album: true,
    updated: "15 Sep, 11:20",
    note: "",
  },
  {
    id: 13,
    batch: "KR-018",
    country: "KR",
    buyer: "Gita Maharani",
    handle: "@gitamhr",
    item: "TWS Album (1 pcs)",
    warehouse: "Seoul WH",
    resi: ["KR0188102"],
    box: "BOX-KR-018-02",
    stage: "Done",
    co: true,
    album: true,
    updated: "12 Sep, 15:08",
    note: "",
  },
];

const PAGE = 8;
type Tab = "active" | "done" | "all";
const baseWarehouses = [
  "Guangzhou A",
  "Seoul WH",
  "Osaka Hub",
  "Bangkok 2",
  "Jakarta Admin",
];

const now = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][d.getMonth()]}, ${p(d.getHours())}:${p(d.getMinutes())}`;
};

/**
 * Filter select dropdown wrapping Radix shadcn/ui Select
 */
function TrackingSelect({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-11 rounded-[12px] border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] focus-visible:border-[#EC4899] focus-visible:ring-4 focus-visible:ring-[#EC4899]/24",
          className
        )}
      >
        <SelectValue placeholder="Pilih opsi" />
      </SelectTrigger>
      <SelectContent className="max-h-72 border-[#FBCFE8] bg-white text-xs shadow-card rounded-[16px]">
        {options.map((opt) => (
          <SelectItem key={opt} value={opt} className="text-xs cursor-pointer">
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ---------- small status components ---------- */
function StageBadge({ s }: { s: Stage }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 gap-1.5 px-2.5 text-[11px] font-semibold whitespace-nowrap rounded-full border shadow-2xs",
        stageTone[s]
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {s}
    </Badge>
  );
}

function CheckBadge({ on, yes, no }: { on: boolean; yes: string; no: string }) {
  return (
    <Badge
      variant={on ? "success" : "outline"}
      className={cn(
        "h-6 px-2 text-[11px] font-medium gap-1 rounded-full",
        !on && "bg-zinc-100 text-[#71717A] border-transparent"
      )}
    >
      {on && <Check className="size-3" />}
      {on ? yes : no}
    </Badge>
  );
}

function MiniCheck({
  on,
  label,
  title,
}: {
  on: boolean;
  label: string;
  title: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full px-2 text-[11px] font-medium border select-none transition-colors",
        on
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-zinc-100 text-[#71717A] border-transparent"
      )}
    >
      {on ? <Check className="size-3 text-emerald-600" /> : <span className="text-[#A1A1AA] font-bold">–</span>}
      {label}
    </span>
  );
}

function ResiChip({
  resi,
  onCopy,
}: {
  resi: string[];
  onCopy: (r: string) => void;
}) {
  if (!resi.length)
    return <span className="text-xs text-[#71717A]">Belum ada resi</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onCopy(resi[0]);
        }}
        title="Klik untuk copy"
        className="group inline-flex h-7 items-center gap-1.5 rounded-[8px] border border-[#FBCFE8] bg-[#FFF5FA] px-2 font-mono text-xs text-[#18181B] transition-colors duration-150 hover:border-[#EC4899] hover:text-[#EC4899] cursor-pointer shadow-2xs"
      >
        {resi[0]}
        <span className="text-[#71717A] group-hover:text-[#EC4899]">
          <Copy className="size-3" />
        </span>
      </button>
      {resi.length > 1 && (
        <Badge
          variant="secondary"
          className="h-6 px-1.5 text-[10px] font-semibold text-[#EC4899] bg-[#FFF5FA] border-[#FBCFE8]"
          title={resi.slice(1).join(", ")}
        >
          +{resi.length - 1} resi
        </Badge>
      )}
    </span>
  );
}

function Switch({
  on,
  onChange,
  label,
  hint,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className="flex w-full items-start gap-3 rounded-[12px] border border-[#FBCFE8] bg-white p-3.5 text-left transition-colors duration-150 hover:border-[#EC4899] hover:bg-[#FFF5FA]/40 cursor-pointer shadow-2xs"
    >
      <span
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-150",
          on ? "bg-primary" : "bg-zinc-200"
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-4 rounded-full bg-white shadow-sm transition-[left] duration-150",
            on ? "left-6" : "left-1"
          )}
        />
      </span>
      <span>
        <span className="block text-xs font-semibold text-[#18181B]">{label}</span>
        <span className="block text-[11px] text-[#71717A]">{hint}</span>
      </span>
    </button>
  );
}

/* ---------- Edit Drawer (Detailed Modal) ---------- */
function EditDrawer({
  pkg,
  warehouses,
  onAddWarehouse,
  onClose,
  onSave,
}: {
  pkg: Pkg;
  warehouses: string[];
  onAddWarehouse: (w: string) => void;
  onClose: () => void;
  onSave: (p: Pkg) => void;
}) {
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
              <Switch
                on={d.co}
                onChange={() => set("co", !d.co)}
                label="Sudah Checkout (CO) di Shopee"
                hint="Monitoring konfirmasi packing admin"
              />
              <Switch
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
}

/* ---------- Main TrackingPage Component ---------- */
interface TrackingPageProps {
  onNavigateToBatch?: () => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({
  onNavigateToBatch,
}) => {
  const [rows, setRows] = useState(seed);
  const [tab, setTab] = useState<Tab>("active");
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("Semua Negara");
  const [wh, setWh] = useState("Semua Warehouse");
  const [stage, setStage] = useState("Semua Status");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState<Pkg | null>(null);
  const [warehouses, setWarehouses] = useState(baseWarehouses);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2500);
  };

  const copy = async (r: string) => {
    try {
      await navigator.clipboard.writeText(r);
      notify(`Resi ${r} berhasil disalin ke clipboard`);
    } catch {
      notify(`Resi ${r} disalin`);
    }
  };

  const activeN = rows.filter((r) => r.stage !== "Done").length;
  const doneN = rows.length - activeN;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const code = country.split(" ").pop();
    return rows.filter(
      (r) =>
        (tab === "all" ||
          (tab === "done" ? r.stage === "Done" : r.stage !== "Done")) &&
        (country === "Semua Negara" || r.country === code) &&
        (wh === "Semua Warehouse" || r.warehouse === wh) &&
        (stage === "Semua Status" || r.stage === stage) &&
        (!s ||
          [r.batch, r.buyer, r.handle, r.item, ...r.resi].some((x) =>
            x.toLowerCase().includes(s),
          )),
    );
  }, [rows, tab, q, country, wh, stage]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const cur = Math.min(page, pages);
  const visible = filtered.slice((cur - 1) * PAGE, cur * PAGE);
  const reset = () => setPage(1);

  const save = (p: Pkg) => {
    setRows((rs) => rs.map((r) => (r.id === p.id ? p : r)));
    setEdit(null);
    notify(
      p.stage === "Done"
        ? `Paket ${p.batch} · ${p.buyer} otomatis diarsipkan (Done)`
        : `Tracking ${p.batch} · ${p.buyer} berhasil diperbarui`,
    );
  };

  const tabs: { key: Tab; label: string; n?: number }[] = [
    { key: "active", label: "Paket Aktif", n: activeN },
    { key: "done", label: "Arsip Selesai / Done", n: doneN },
    { key: "all", label: "Semua Pengiriman" },
  ];

  const stats = [
    {
      label: "Total Paket Berjalan",
      value: String(activeN),
      unit: "barang",
      note: "Sedang dalam proses pengiriman",
      dot: "bg-sky-500",
    },
    {
      label: "Tiba di Warehouse ID",
      value: String(
        rows.filter((r) => r.stage === "Arrived WH INA").length,
      ),
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
      value: String(doneN),
      unit: "barang",
      note: "Status 'Done' otomatis arsip",
      dot: "bg-slate-500",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-[12px] bg-[#18181B] px-4 py-3 text-xs text-white shadow-xl border border-zinc-800 animate-in fade-in zoom-in-95 duration-150">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-[#71717A] mb-1">
            <span className="text-[#71717A]">
              Operasional
            </span>
            <span>&gt;</span>
            <span className="text-[#EC4899] font-medium">
              Tracking Logistik
            </span>
          </nav>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-[#18181B] tracking-tight">
            Tracking Logistik &amp; Pengiriman
          </h1>
          <p className="mt-1 max-w-[680px] text-xs sm:text-sm text-[#71717A]">
            Perbarui status 7 tahap pengiriman barang, kelola nomor resi multi-seller, dan pantau checklist internal admin.
          </p>
        </div>

        {onNavigateToBatch && (
          <Button
            type="button"
            onClick={onNavigateToBatch}
            className="h-11 px-4 gap-2 text-xs font-semibold self-start sm:self-auto shrink-0 shadow-xs"
          >
            <Package className="w-4 h-4" />
            <span>+ Buat Batch Baru</span>
          </Button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 flex flex-col gap-3 rounded-[24px] border-[#FBCFE8]/60 bg-white shadow-card">
            <div className="flex items-center gap-2">
              <span className={cn("size-2 shrink-0 rounded-full", s.dot)} />
              <p className="text-xs text-[#71717A] font-medium">{s.label}</p>
            </div>
            <div>
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[28px] font-bold text-[#18181B] tracking-tight tabular-nums">
                  {s.value}
                </span>
                <span className="text-xs text-[#71717A]">{s.unit}</span>
              </p>
              <p className="mt-0.5 text-xs text-[#71717A]">{s.note}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Tab Navigasi */}
      <div className="-mb-2 flex gap-1 overflow-x-auto border-b border-[#FBCFE8]/50">
        {tabs.map((t) => {
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key);
                reset();
              }}
              className={cn(
                "relative flex h-11 shrink-0 items-center gap-2 px-3 text-xs sm:text-sm transition-colors duration-150 cursor-pointer",
                on ? "text-primary font-bold" : "text-[#71717A] hover:text-[#18181B]"
              )}
            >
              <span>{t.label}</span>
              {t.n !== undefined && (
                <Badge
                  variant={on ? "default" : "secondary"}
                  className={cn(
                    "h-5 min-w-5 px-1.5 text-[10px] tabular-nums",
                    !on && "bg-zinc-100 text-[#71717A] border-transparent"
                  )}
                >
                  {t.n}
                </Badge>
              )}
              {on && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Table Card Section */}
      <Card className="overflow-hidden p-0 gap-0 border-[#FBCFE8]/60 bg-white shadow-card rounded-[24px]">
        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3 xl:grid-cols-[minmax(260px,1fr)_170px_190px_190px]">
          <div className="relative sm:col-span-3 xl:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#71717A]" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                reset();
              }}
              placeholder="Cari nomor batch, buyer, resi, barang..."
              className="pl-9.5 pr-9 text-xs"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Hapus pencarian"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <TrackingSelect
            value={country}
            onChange={(v) => {
              setCountry(v);
              reset();
            }}
            options={[
              "Semua Negara",
              ...Object.entries(flags).map(([c, f]) => `${f} ${c}`),
            ]}
          />
          <TrackingSelect
            value={wh}
            onChange={(v) => {
              setWh(v);
              reset();
            }}
            options={["Semua Warehouse", ...warehouses]}
          />
          <TrackingSelect
            value={stage}
            onChange={(v) => {
              setStage(v);
              reset();
            }}
            options={[
              "Semua Status",
              ...STAGES.filter(
                (s) =>
                  tab === "all" ||
                  (tab === "done" ? s === "Done" : s !== "Done"),
              ),
            ]}
          />
        </div>

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
              {visible.map((p) => (
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
                    <ResiChip resi={p.resi} onCopy={copy} />
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
                        title={
                          p.co ? "Sudah CO Shopee" : "Belum CO Shopee"
                        }
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
                        onClick={() => setEdit(p)}
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
          {visible.map((p) => (
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
                <ResiChip resi={p.resi} onCopy={copy} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-[#FBCFE8]/40 pt-3">
                <CheckBadge on={p.co} yes="CO: ✓" no="CO: —" />
                <CheckBadge on={p.album} yes="Album: ✓" no="Album: —" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-auto h-8 px-2.5 gap-1.5 text-xs text-primary border-[#FBCFE8] hover:bg-[#FFF5FA] hover:text-[#BE185D]"
                  onClick={() => setEdit(p)}
                >
                  <Edit3 className="size-3.5" /> Update Status
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {visible.length === 0 && (
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
            {filtered.length === 0
              ? "Tidak ada data"
              : `Menampilkan ${(cur - 1) * PAGE + 1}–${Math.min(
                  cur * PAGE,
                  filtered.length,
                )} dari ${filtered.length} ${
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
              disabled={cur === 1}
              onClick={() => setPage(cur - 1)}
              className="h-9 px-3 text-xs"
            >
              Sebelumnya
            </Button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                type="button"
                variant={n === cur ? "default" : "ghost"}
                size="sm"
                onClick={() => setPage(n)}
                className={cn(
                  "size-9 p-0 text-xs tabular-nums",
                  n !== cur && "text-[#71717A] hover:bg-[#FFF5FA] hover:text-primary"
                )}
              >
                {n}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={cur === pages}
              onClick={() => setPage(cur + 1)}
              className="h-9 px-3 text-xs"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </Card>

      {/* Edit Drawer Modal */}
      {edit && (
        <EditDrawer
          pkg={edit}
          warehouses={
            warehouses.includes(edit.warehouse)
              ? warehouses
              : [...warehouses, edit.warehouse]
          }
          onAddWarehouse={(w) =>
            setWarehouses((ws) => (ws.includes(w) ? ws : [...ws, w]))
          }
          onClose={() => setEdit(null)}
          onSave={save}
        />
      )}
    </div>
  );
};

export default TrackingPage;
