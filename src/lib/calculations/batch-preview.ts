import type { CountryCode, OrderRow, CalculationSummary } from "@/types/batch";
import { calculateFeeRekap } from "./fee-rekap";

export interface BatchPreviewInput {
  countryCode: CountryCode;
  orderRows: OrderRow[];
  kursRate: number;
  shippingWHForeign: number;
  feeWarehouse: number;
  feeProxy: number;
  feeGO: number;
  feeNyelem: number;
}

export interface BatchPreviewResult {
  summary: CalculationSummary;
  overheadPerPc: number;
}

/**
 * Calculation Engine: 5 Negara Real-time Preview (PRD B v1.4 §4)
 * Pure TypeScript functions untuk preview reaktif (< 1 detik).
 */
export function calculateBatchPreview(input: BatchPreviewInput): BatchPreviewResult {
  const {
    countryCode,
    orderRows,
    kursRate,
    shippingWHForeign,
    feeWarehouse,
    feeProxy,
    feeGO,
    feeNyelem,
  } = input;

  const isJapan = countryCode === "JP";
  const isKorea = countryCode === "KR";
  const isIndonesia = countryCode === "INA";

  const totalQty = orderRows.reduce(
    (sum, r) => sum + (Number(r.qty) || 0),
    0,
  );
  const uniqueBuyers = new Set(orderRows.map((r) => r.buyerId)).size;

  // 1. Total Harga Asli Valas
  // Untuk KR: Input harga Won dibagi 10.000 (misal input 0.2 = 2.000 won)
  // Untuk INA: Tidak ada valas, nominal dalam IDR
  const totalHargaAsliValas = orderRows.reduce((sum, r) => {
    const qty = Number(r.qty) || 0;
    const harga = Number(r.hargaAsli) || 0;
    return sum + qty * harga;
  }, 0);

  // 2. Konversi ke IDR
  let konversiIDR: number;
  let shippingLuarNegeriIDR: number;
  let feeWHProxyTotal: number;

  if (isIndonesia) {
    // INA: Tanpa kurs valas, tanpa shipping WH luar negeri, tanpa fee proxy luar
    konversiIDR = totalHargaAsliValas;
    shippingLuarNegeriIDR = 0;
    feeWHProxyTotal = 0;
  } else if (isKorea) {
    // KR: Harga asli dikalikan 10.000 sebelum dikalikan rate harian
    konversiIDR = totalHargaAsliValas * 10000 * kursRate;
    shippingLuarNegeriIDR = (Number(shippingWHForeign) || 0) * 10000 * kursRate;
    feeWHProxyTotal = (Number(feeWarehouse) || 0) + (Number(feeProxy) || 0);
  } else {
    // CH, TH, JP: Konversi standar
    konversiIDR = totalHargaAsliValas * kursRate;
    shippingLuarNegeriIDR = (Number(shippingWHForeign) || 0) * kursRate;
    feeWHProxyTotal = (Number(feeWarehouse) || 0) + (Number(feeProxy) || 0);
  }

  // 3. Fee Rekap Tiered (berdasarkan total pcs dalam batch)
  const { fee: feeRekap, tierLabel } = calculateFeeRekap(totalQty);

  // 4. Total Modal Batch (Harga barang + shiploc/shipping + fee WH/Proxy)
  const totalModalBatch = konversiIDR + shippingLuarNegeriIDR + feeWHProxyTotal;

  // 5. Khusus JP: Perhitungan harga jual manual per buyer
  const jpHargaJualTotal = orderRows.reduce(
    (sum, r) => sum + (Number(r.qty) || 0) * (Number(r.hargaJualPerBuyer) || 0),
    0,
  );
  const allJpHargaJualFilled =
    orderRows.length > 0 &&
    orderRows.every((r) => (Number(r.hargaJualPerBuyer) || 0) > 0);
  const unfilledJpBuyersCount = orderRows.filter(
    (r) => !(Number(r.hargaJualPerBuyer) > 0),
  ).length;

  let totalTagihanBuyer: number;
  let estimasiLabaBersih: number;

  if (isJapan) {
    // JP: Total tagihan adalah SUM harga_jual_per_buyer jika sudah diisi
    totalTagihanBuyer =
      jpHargaJualTotal > 0
        ? jpHargaJualTotal
        : totalModalBatch + feeGO + feeRekap;
    estimasiLabaBersih =
      jpHargaJualTotal > 0
        ? jpHargaJualTotal - totalModalBatch - (Number(feeNyelem) || 0)
        : feeGO - (Number(feeNyelem) || 0);
  } else if (isIndonesia) {
    // INA: Total tagihan = sum(harga asli) + fee GO + fee Rekap
    totalTagihanBuyer = konversiIDR + feeGO + feeRekap;
    estimasiLabaBersih = feeGO - (Number(feeNyelem) || 0);
  } else {
    // CH, KR, TH
    totalTagihanBuyer = totalModalBatch + feeGO + feeRekap;
    estimasiLabaBersih = feeGO - (Number(feeNyelem) || 0);
  }

  const totalOverheadBatch =
    shippingLuarNegeriIDR + feeWHProxyTotal + feeGO + feeRekap;
  const overheadPerPc = totalQty > 0 ? totalOverheadBatch / totalQty : 0;

  const summary: CalculationSummary = {
    totalQty,
    totalBuyer: uniqueBuyers,
    totalHargaAsliValas,
    konversiIDR,
    shippingLuarNegeriIDR,
    feeWHProxyTotal,
    feeGO,
    feeRekap,
    tierLabel,
    totalModalBatch,
    totalTagihanBuyer,
    estimasiLabaBersih,
    isJapan,
    jpHargaJualTotal,
    allJpHargaJualFilled,
    unfilledJpBuyersCount,
  };

  return { summary, overheadPerPc };
}
