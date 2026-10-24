/**
 * Tiered Fee Rekap Calculation Engine
 * Acuan Resmi: PRD Group B v1.4 §4 Rule #5 (Fee Rekap Tiered Basis Per-Batch)
 *
 * Tiering berdasarkan total pcs dalam satu batch:
 * - 1 item: Rp2.000 (Tier 1 pc)
 * - 2-5 item: Rp4.000
 * - 6-10 item: Rp6.000
 * - 11-15 item: Rp8.000
 * - 16-20 item: Rp11.000
 * - 21-25 item: Rp14.000
 * - 26-30 item: Rp17.000
 * - 31-35 item: Rp21.000
 * - 36-40 item: Rp25.000
 * - 41-45 item: Rp29.000
 * - 46-50 item: Rp33.000
 * - 51-55 item: Rp37.000
 * - 56-60 item: Rp41.000
 */
export function calculateFeeRekap(totalPcs: number): {
  fee: number;
  tierLabel: string;
} {
  if (totalPcs <= 0) return { fee: 0, tierLabel: "0 pc" };
  if (totalPcs === 1) return { fee: 2000, tierLabel: "Tier 1 pc" };
  if (totalPcs <= 5) return { fee: 4000, tierLabel: "Tier 2-5 pcs" };
  if (totalPcs <= 10) return { fee: 6000, tierLabel: "Tier 6-10 pcs" };
  if (totalPcs <= 15) return { fee: 8000, tierLabel: "Tier 11-15 pcs" };
  if (totalPcs <= 20) return { fee: 11000, tierLabel: "Tier 16-20 pcs" };
  if (totalPcs <= 25) return { fee: 14000, tierLabel: "Tier 21-25 pcs" };
  if (totalPcs <= 30) return { fee: 17000, tierLabel: "Tier 26-30 pcs" };
  if (totalPcs <= 35) return { fee: 21000, tierLabel: "Tier 31-35 pcs" };
  if (totalPcs <= 40) return { fee: 25000, tierLabel: "Tier 36-40 pcs" };
  if (totalPcs <= 45) return { fee: 29000, tierLabel: "Tier 41-45 pcs" };
  if (totalPcs <= 50) return { fee: 33000, tierLabel: "Tier 46-50 pcs" };
  if (totalPcs <= 55) return { fee: 37000, tierLabel: "Tier 51-55 pcs" };
  return { fee: 41000, tierLabel: "Tier 56-60 pcs" };
}
