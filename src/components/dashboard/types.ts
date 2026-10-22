export type CountryCode = "CH" | "KR" | "JP" | "TH" | "INA";

export interface ExchangeRates {
  yuan: string;
  won: string;
  baht: string;
  yen: string;
  checkedTime: string;
}

export interface RecentBatch {
  id: string;
  batchNumber: string;
  countryCode: CountryCode;
  countryName: string;
  date: string;
  buyerCount: number;
  totalAmount: string;
  status: "Open" | "Closed";
}

export interface CountryDistribution {
  code: CountryCode;
  name: string;
  count: number;
  percentage: number;
}

export interface TeamActivityItem {
  id: string;
  title: string;
  subtitle: string;
  iconType: "check" | "truck" | "package" | "receipt";
}

export interface PaymentReviewStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface DashboardMetricStats {
  activeBatches: number;
  activeBatchesDiff: string;
  pendingVerifications: number;
  pendingVerificationsDiff: string;
  overduePenaltyBuyers: number;
  activeTrackingPackages: number;
  arrivedWarehousePackages: number;
  pendingTaxAmount: string;
  pendingTaxInvoicesCount: number;
  taxPeriodCutoff: string;
}
