export type CountryCode = 'CH' | 'KR' | 'JP' | 'TH' | 'INA'

export interface CountryOption {
  code: CountryCode
  name: string
  flag: string
  currency: string
  defaultRate: number
}

export interface BuyerOption {
  id: string
  name: string
  username: string
}

export interface OrderRow {
  id: string
  buyerId: string
  itemName: string
  qty: number
  hargaAsli: number
  hargaJualPerBuyer?: number // Khusus JP: diisi manual oleh admin sesuai PRD B §7.3
}

export interface CalculationSummary {
  totalQty: number
  totalBuyer: number
  totalHargaAsliValas: number
  konversiIDR: number
  shippingLuarNegeriIDR: number
  feeWHProxyTotal: number
  feeGO: number
  feeRekap: number
  tierLabel: string
  totalModalBatch: number
  totalTagihanBuyer: number
  estimasiLabaBersih: number
  isJapan: boolean
  jpHargaJualTotal: number
  allJpHargaJualFilled: boolean
  unfilledJpBuyersCount: number
}
