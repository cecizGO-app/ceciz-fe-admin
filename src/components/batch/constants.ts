import type { CountryOption, BuyerOption } from './types'
import type { StepItem } from './BatchStepbar'

// Country Configuration (CH, KR, JP, TH, INA)
export const COUNTRIES: CountryOption[] = [
  { code: 'CH', name: 'China', flag: '🇨🇳', currency: 'CNY', defaultRate: 2250 },
  { code: 'KR', name: 'Korea', flag: '🇰🇷', currency: 'KRW', defaultRate: 11.8 },
  { code: 'JP', name: 'Jepang', flag: '🇯🇵', currency: 'JPY', defaultRate: 108 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', currency: 'THB', defaultRate: 450 },
  { code: 'INA', name: 'Indonesia', flag: '🇮🇩', currency: 'IDR', defaultRate: 1 },
]

// Registered Buyers Mock
export const REGISTERED_BUYERS: BuyerOption[] = [
  { id: 'b_01', name: 'Nadia Putri', username: '@nadia' },
  { id: 'b_02', name: 'Raka Mahendra', username: '@raka' },
  { id: 'b_03', name: 'Alya Rahman', username: '@alya' },
  { id: 'b_04', name: 'Dimas Anggara', username: '@dimas' },
  { id: 'b_05', name: 'Siti Rahma', username: '@siti' },
]

// Step definitions for Wizard
export const WIZARD_STEPS: StepItem[] = [
  { id: 1, title: 'Info & Biaya', subtitle: 'Parameter batch' },
  { id: 2, title: 'Pesanan Buyer', subtitle: 'Daftar item & qty' },
  { id: 3, title: 'Ringkasan', subtitle: 'Kalkulasi & rilis' },
]

// Tiered Fee Rekap Calculation (PRD Business Rule #5)
export function calculateFeeRekap(totalPcs: number): { fee: number; tierLabel: string } {
  if (totalPcs <= 0) return { fee: 0, tierLabel: '0 pc' }
  if (totalPcs === 1) return { fee: 2000, tierLabel: 'Tier 1 pc' }
  if (totalPcs <= 5) return { fee: 4000, tierLabel: 'Tier 2-5 pcs' }
  if (totalPcs <= 10) return { fee: 6000, tierLabel: 'Tier 6-10 pcs' }
  if (totalPcs <= 15) return { fee: 8000, tierLabel: 'Tier 11-15 pcs' }
  if (totalPcs <= 20) return { fee: 11000, tierLabel: 'Tier 16-20 pcs' }
  if (totalPcs <= 25) return { fee: 14000, tierLabel: 'Tier 21-25 pcs' }
  if (totalPcs <= 30) return { fee: 17000, tierLabel: 'Tier 26-30 pcs' }
  if (totalPcs <= 35) return { fee: 21000, tierLabel: 'Tier 31-35 pcs' }
  if (totalPcs <= 40) return { fee: 25000, tierLabel: 'Tier 36-40 pcs' }
  if (totalPcs <= 45) return { fee: 29000, tierLabel: 'Tier 41-45 pcs' }
  if (totalPcs <= 50) return { fee: 33000, tierLabel: 'Tier 46-50 pcs' }
  if (totalPcs <= 55) return { fee: 37000, tierLabel: 'Tier 51-55 pcs' }
  return { fee: 41000, tierLabel: 'Tier 56-60 pcs' }
}
