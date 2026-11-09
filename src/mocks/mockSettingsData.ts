import type { AppSettings } from "@/types/settings";

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
    defaultFeePerPc: 10000,
  },
  dailyRates: {
    yuan: 2350,
    won: 12.4,
    baht: 475,
    yen: 108,
  },
  feeRekap: {
    tier1_1_10: 15000,
    tier2_11_25: 25000,
    tier3_26_plus: 40000,
  },
  penaltyRules: {
    amountPerDay: 5000,
    batchDeadlineDays: 7,
    taxDeadlineDays: 5,
  },
  taxRate: {
    chPcTax: 18000,
    krPcTax: 20000,
    thPcTax: 16000,
    jpPcTax: 22000,
    nonPcPerKg: 85000,
  },
  storage: {
    maxDurationDays: 30,
  },
};
