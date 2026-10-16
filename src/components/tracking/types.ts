export type TrackingStage =
  | 'PO'
  | 'ON_SELLER_HAND'
  | 'ARRIVED_WH_LUAR'
  | 'OTW_INA'
  | 'ARRIVED_WH_INA'
  | 'BISA_DI_CO'
  | 'DONE'

export interface TrackingStageConfig {
  value: TrackingStage
  label: string
  shortLabel: string
  stepNumber: number
  badgeColor: string
  textColor: string
  borderColor: string
  dotColor: string
  description: string
}

export const TRACKING_STAGES: Record<TrackingStage, TrackingStageConfig> = {
  PO: {
    value: 'PO',
    label: '1. PO (Pesanan Ditempatkan)',
    shortLabel: 'PO',
    stepNumber: 1,
    badgeColor: 'bg-zinc-100',
    textColor: 'text-zinc-700',
    borderColor: 'border-zinc-200',
    dotColor: 'bg-zinc-500',
    description: 'Pesanan sudah ditempatkan ke seller',
  },
  ON_SELLER_HAND: {
    value: 'ON_SELLER_HAND',
    label: '2. On Seller Hand',
    shortLabel: 'On Seller Hand',
    stepNumber: 2,
    badgeColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
    description: 'Barang di seller, menunggu kirim ke WH',
  },
  ARRIVED_WH_LUAR: {
    value: 'ARRIVED_WH_LUAR',
    label: '3. Arrived WH Luar',
    shortLabel: 'Arrived WH Luar',
    stepNumber: 3,
    badgeColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
    description: 'Barang sudah tiba di warehouse luar negeri',
  },
  OTW_INA: {
    value: 'OTW_INA',
    label: '4. OTW INA',
    shortLabel: 'OTW INA',
    stepNumber: 4,
    badgeColor: 'bg-purple-50',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
    dotColor: 'bg-purple-500',
    description: 'Barang dalam penerbangan/pelayaran ke Indo',
  },
  ARRIVED_WH_INA: {
    value: 'ARRIVED_WH_INA',
    label: '5. Arrived WH INA',
    shortLabel: 'Arrived WH INA',
    stepNumber: 5,
    badgeColor: 'bg-indigo-50',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-200',
    dotColor: 'bg-indigo-500',
    description: 'Barang sudah tiba di warehouse Indonesia',
  },
  BISA_DI_CO: {
    value: 'BISA_DI_CO',
    label: '6. Bisa di CO (Shopee)',
    shortLabel: 'Bisa di CO',
    stepNumber: 6,
    badgeColor: 'bg-orange-50',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
    dotColor: 'bg-orange-500',
    description: 'Siap di-checkout di Shopee oleh buyer',
  },
  DONE: {
    value: 'DONE',
    label: '7. Done (Selesai/Arsip)',
    shortLabel: 'Done',
    stepNumber: 7,
    badgeColor: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    dotColor: 'bg-emerald-600',
    description: 'Proses selesai & otomatis masuk arsip',
  },
}

export interface TrackingItem {
  id: string
  batchId: string
  batchCode: string
  batchName: string
  countryCode: 'CH' | 'KR' | 'JP' | 'TH' | 'INA'
  warehouseName: string
  itemName: string
  buyerName: string
  buyerUsername: string
  qty: number
  status: TrackingStage
  resiNumbers: string[]
  checkedOut: boolean // Checklist monitoring terpisah PRD B §6.4
  isArchived: boolean // PRD B §6.4 Task 6.0
  updatedAt: string
}
