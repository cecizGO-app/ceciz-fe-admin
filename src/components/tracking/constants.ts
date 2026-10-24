import type { Stage } from "@/types/tracking";

export const STAGE_TONE: Record<Stage, string> = {
  PO: "bg-sky-50 text-sky-700 border-sky-200",
  "On Seller Hand": "bg-amber-50 text-amber-700 border-amber-200",
  "Arrived WH Luar": "bg-purple-50 text-purple-700 border-purple-200",
  "OTW INA": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Arrived WH INA": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Bisa di CO": "bg-orange-50 text-orange-700 border-orange-200",
  Done: "bg-slate-100 text-slate-700 border-slate-200",
};

export const COUNTRY_FLAGS: Record<string, string> = {
  CH: "🇨🇳",
  KR: "🇰🇷",
  JP: "🇯🇵",
  TH: "🇹🇭",
  INA: "🇮🇩",
};
