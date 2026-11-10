export interface BuyerCheckoutLinks {
  googleFormUrl: string;
  shopeeCheckoutUrl: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isGoogleFormOpen: boolean;
  isShopeeOpen: boolean;
}

export interface FeeNyelemSettings {
  defaultFeePerPc: number;
}

export interface DailyRatesSettings {
  yuan: number;
  won: number;
  baht: number;
  yen: number;
}

export interface FeeRekapSettings {
  tier1_1_10: number; // Tier 1 · 1-10 PC
  tier2_11_25: number; // Tier 2 · 11-25 PC
  tier3_26_plus: number; // Tier 3 · 26+ PC
}

export interface PenaltyRulesSettings {
  amountPerDay: number;
  batchDeadlineDays: number;
  taxDeadlineDays: number;
}

export interface TaxRateSettings {
  chPcTax: number;
  krPcTax: number;
  thPcTax: number;
  jpPcTax: number;
  nonPcPerKg: number;
}

export interface StorageSettings {
  maxDurationDays: number;
}

export interface AppSettings {
  checkoutLinks: BuyerCheckoutLinks;
  feeNyelem: FeeNyelemSettings;
  dailyRates: DailyRatesSettings;
  feeRekap: FeeRekapSettings;
  penaltyRules: PenaltyRulesSettings;
  taxRate: TaxRateSettings;
  storage: StorageSettings;
}

