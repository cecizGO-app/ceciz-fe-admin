/**
 * Format number to Indonesian Rupiah representation: "Rp 84.250.000"
 */
export function formatRupiah(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat("id-ID").format(absAmount);
  return isNegative ? `-Rp ${formatted}` : `Rp ${formatted}`;
}

/**
 * Format compact number for chart tooltips or small badges: "Rp 84.2M" or "Rp 328K"
 */
export function formatCompactRupiah(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}rb`;
  }
  return `Rp ${amount}`;
}

