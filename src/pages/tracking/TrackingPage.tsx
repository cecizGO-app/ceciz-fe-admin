import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Check,
  Copy,
  X,
  Plus,
  Search,
  Edit3,
  ChevronDown,
  Package,
} from "lucide-react";

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

// Palette warna status sesuai aturan Ceciz GO Admin — Color Tokens (RAG Semantik murni, tanpa primary pink untuk status)
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

// UI Design System Constants & Helpers
export const card = "rounded-panel border border-border bg-surface shadow-card";
export const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-control bg-primary px-4 t-body-med text-white transition-colors duration-150 hover:bg-primary-hover active:scale-[0.99] cursor-pointer shadow-xs";
export const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-control border border-border bg-surface px-4 t-body-med text-ink transition-colors duration-150 hover:bg-subpanel hover:border-primary/50 cursor-pointer";
export const field =
  "h-11 w-full rounded-control border border-border bg-surface px-3.5 t-support text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-3 focus:border-primary focus:shadow-focus";

export function Select({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 w-full rounded-control border border-border bg-surface px-3.5 pr-8 t-support text-ink outline-none transition-[border-color,box-shadow] duration-150 hover:border-primary/50 focus:border-primary focus:shadow-focus cursor-pointer appearance-none ${className}`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
    </div>
  );
}

/* ---------- small parts ---------- */
function StageBadge({ s }: { s: Stage }) {
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 t-micro ${stageTone[s]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {s}
    </span>
  );
}

function CheckBadge({ on, yes, no }: { on: boolean; yes: string; no: string }) {
  return (
    <span
      className={`inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full px-2 text-[11px] f-med ${
        on ? "bg-[#ecfdf3] text-success" : "bg-[#f4f4f5] text-ink-3"
      }`}
    >
      {on && <Check className="size-3" />}
      {on ? yes : no}
    </span>
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
      className={`inline-flex h-6 items-center gap-0.5 whitespace-nowrap rounded-full px-1.5 text-[11px] f-med ${
        on ? "bg-[#ecfdf3] text-success" : "bg-[#f4f4f5] text-ink-3"
      }`}
    >
      {on ? <Check className="size-3" /> : <span className="px-0.5">–</span>}
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
    return <span className="t-support text-ink-3">Belum ada resi</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onCopy(resi[0]);
        }}
        title="Klik untuk copy"
        className="group inline-flex h-7 items-center gap-1.5 rounded-[8px] border border-divider bg-subpanel px-2 font-mono text-[12px] text-ink transition-colors duration-150 hover:border-primary hover:text-primary cursor-pointer"
      >
        {resi[0]}
        <span className="text-ink-3 group-hover:text-primary">
          <Copy className="size-3" />
        </span>
      </button>
      {resi.length > 1 && (
        <span
          className="whitespace-nowrap rounded-full bg-divider px-1.5 py-0.5 text-[10px] text-primary-hover f-semi"
          title={resi.slice(1).join(", ")}
        >
          +{resi.length - 1} resi
        </span>
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
      className="flex w-full items-start gap-3 rounded-control border border-divider bg-surface p-3.5 text-left transition-colors duration-150 hover:border-border cursor-pointer"
    >
      <span
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ${
          on ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-[left] duration-150 ${
            on ? "left-6" : "left-1"
          }`}
        />
      </span>
      <span>
        <span className="block t-body-med text-ink">{label}</span>
        <span className="block t-micro text-ink-3">{hint}</span>
      </span>
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="t-micro text-ink-2">{label}</span>
      {children}
    </div>
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
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-surface shadow-card sm:max-w-md sm:rounded-l-panel animate-in slide-in-from-right duration-200"
      >
        <div className="flex items-start gap-3 border-b border-divider px-6 py-5">
          <div className="flex-1">
            <h2 className="t-h2 text-[20px] text-ink">Edit Tracking Pengiriman</h2>
            <p className="mt-1 t-support text-ink-2">
              <span className="font-mono text-ink f-semi">{pkg.batch}</span> ·{" "}
              {pkg.buyer}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-[8px] p-1.5 text-ink-3 transition-colors duration-150 hover:bg-subpanel hover:text-ink cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Vertical Stepper 7 Tahap */}
          <section className="rounded-control bg-subpanel p-4 border border-divider">
            <p className="mb-3 t-micro text-ink-2 font-medium">Progres 7 Tahap Pengiriman</p>
            <ol className="flex flex-col">
              {STAGES.map((s, i) => {
                const done = i < idx;
                const active = i === idx;
                return (
                  <li key={s} className="relative flex gap-3 pb-3 last:pb-0">
                    {i < STAGES.length - 1 && (
                      <span
                        className={`absolute left-[11px] top-6 h-[calc(100%-18px)] w-0.5 rounded ${
                          done ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => set("stage", s)}
                      aria-label={`Set status ${s}`}
                      className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] f-bold transition-all duration-150 cursor-pointer ${
                        active
                          ? "border-primary bg-primary text-white shadow-focus scale-110"
                          : done
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-surface text-ink-3 hover:border-primary"
                      }`}
                    >
                      {done ? <Check className="size-3" /> : i + 1}
                    </button>
                    <div className="flex min-h-6 flex-1 items-center justify-between gap-2">
                      <span
                        className={`t-support ${
                          active
                            ? "text-primary f-semi"
                            : done
                              ? "text-ink font-medium"
                              : "text-ink-3"
                        }`}
                      >
                        {s}
                      </span>
                      {active && (
                        <span className="t-micro text-primary font-semibold">
                          Saat ini
                        </span>
                      )}
                      {s === "Done" && !active && (
                        <span className="t-micro text-ink-3">otomatis arsip</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="mt-5 flex flex-col gap-4">
            <Field label="Status saat ini">
              <Select
                value={d.stage}
                onChange={(v) => set("stage", v as Stage)}
                options={[...STAGES]}
              />
            </Field>

            <Field label="Warehouse">
              {newWh === null ? (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      value={d.warehouse}
                      onChange={(v) => set("warehouse", v)}
                      options={warehouses}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewWh("")}
                    className={`${btnGhost} shrink-0 px-3`}
                    aria-label="Tambah warehouse baru"
                  >
                    <Plus className="size-4" /> Baru
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newWh}
                    onChange={(e) => setNewWh(e.target.value)}
                    placeholder="Nama warehouse baru"
                    className={field}
                  />
                  <button
                    type="button"
                    disabled={!newWh.trim()}
                    onClick={() => {
                      const w = newWh.trim();
                      onAddWarehouse(w);
                      set("warehouse", w);
                      setNewWh(null);
                    }}
                    className={`${btnPrimary} shrink-0 px-3 disabled:opacity-50`}
                  >
                    Tambah
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewWh(null)}
                    className={`${btnGhost} shrink-0 px-3`}
                    aria-label="Batal"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
            </Field>

            <Field label="Nomor box / paket">
              <input
                value={d.box}
                onChange={(e) => set("box", e.target.value)}
                placeholder="BOX-CH-025-03"
                className={`${field} font-mono`}
              />
            </Field>

            <Field label="Nomor resi">
              <div className="flex flex-col gap-2">
                {d.resi.map((r, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={r}
                      onChange={(e) =>
                        set(
                          "resi",
                          d.resi.map((x, j) => (j === i ? e.target.value : x)),
                        )
                      }
                      placeholder={`Resi seller ${i + 1}`}
                      className={`${field} font-mono`}
                    />
                    {d.resi.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            "resi",
                            d.resi.filter((_, j) => j !== i),
                          )
                        }
                        aria-label="Hapus resi"
                        className={`${btnGhost} shrink-0 px-3 hover:border-error hover:text-error`}
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => set("resi", [...d.resi, ""])}
                  className="flex items-center gap-1.5 self-start t-micro text-primary transition-colors duration-150 hover:text-primary-hover cursor-pointer"
                >
                  <Plus className="size-3.5" /> Tambah Resi Lain
                </button>
              </div>
            </Field>

            <div className="flex flex-col gap-2">
              <span className="t-micro text-ink-2 font-medium">Checklist admin internal</span>
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

            <Field label="Catatan internal">
              <textarea
                rows={3}
                value={d.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder="Contoh: Barang digabung dengan batch KR-019, butuh bubble wrap tebal"
                className="resize-none rounded-control border border-border bg-surface px-3.5 py-3 t-support text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-3 focus:border-primary focus:shadow-focus"
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-divider px-6 py-4 sm:flex-row sm:items-center">
          <button
            type="button"
            className={`${btnGhost} sm:mr-auto`}
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="button"
            className={btnGhost}
            onClick={() => save("Done")}
          >
            Arsipkan Paket
          </button>
          <button
            type="button"
            className={btnPrimary}
            onClick={() => save()}
          >
            <Check className="size-4" /> Simpan Pembaruan
          </button>
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
      dot: "bg-info",
    },
    {
      label: "Tiba di Warehouse ID",
      value: String(
        rows.filter((r) => r.stage === "Arrived WH INA").length,
      ),
      unit: "barang",
      note: "Siap disortir admin",
      dot: "bg-success",
    },
    {
      label: "Siap di-CO Shopee",
      value: String(rows.filter((r) => r.stage === "Bisa di CO").length),
      unit: "barang",
      note: "Status 'Bisa di CO'",
      dot: "bg-warning",
    },
    {
      label: "Paket Selesai (Arsip)",
      value: String(doneN),
      unit: "barang",
      note: "Status 'Done' otomatis arsip",
      dot: "bg-slate-500",
    },
  ];

  const th =
    "py-3.5 pr-4 text-left text-[11px] uppercase tracking-wider text-ink-2 f-bold whitespace-nowrap";
  const td = "py-3.5 pr-4 align-middle";
  const editBtn =
    "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-control border border-border bg-surface px-3 t-micro text-primary transition-colors duration-150 hover:border-primary hover:bg-subpanel cursor-pointer shadow-2xs";

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-control bg-ink px-4 py-3 t-micro text-white shadow-hover border border-zinc-800 animate-in fade-in zoom-in-95 duration-150">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <nav className="mb-1 text-[11px] uppercase tracking-wider text-primary f-semi">
            <span
              onClick={onNavigateToBatch}
              className="cursor-pointer hover:text-primary-hover"
            >
              Batch Operasional
            </span>{" "}
            · Tracking Logistik
          </nav>
          <h1 className="t-h1 text-[26px] sm:text-[32px] text-ink">
            Tracking Logistik &amp; Pengiriman
          </h1>
          <p className="mt-1 max-w-[680px] t-support text-ink-2">
            Perbarui status 7 tahap pengiriman barang, kelola nomor resi multi-seller, dan pantau checklist internal admin.
          </p>
        </div>

        {onNavigateToBatch && (
          <button
            type="button"
            onClick={onNavigateToBatch}
            className="h-11 px-4 rounded-control bg-primary hover:bg-primary-hover active:scale-[0.99] text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto shrink-0"
          >
            <Package className="w-4 h-4" />
            <span>+ Buat Batch Baru</span>
          </button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`${card} flex flex-col gap-3 p-5`}>
            <div className="flex items-center gap-2">
              <span className={`size-2 shrink-0 rounded-full ${s.dot}`} />
              <p className="t-micro text-ink-2 font-medium">{s.label}</p>
            </div>
            <div>
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="t-h1 text-[28px] text-ink tabular-nums">
                  {s.value}
                </span>
                <span className="t-micro text-ink-3">{s.unit}</span>
              </p>
              <p className="mt-0.5 t-micro text-ink-3">{s.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigasi */}
      <div className="-mb-2 flex gap-1 overflow-x-auto border-b border-divider">
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
              className={`relative flex h-11 shrink-0 items-center gap-2 px-3 t-body-med transition-colors duration-150 cursor-pointer ${
                on ? "text-primary font-semibold" : "text-ink-2 hover:text-ink"
              }`}
            >
              <span>{t.label}</span>
              {t.n !== undefined && (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] f-semi tabular-nums ${
                    on
                      ? "bg-primary text-white"
                      : "bg-[#f4f4f5] text-ink-2"
                  }`}
                >
                  {t.n}
                </span>
              )}
              {on && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Table Section */}
      <section className={`${card} overflow-hidden`}>
        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3 xl:grid-cols-[minmax(260px,1fr)_170px_190px_190px]">
          <div className="flex h-11 items-center gap-2.5 rounded-control border border-border bg-surface px-3.5 text-ink-3 transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:text-primary focus-within:shadow-focus sm:col-span-3 xl:col-span-1">
            <Search className="size-4 shrink-0 text-ink-3" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                reset();
              }}
              placeholder="Cari nomor batch, buyer, resi, barang..."
              className="w-full bg-transparent t-support text-ink outline-none placeholder:text-ink-3"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Hapus pencarian"
                className="text-ink-3 hover:text-ink cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Select
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
          <Select
            value={wh}
            onChange={(v) => {
              setWh(v);
              reset();
            }}
            options={["Semua Warehouse", ...warehouses]}
          />
          <Select
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

        {/* Desktop View (xl+) */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full table-fixed min-w-[900px]">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[24%]" />
              <col className="w-[17%]" />
              <col className="w-[17%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="border-y border-border bg-subpanel">
                <th className={`${th} pl-5`}>Batch &amp; Buyer</th>
                <th className={th}>Barang &amp; Warehouse</th>
                <th className={th}>No. Resi</th>
                <th className={th}>Status Logistik</th>
                <th className={th}>Checklist</th>
                <th className={`${th} pr-5 text-right`}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-divider last:border-b-0 transition-colors duration-150 hover:bg-subpanel"
                >
                  <td className={`${td} pl-5`}>
                    <p className="font-mono text-[13px] text-ink f-bold">
                      {p.batch}
                    </p>
                    <p
                      className="mt-0.5 truncate t-micro text-ink-2 font-medium"
                      title={`${p.buyer} ${p.handle}`}
                    >
                      {p.buyer}
                    </p>
                    <p className="truncate text-[11px] text-ink-3 f-reg">
                      {p.handle}
                    </p>
                  </td>
                  <td className={td}>
                    <p
                      className="truncate t-support text-ink f-med"
                      title={p.item}
                    >
                      {p.item}
                    </p>
                    <p className="mt-0.5 truncate t-micro text-ink-3">
                      {p.warehouse}
                    </p>
                  </td>
                  <td className={td}>
                    <ResiChip resi={p.resi} onCopy={copy} />
                  </td>
                  <td className={td}>
                    <StageBadge s={p.stage} />
                    <p className="mt-1 whitespace-nowrap text-[11px] text-ink-3 f-reg">
                      {p.updated} WIB
                    </p>
                  </td>
                  <td className={td}>
                    <div className="flex gap-1">
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
                  </td>
                  <td className={`${td} pr-5 text-right`}>
                    <button
                      type="button"
                      className={editBtn}
                      onClick={() => setEdit(p)}
                      aria-label={`Edit tracking ${p.batch} ${p.buyer}`}
                    >
                      <Edit3 className="size-3.5" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet View (xl:hidden) */}
        <ul className="grid grid-cols-1 gap-3 border-t border-divider bg-subpanel p-3 sm:p-4 md:grid-cols-2 xl:hidden">
          {visible.map((p) => (
            <li
              key={p.id}
              className="flex flex-col rounded-control border border-divider bg-surface p-4 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[14px] text-ink f-bold">
                    {p.batch}
                  </p>
                  <p className="mt-0.5 t-micro text-ink-3">
                    {p.buyer} {p.handle}
                  </p>
                </div>
                <StageBadge s={p.stage} />
              </div>
              <p className="mt-3 t-body-med text-ink font-semibold">{p.item}</p>
              <p className="mt-0.5 t-micro text-ink-3">
                {p.warehouse} · Update {p.updated} WIB
              </p>
              <div className="mt-3">
                <ResiChip resi={p.resi} onCopy={copy} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-divider pt-3">
                <CheckBadge on={p.co} yes="CO: ✓" no="CO: —" />
                <CheckBadge on={p.album} yes="Album: ✓" no="Album: —" />
                <button
                  type="button"
                  className={`${editBtn} ml-auto`}
                  onClick={() => setEdit(p)}
                >
                  <Edit3 className="size-3.5" /> Update Status
                </button>
              </div>
            </li>
          ))}
        </ul>

        {visible.length === 0 && (
          <div className="border-t border-divider px-5 py-14 text-center">
            <p className="t-body-med text-ink font-semibold">
              Tidak ada paket yang cocok
            </p>
            <p className="mt-1 t-support text-ink-3">
              Coba ubah kata kunci atau filter negara, warehouse, dan status.
            </p>
          </div>
        )}

        {/* Pagination Toolbar */}
        <div className="flex flex-col gap-3 border-t border-divider px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-micro text-ink-3">
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
            <button
              type="button"
              disabled={cur === 1}
              onClick={() => setPage(cur - 1)}
              className="h-9 rounded-control border border-border bg-surface px-3 t-micro text-ink transition-colors duration-150 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
            >
              Sebelumnya
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`size-9 rounded-control t-micro tabular-nums transition-colors duration-150 cursor-pointer ${
                  n === cur
                    ? "bg-primary text-white font-semibold"
                    : "text-ink-2 hover:bg-subpanel"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={cur === pages}
              onClick={() => setPage(cur + 1)}
              className="h-9 rounded-control border border-border bg-surface px-3 t-micro text-ink transition-colors duration-150 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </section>

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
