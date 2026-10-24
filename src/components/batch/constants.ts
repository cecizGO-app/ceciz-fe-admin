import type { CountryOption, BuyerOption } from "@/types/batch";
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

