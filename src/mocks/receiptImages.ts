/**
 * Generator gambar bukti transfer ringkas (SVG Data URI)
 * Menampilkan struk digital dengan header bank berwarna tajam (BCA, QRIS, SeaBank, ShopeePay)
 */
export function getReceiptImageUrl(
  bank: string,
  nominal: number,
  name: string,
  refNumber: string
): string {
  const nominalStr = "Rp " + nominal.toLocaleString("id-ID");
  const color =
    bank === "BCA"
      ? "#005DAA"
      : bank === "SeaBank"
        ? "#FF5B00"
        : bank === "QRIS"
          ? "#A21CAF"
          : bank === "ShopeePay"
            ? "#EA580C"
            : "#0284C7";

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 360" width="100%" height="100%" style="font-family:system-ui,-apple-system,sans-serif;">
  <rect width="340" height="360" rx="16" fill="#FFFFFF" stroke="#E4E4E7" stroke-width="2"/>
  <path d="M0 16 Q0 0 16 0 L324 0 Q340 0 340 16 L340 68 L0 68 Z" fill="${color}"/>
  <text x="170" y="32" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${bank.toUpperCase()} TRANSFER</text>
  <text x="170" y="52" font-size="10" fill="#FFFFFF" opacity="0.9" text-anchor="middle">STATUS: TRANSAKSI BERHASIL</text>
  
  <circle cx="170" cy="95" r="16" fill="#10B981"/>
  <path d="M162 95 L168 101 L178 90" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  
  <text x="170" y="130" font-size="11" font-weight="600" fill="#71717A" text-anchor="middle">TOTAL DITRANSFER</text>
  <text x="170" y="158" font-size="22" font-weight="800" fill="#18181B" text-anchor="middle">${nominalStr}</text>
  
  <line x1="20" y1="178" x2="320" y2="178" stroke="#F4F4F5" stroke-width="2" stroke-dasharray="4 4"/>
  
  <text x="24" y="206" font-size="11" fill="#71717A">Pengirim</text>
  <text x="316" y="206" font-size="11" font-weight="bold" fill="#18181B" text-anchor="end">${name}</text>
  
  <text x="24" y="234" font-size="11" fill="#71717A">Penerima</text>
  <text x="316" y="234" font-size="11" font-weight="bold" fill="#18181B" text-anchor="end">Ceciz GO Admin</text>
  
  <text x="24" y="262" font-size="11" fill="#71717A">No. Referensi</text>
  <text x="316" y="262" font-size="11" font-weight="bold" fill="${color}" font-family="monospace" text-anchor="end">${refNumber}</text>
  
  <text x="24" y="290" font-size="11" fill="#71717A">Waktu</text>
  <text x="316" y="290" font-size="11" font-weight="bold" fill="#18181B" text-anchor="end">17 Sep 2026, 08:40 WIB</text>
  
  <rect x="20" y="312" width="300" height="30" rx="8" fill="#F4F5F7"/>
  <text x="170" y="331" font-size="10" font-weight="600" fill="#71717A" text-anchor="middle">STRUK TRANSFER ASLI TERVERIFIKASI</text>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
