export type BatchStatus = "Open" | "Closed" | "Archived";
export type CountryFilter = "ALL" | "CH" | "KR" | "TH" | "JP" | "INA";
import type { CountryCode } from "./common";
export type { CountryCode };

export interface BatchItem {
  id: string;
  batchNumber: string;
  countryCode: CountryCode;
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

export interface CountryOption {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  defaultRate: number;
}

export interface BuyerOption {
  id: string;
  name: string;
  username: string;
}

export interface OrderRow {
  id: string;
  buyerId: string;
  itemName: string;
  qty: number; // Konstan 1 per pcs
  hargaAsli: number;
  feeNyelem?: number; // Per row / pc
  hargaBersih?: number; // Computed harga bersih per row
  hargaJualPerBuyer?: number; // Khusus JP: diisi manual oleh admin sesuai PRD B §7.3
}

export interface CalculationSummary {
  totalQty: number;
  totalBuyer: number;
  totalHargaAsliValas: number;
  konversiIDR: number;
  shippingLuarNegeriIDR: number;
  feeWHProxyTotal: number;
  feeGO: number;
  feeRekap: number;
  feeKeseluruhan: number; // fee wh + fee co/tf + fee go + fee rekap
  feeNyelemTotal: number;
  tierLabel: string;
  subtotalTfSeller: number; // ((Harga + shiploc) * rate + fee wh + fee co/tf)
  totalModalBatch: number;
  totalTagihanBuyer: number; // Harga total (pemasukan buyer)
  selisihHarga: number; // Harga total - subtotal tf seller
  estimasiLabaBersih: number;
  isJapan: boolean;
  isKorea: boolean;
  isIndonesia: boolean;
  jpHargaJualTotal: number;
  allJpHargaJualFilled: boolean;
  unfilledJpBuyersCount: number;
  hargaCOShopeeSeller?: number;
  totalPendapatanINA?: number;
}
