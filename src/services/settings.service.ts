import { DEFAULT_SETTINGS } from "@/mocks/mockSettingsData";
import {
  DEFAULT_PRD_FEE_REKAP_TIERS,
  type FeeRekapTier,
} from "@/lib/calculations/fee-rekap";
import type { AppSettings } from "@/types/settings";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

const STORAGE_KEY = "ceciz_admin_settings_v2";

function toDateOnly(val: unknown, fallback: string): string {
  if (!val) return fallback;
  const s = String(val);
  return s.includes("T") ? s.split("T")[0] : s;
}

function isLegacyDummyThreeTiers(tiers: FeeRekapTier[]): boolean {
  return (
    tiers.length === 3 &&
    tiers[0]?.min_pcs === 1 &&
    tiers[0]?.max_pcs === 10 &&
    Number(tiers[0]?.fee) === 15000 &&
    Number(tiers[1]?.fee) === 25000 &&
    Number(tiers[2]?.fee) === 40000
  );
}

function normalizeFeeRekapTiers(rawTiers: unknown): FeeRekapTier[] {
  if (!Array.isArray(rawTiers) || rawTiers.length === 0) {
    return DEFAULT_PRD_FEE_REKAP_TIERS.map((t) => ({ ...t }));
  }
  const parsed: FeeRekapTier[] = rawTiers
    .filter((t) => t && typeof t === "object")
    .map((t) => {
      const obj = t as Record<string, unknown>;
      const min = Number(obj.min_pcs ?? 1);
      const max =
        obj.max_pcs === null || obj.max_pcs === undefined
          ? null
          : Number(obj.max_pcs);
      const fee = Number(obj.fee ?? 0);
      const label =
        typeof obj.label === "string" && obj.label.trim()
          ? obj.label.trim()
          : max === null
            ? `${min}+ pcs`
            : min === max
              ? `${min} pc`
              : `${min}-${max} pcs`;
      return { min_pcs: min, max_pcs: max, fee, label };
    });

  if (parsed.length === 0 || isLegacyDummyThreeTiers(parsed)) {
    return DEFAULT_PRD_FEE_REKAP_TIERS.map((t) => ({ ...t }));
  }
  return parsed;
}

function mapBackendToAppSettings(raw: Record<string, unknown>, base: AppSettings): AppSettings {
  const dailyRate = (raw.dailyRate as Record<string, number> | undefined) || {};
  const normalizedTiers = normalizeFeeRekapTiers(raw.feeRekapTiers);

  return {
    checkoutLinks: {
      googleFormUrl: String(raw.googleFormUrl ?? base.checkoutLinks.googleFormUrl),
      shopeeCheckoutUrl: String(raw.shopeeCheckoutUrl ?? base.checkoutLinks.shopeeCheckoutUrl),
      startDate: toDateOnly(raw.checkoutStartDate, base.checkoutLinks.startDate),
      endDate: toDateOnly(raw.checkoutEndDate, base.checkoutLinks.endDate),
      isGoogleFormOpen:
        typeof raw.googleFormOpen === "boolean"
          ? raw.googleFormOpen
          : base.checkoutLinks.isGoogleFormOpen,
      isShopeeOpen:
        typeof raw.shopeeOpen === "boolean" ? raw.shopeeOpen : base.checkoutLinks.isShopeeOpen,
    },
    feeNyelem: {
      defaultFeePerPc: Number(raw.defaultFeeNyelem ?? base.feeNyelem.defaultFeePerPc),
    },
    dailyRates: {
      yuan: Number(dailyRate.CH ?? dailyRate.yuan ?? base.dailyRates.yuan),
      won: Number(dailyRate.KR ?? dailyRate.won ?? base.dailyRates.won),
      baht: Number(dailyRate.TH ?? dailyRate.baht ?? base.dailyRates.baht),
      yen: Number(dailyRate.JP ?? dailyRate.yen ?? base.dailyRates.yen),
    },
    feeRekap: {
      tiers: normalizedTiers,
    },
    penaltyRules: {
      amountPerDay: Number(raw.penaltyPerDay ?? base.penaltyRules.amountPerDay),
      batchDeadlineDays: raw.deadlineBatchHours
        ? Math.max(1, Math.round(Number(raw.deadlineBatchHours) / 24))
        : base.penaltyRules.batchDeadlineDays,
      taxDeadlineDays: raw.deadlineTaxHours
        ? Math.max(1, Math.round(Number(raw.deadlineTaxHours) / 24))
        : base.penaltyRules.taxDeadlineDays,
    },
    taxRate: {
      chPcTax: Number(raw.taxRatePcChThJp ?? base.taxRate.chPcTax),
      krPcTax: Number(raw.taxRatePcKr ?? base.taxRate.krPcTax),
      thPcTax: Number(raw.taxRatePcChThJp ?? base.taxRate.thPcTax),
      jpPcTax: Number(raw.taxRatePcChThJp ?? base.taxRate.jpPcTax),
      nonPcPerKg: Number(raw.taxRateNonPcPerGram ?? base.taxRate.nonPcPerKg),
    },
    storage: {
      maxDurationDays: Number(raw.maxStorageDays ?? base.storage.maxDurationDays),
    },
  };
}

function mapSectionToBackendPayload<K extends keyof AppSettings>(
  section: K,
  data: AppSettings[K],
  prevSettings?: AppSettings,
): Record<string, unknown> {
  if (section === "checkoutLinks") {
    const d = data as AppSettings["checkoutLinks"];
    return {
      googleFormUrl: d.googleFormUrl,
      shopeeCheckoutUrl: d.shopeeCheckoutUrl,
      checkoutStartDate: d.startDate || null,
      checkoutEndDate: d.endDate || null,
      googleFormOpen: d.isGoogleFormOpen,
      shopeeOpen: d.isShopeeOpen,
    };
  }
  if (section === "feeNyelem") {
    const d = data as AppSettings["feeNyelem"];
    return { defaultFeeNyelem: d.defaultFeePerPc };
  }
  if (section === "dailyRates") {
    const d = data as AppSettings["dailyRates"];
    return {
      dailyRate: { CH: d.yuan, KR: d.won, TH: d.baht, JP: d.yen },
    };
  }
  if (section === "feeRekap") {
    const d = data as AppSettings["feeRekap"];
    return {
      feeRekapTiers: d.tiers.map((t) => ({
        min_pcs: t.min_pcs,
        max_pcs: t.max_pcs,
        fee: Number(t.fee) || 0,
        label: t.label,
      })),
    };
  }
  if (section === "penaltyRules") {
    const d = data as AppSettings["penaltyRules"];
    return {
      penaltyPerDay: d.amountPerDay,
      deadlineBatchHours: d.batchDeadlineDays * 24,
      deadlineTaxHours: d.taxDeadlineDays * 24,
    };
  }
  if (section === "taxRate") {
    const d = data as AppSettings["taxRate"];
    const prev = prevSettings?.taxRate;
    const sharedChThJp =
      prev && d.thPcTax !== prev.thPcTax && d.chPcTax === prev.chPcTax
        ? d.thPcTax
        : prev && d.jpPcTax !== prev.jpPcTax && d.chPcTax === prev.chPcTax
          ? d.jpPcTax
          : d.chPcTax;
    return {
      taxRatePcChThJp: sharedChThJp,
      taxRatePcKr: d.krPcTax,
      taxRateNonPcPerGram: d.nonPcPerKg,
    };
  }
  if (section === "storage") {
    const d = data as AppSettings["storage"];
    return { maxStorageDays: d.maxDurationDays };
  }
  return {};
}

class SettingsService {
  private settings: AppSettings;

  constructor() {
    this.settings = this.loadInitialSettings();
  }

  private loadInitialSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback if localStorage is disabled or corrupted
    }
    return { ...DEFAULT_SETTINGS };
  }

  private persistLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Ignore
    }
  }

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  async fetchSettingsApi(): Promise<AppSettings> {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/admin/settings`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const raw = json?.data || json;
      if (raw && typeof raw === "object") {
        this.settings = mapBackendToAppSettings(raw, this.settings);
        this.persistLocal();
      }
    } catch {
      // Fallback ke cache lokal
    }
    return { ...this.settings };
  }

  updateSettings(patch: Partial<AppSettings>): AppSettings {
    this.settings = {
      ...this.settings,
      ...patch,
    };
    this.persistLocal();
    return { ...this.settings };
  }

  async updateSectionAsync<K extends keyof AppSettings>(
    section: K,
    data: AppSettings[K],
  ): Promise<AppSettings> {
    const prevSettings = this.settings;
    this.settings = {
      ...this.settings,
      [section]: data,
    };
    this.persistLocal();

    try {
      const payload = mapSectionToBackendPayload(section, data, prevSettings);
      const res = await fetch(`${BASE_URL}/api/v1/admin/settings`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        const raw = json?.data || json;
        if (raw && typeof raw === "object") {
          this.settings = mapBackendToAppSettings(raw, this.settings);
          this.persistLocal();
        }
      }
    } catch {
      // Tetap tersimpan di localStorage jika offline
    }

    return { ...this.settings };
  }

  updateSection<K extends keyof AppSettings>(
    section: K,
    data: AppSettings[K],
  ): AppSettings {
    void this.updateSectionAsync(section, data);
    return { ...this.settings };
  }

  async resetToDefaultAsync(): Promise<AppSettings> {
    this.settings = { ...DEFAULT_SETTINGS };
    try {
      localStorage.removeItem(STORAGE_KEY);
      const res = await fetch(`${BASE_URL}/api/v1/admin/settings/reset`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const json = await res.json();
        const raw = json?.data || json;
        if (raw && typeof raw === "object") {
          this.settings = mapBackendToAppSettings(raw, DEFAULT_SETTINGS);
          this.persistLocal();
        }
      }
    } catch {
      // Ignore
    }
    return { ...this.settings };
  }

  resetToDefault(): AppSettings {
    void this.resetToDefaultAsync();
    return { ...DEFAULT_SETTINGS };
  }
}

export const settingsService = new SettingsService();
export default settingsService;
