/**
 * Tiered Fee Rekap Calculation Engine
 * Acuan Resmi: PRD Group B v1.4/v1.5 §4 Rule #5 & detailing-logic.pdf hal. 8
 */
export interface FeeRekapTier {
  min_pcs: number;
  max_pcs: number | null;
  fee: number;
  label: string;
}

export const DEFAULT_PRD_FEE_REKAP_TIERS: FeeRekapTier[] = [
  { min_pcs: 1, max_pcs: 1, fee: 2000, label: "1 pc" },
  { min_pcs: 2, max_pcs: 5, fee: 4000, label: "2-5 pcs" },
  { min_pcs: 6, max_pcs: 10, fee: 6000, label: "6-10 pcs" },
  { min_pcs: 11, max_pcs: 15, fee: 8000, label: "11-15 pcs" },
  { min_pcs: 16, max_pcs: 20, fee: 11000, label: "16-20 pcs" },
  { min_pcs: 21, max_pcs: 25, fee: 14000, label: "21-25 pcs" },
  { min_pcs: 26, max_pcs: 30, fee: 17000, label: "26-30 pcs" },
  { min_pcs: 31, max_pcs: 35, fee: 21000, label: "31-35 pcs" },
  { min_pcs: 36, max_pcs: 40, fee: 25000, label: "36-40 pcs" },
  { min_pcs: 41, max_pcs: 45, fee: 29000, label: "41-45 pcs" },
  { min_pcs: 46, max_pcs: 50, fee: 33000, label: "46-50 pcs" },
  { min_pcs: 51, max_pcs: 55, fee: 37000, label: "51-55 pcs" },
  { min_pcs: 56, max_pcs: 60, fee: 41000, label: "56-60 pcs" },
];

export function calculateFeeRekap(
  totalPcs: number,
  customTiers?: FeeRekapTier[],
): {
  fee: number;
  tierLabel: string;
} {
  if (totalPcs <= 0) return { fee: 0, tierLabel: "0 pc" };

  const tiers =
    Array.isArray(customTiers) && customTiers.length > 0
      ? customTiers
      : DEFAULT_PRD_FEE_REKAP_TIERS;

  const matched = tiers.find(
    (t) =>
      totalPcs >= t.min_pcs &&
      (t.max_pcs === null || t.max_pcs === undefined || totalPcs <= t.max_pcs),
  );
  if (matched) {
    const label = matched.label.toLowerCase().startsWith("tier")
      ? matched.label
      : `Tier ${matched.label}`;
    return { fee: Number(matched.fee) || 0, tierLabel: label };
  }

  const lastTier = tiers[tiers.length - 1];
  if (lastTier) {
    const maxPcs = lastTier.max_pcs ?? 60;
    const extraBlocks = Math.max(0, Math.ceil((totalPcs - maxPcs) / 5));
    return {
      fee: (Number(lastTier.fee) || 41000) + extraBlocks * 4000,
      tierLabel: `Tier >${maxPcs} pcs`,
    };
  }

  return { fee: 41000, tierLabel: "Tier 56-60 pcs" };
}
