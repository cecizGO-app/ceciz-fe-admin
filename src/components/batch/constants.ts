import type { CountryOption, BuyerOption } from "@/types/batch";
import type { StepItem } from './BatchStepbar'

// Country Configuration (CH, KR, JP, TH, INA)
export const COUNTRIES: CountryOption[] = [
  { code: 'CH', name: 'China', flag: '🇨🇳', currency: 'CNY', defaultRate: 2250, defaultRateSeller: 2200 },
  { code: 'KR', name: 'Korea', flag: '🇰🇷', currency: 'KRW', defaultRate: 11.8, defaultRateSeller: 11.4 },
  { code: 'JP', name: 'Jepang', flag: '🇯🇵', currency: 'JPY', defaultRate: 108, defaultRateSeller: 104 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', currency: 'THB', defaultRate: 450, defaultRateSeller: 435 },
  { code: 'INA', name: 'Indonesia', flag: '🇮🇩', currency: 'IDR', defaultRate: 1, defaultRateSeller: 1 },
]

// Registered Buyers Mock
export const REGISTERED_BUYERS: BuyerOption[] = [
  { id: 'b_01', name: 'Nadia Putri', username: '@b_01' },
  { id: 'b_02', name: 'Raka Mahendra', username: '@b_02' },
  { id: 'b_03', name: 'Alya Rahman', username: '@b_03' },
  { id: 'b_04', name: 'Dimas Anggara', username: '@b_04' },
  { id: 'b_05', name: 'Siti Rahma', username: '@b_05' },
]

// Step definitions for Wizard
export const WIZARD_STEPS: StepItem[] = [
  { id: 1, title: 'Info & Biaya', subtitle: 'Parameter batch' },
  { id: 2, title: 'Pesanan Buyer', subtitle: 'Daftar item & qty' },
  { id: 3, title: 'Ringkasan', subtitle: 'Kalkulasi & rilis' },
]

