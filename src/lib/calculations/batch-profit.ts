/**
 * Calculation Engine: Batch Internal Profit Calculation (PRD B v1.4 §4 Rule #10)
 *
 * Rumus Resmi PRD:
 * 1. Selisih Harga = Total Harga Jual - Harga TF Seller
 * 2. Selisih Tax   = Tagihan PC - (Tagihan Freebies + Harga CO Shopee + Tagihan WH)
 * 3. Laba Kotor    = Selisih Tax + Selisih Harga
 * 4. Laba Bersih   = Laba Kotor - Fee Rekap - Fee Nyelem
 */

export interface BatchProfitInput {
  totalHargaJual: number;
  hargaTFSeller: number;
  tagihanPC: number;
  tagihanFreebies: number;
  hargaCOShopee: number;
  hargaTagihanWH: number;
  feeNyelem: number;
  feeRekap: number;
}

export interface BatchProfitResult {
  selisihHarga: number;
  selisihTax: number;
  labaKotor: number;
  labaBersih: number;
}

export function calculateBatchProfit(input: BatchProfitInput): BatchProfitResult {
  const totalHargaJual = Number(input.totalHargaJual) || 0;
  const hargaTFSeller = Number(input.hargaTFSeller) || 0;
  const tagihanPC = Number(input.tagihanPC) || 0;
  const tagihanFreebies = Number(input.tagihanFreebies) || 0;
  const hargaCOShopee = Number(input.hargaCOShopee) || 0;
  const hargaTagihanWH = Number(input.hargaTagihanWH) || 0;
  const feeNyelem = Number(input.feeNyelem) || 0;
  const feeRekap = Number(input.feeRekap) || 0;

  // 1. Selisih Harga
  const selisihHarga = totalHargaJual - hargaTFSeller;

  // 2. Selisih Tax = Tagihan PC - (Tagihan Freebies + Harga CO Shopee + Tagihan WH)
  const taxExpenses = tagihanFreebies + hargaCOShopee + hargaTagihanWH;
  const selisihTax = tagihanPC - taxExpenses;

  // 3. Laba Kotor = Selisih Tax + Selisih Harga
  const labaKotor = selisihTax + selisihHarga;

  // 4. Laba Bersih = Laba Kotor - Fee Nyelem - Fee Rekap
  const labaBersih = labaKotor - feeNyelem - feeRekap;

  return {
    selisihHarga,
    selisihTax,
    labaKotor,
    labaBersih,
  };
}
