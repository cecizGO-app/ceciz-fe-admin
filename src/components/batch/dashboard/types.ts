export type BatchStatus = "Open" | "Closed" | "Archived";
export type CountryFilter = "ALL" | "CH" | "KR" | "TH" | "JP" | "INA";

export interface BatchItem {
  id: string;
  batchNumber: string;
  countryCode: "CH" | "KR" | "JP" | "TH" | "INA";
  countryCurrency: string;
  date: string;
  warehouseProxy: string;
  buyerCount: number;
  totalPc: number;
  status: BatchStatus;
  labaAmount: number | null; // null = "Belum dihitung", number = nominal laba
  isHidden: boolean;
}

export interface BatchStats {
  activeBatches: number;
  totalPc: number;
  waitingCalculation: number;
  archivedBatches: number;
}
