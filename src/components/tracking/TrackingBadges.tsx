import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Stage } from "@/types/tracking";
import { STAGE_TONE } from "./constants";

export function StageBadge({ s }: { s: Stage }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 gap-1.5 px-2.5 text-[11px] font-semibold whitespace-nowrap rounded-full border shadow-2xs",
        STAGE_TONE[s]
      )}
    >

      <span className="size-1.5 rounded-full bg-current" />
      {s}
    </Badge>
  );
}

export function CheckBadge({ on, yes, no }: { on: boolean; yes: string; no: string }) {
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

export function MiniCheck({
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

export function ResiChip({
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

export function SwitchToggle({
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

export function TrackingSelect({
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
