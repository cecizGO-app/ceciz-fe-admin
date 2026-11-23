import type { AppSettings } from "@/types/settings";
import { DEFAULT_PRD_FEE_REKAP_TIERS } from "@/lib/calculations/fee-rekap";

export const DEFAULT_SETTINGS: AppSettings = {
  checkoutLinks: {
    googleFormUrl: "https://forms.gle/",
    shopeeCheckoutUrl: "https://shopee.co.id/",
    startDate: "2026-10-12",
    endDate: "2026-10-18",
    isGoogleFormOpen: false,
    isShopeeOpen: false,
  },
  feeNyelem: {
    defaultFeePerPc: 2000,
  },
  dailyRates: {
    yuan: 2250,
    won: 11.8,
    baht: 450,
    yen: 108,
  },
  feeRekap: {
    tiers: DEFAULT_PRD_FEE_REKAP_TIERS.map((t) => ({ ...t })),
  },
  penaltyRules: {
    amountPerDay: 2000,
    batchDeadlineDays: 1,
    taxDeadlineDays: 3,
  },
  taxRate: {
    chPcTax: 7000,
    krPcTax: 6000,
    thPcTax: 7000,
    jpPcTax: 7000,
    nonPcPerKg: 85000,
  },
  storage: {
    maxDurationDays: 60,
  },
};
