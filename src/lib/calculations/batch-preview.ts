import type { CountryCode, OrderRow, CalculationSummary } from "@/types/batch";
import { calculateFeeRekap } from "./fee-rekap";

export interface BatchPreviewInput {
  countryCode: CountryCode;
  orderRows: OrderRow[];
  kursRate: number; // Rate Buyer
  rateSeller?: number; // Rate Seller (kurs transfer ke seller/WH)
  shippingWHForeign: number;
  feeWarehouse: number;
  feeProxy: number;
  feeGO: number;
  feeNyelem: number; // For CH/TH/KR: per pc (default 2000). For JP: total batch. For INA: fee adm nyelem.
  hargaCOShopeeSeller?: number; // Khusus INA
}

export interface BatchPreviewResult {
  summary: CalculationSummary;
  overheadPerPc: number;
  computedRows: OrderRow[];
}

/**
 * Calculation Engine: 5 Negara Real-time Preview (PRD B v1.4 §4 & §7)
 * Pure TypeScript functions untuk preview reaktif (< 1 detik).
 */
export function calculateBatchPreview(
  input: BatchPreviewInput,
): BatchPreviewResult {
  const {
    countryCode,
    orderRows,
    kursRate,
    rateSeller,
    shippingWHForeign,
    feeWarehouse,
    feeProxy,
    feeGO,
    feeNyelem,
    hargaCOShopeeSeller = 0,
  } = input;

  const isJapan = countryCode === "JP";
  const isKorea = countryCode === "KR";
  const isIndonesia = countryCode === "INA";
  const effectiveRateSeller = rateSeller && rateSeller > 0 ? rateSeller : kursRate;

  // Pcs = konstan 1 per row (sesuai spek)
  const totalQty = orderRows.reduce((sum, r) => sum + (Number(r.qty) || 1), 0);
  const uniqueBuyers = new Set(orderRows.map((r) => r.buyerId)).size;

  // 1. Total Harga Asli Valas
  // Untuk KR: Input harga Won dibagi 10.000 (misal input 0.2 = 2.000 won)
  // Untuk INA: Tidak ada valas, nominal dalam IDR
  const totalHargaAsliValas = orderRows.reduce((sum, r) => {
    const qty = Number(r.qty) || 1;
    const harga = Number(r.hargaAsli) || 0;
    return sum + qty * harga;
  }, 0);

  // 2. Fee Rekap Tiered (berdasarkan total pcs dalam batch)
  const { fee: feeRekap, tierLabel } = calculateFeeRekap(totalQty);

  // 3. Konversi ke IDR & Shipping Luar Negeri
  let konversiIDR = 0;
  let shippingLuarNegeriIDR = 0;
  let feeWHProxyTotal = 0;
  let feeKeseluruhan = 0;
  let feeNyelemTotal = 0;
  let subtotalTfSeller = 0;
  let totalTagihanBuyer = 0;
  let selisihHarga = 0;
  let estimasiLabaBersih = 0;
  let overheadPerPc = 0;
  let totalPendapatanINA: number | undefined;

  const jpHargaJualTotal = orderRows.reduce(
    (sum, r) => sum + (Number(r.qty) || 1) * (Number(r.hargaJualPerBuyer) || 0),
    0,
  );
  const allJpHargaJualFilled =
    orderRows.length > 0 &&
    orderRows.every((r) => (Number(r.hargaJualPerBuyer) || 0) > 0);
  const unfilledJpBuyersCount = orderRows.filter(
    (r) => !(Number(r.hargaJualPerBuyer) > 0),
  ).length;

  if (isIndonesia) {
    // INA: Tanpa kurs valas, tanpa shipping WH luar negeri, tanpa fee proxy luar
    konversiIDR = totalHargaAsliValas;
    shippingLuarNegeriIDR = 0;
    feeWHProxyTotal = 0;
    const effectiveFeeGO = Number(feeGO) || totalQty * 2000;
    feeKeseluruhan = effectiveFeeGO + feeRekap;
    feeNyelemTotal = Number(feeNyelem) || 0;

    // Total Pendapatan = SUM Harga Rupiah + SUM Fee GO
    totalPendapatanINA = totalHargaAsliValas + effectiveFeeGO;
    // Subtotal TF Seller = SUM Harga Rupiah + Harga CO Shopee dari seller
    subtotalTfSeller = totalHargaAsliValas + Number(hargaCOShopeeSeller || 0);
    totalTagihanBuyer = totalPendapatanINA;
    // Selisih = Total Pendapatan - Subtotal TF Seller
    selisihHarga = totalPendapatanINA - subtotalTfSeller;
    // Laba Bersih = Selisih - fee adm nyelem - fee adm rekap
    estimasiLabaBersih = selisihHarga - feeNyelemTotal - feeRekap;

    overheadPerPc = totalQty > 0 ? effectiveFeeGO / totalQty : 0;
  } else if (isKorea) {
    // KR: Harga asli & shiploc dikalikan 10.000 sebelum dikalikan rate harian
    konversiIDR = totalHargaAsliValas * 10000 * kursRate;
    shippingLuarNegeriIDR = (Number(shippingWHForeign) || 0) * 10000 * kursRate;
    feeWHProxyTotal = (Number(feeWarehouse) || 0) + (Number(feeProxy) || 0);
    feeKeseluruhan = feeWHProxyTotal + (Number(feeGO) || 0) + feeRekap;
    const feeNyelemPerPc = Number(feeNyelem) || 0;
    feeNyelemTotal = feeNyelemPerPc * totalQty;

    // Subtotal TF Seller = ((Harga + shiploc) * rateSeller + fee wh + fee co/tf)
    subtotalTfSeller =
      (totalHargaAsliValas + (Number(shippingWHForeign) || 0)) *
        10000 *
        effectiveRateSeller +
      feeWHProxyTotal;

    // Overhead per PC (termasuk ongkir, fee keseluruhan, dan fee nyelem)
    overheadPerPc =
      totalQty > 0
        ? (shippingLuarNegeriIDR + feeKeseluruhan) / totalQty + feeNyelemPerPc
        : 0;

    // Total Tagihan Buyer = konversiIDR + shippingLuarNegeriIDR + feeKeseluruhan + feeNyelemTotal
    totalTagihanBuyer =
      konversiIDR + shippingLuarNegeriIDR + feeKeseluruhan + feeNyelemTotal;

    // Selisih = Harga Total - Subtotal TF Seller
    selisihHarga = totalTagihanBuyer - subtotalTfSeller;
    // Estimasi Laba Bersih = Selisih - fee nyelem - fee rekap (termasuk margin kurs)
    estimasiLabaBersih = selisihHarga - feeNyelemTotal - feeRekap;
  } else if (isJapan) {
    // JP: Konversi standar, fee nyelem nominal total batch
    konversiIDR = totalHargaAsliValas * kursRate;
    shippingLuarNegeriIDR = (Number(shippingWHForeign) || 0) * kursRate;
    feeWHProxyTotal = (Number(feeWarehouse) || 0) + (Number(feeProxy) || 0);
    feeKeseluruhan = feeWHProxyTotal + (Number(feeGO) || 0) + feeRekap;
    feeNyelemTotal = Number(feeNyelem) || 0; // Nominal total batch

    // Subtotal TF Seller = ((Total Yen + shiploc) * rateSeller + fee wh + fee co/tf)
    subtotalTfSeller =
      (totalHargaAsliValas + (Number(shippingWHForeign) || 0)) * effectiveRateSeller +
      feeWHProxyTotal;

    const hargaBersihBatch =
      subtotalTfSeller + feeNyelemTotal + (Number(feeGO) || 0) + feeRekap;

    overheadPerPc =
      totalQty > 0 ? (shippingLuarNegeriIDR + feeKeseluruhan) / totalQty : 0;

    if (jpHargaJualTotal > 0) {
      totalTagihanBuyer = jpHargaJualTotal;
      selisihHarga = jpHargaJualTotal - subtotalTfSeller;
      estimasiLabaBersih = selisihHarga - feeNyelemTotal - feeRekap;
    } else {
      totalTagihanBuyer = hargaBersihBatch;
      selisihHarga = hargaBersihBatch - subtotalTfSeller;
      estimasiLabaBersih = selisihHarga - feeNyelemTotal - feeRekap;
    }
  } else {
    // CH & TH: Konversi standar
    konversiIDR = totalHargaAsliValas * kursRate;
    shippingLuarNegeriIDR = (Number(shippingWHForeign) || 0) * kursRate;
    feeWHProxyTotal = (Number(feeWarehouse) || 0) + (Number(feeProxy) || 0);
    feeKeseluruhan = feeWHProxyTotal + (Number(feeGO) || 0) + feeRekap;
    const feeNyelemPerPc = Number(feeNyelem) || 0;
    feeNyelemTotal = feeNyelemPerPc * totalQty;

    // Subtotal TF Seller = ((Harga + shiploc) * rateSeller + fee wh + fee co/tf)
    subtotalTfSeller =
      (totalHargaAsliValas + (Number(shippingWHForeign) || 0)) * effectiveRateSeller +
      feeWHProxyTotal;

    overheadPerPc =
      totalQty > 0
        ? (shippingLuarNegeriIDR + feeKeseluruhan) / totalQty + feeNyelemPerPc
        : 0;

    totalTagihanBuyer =
      konversiIDR + shippingLuarNegeriIDR + feeKeseluruhan + feeNyelemTotal;

    selisihHarga = totalTagihanBuyer - subtotalTfSeller;
    estimasiLabaBersih = selisihHarga - feeNyelemTotal - feeRekap;
  }

  // Total Modal Batch
  const totalModalBatch = konversiIDR + shippingLuarNegeriIDR + feeWHProxyTotal;

  // 4. Hitung harga bersih per row untuk tabel pesanan
  const computedRows: OrderRow[] = orderRows.map((row) => {
    let rowHargaBersih = 0;
    const rawHarga = Number(row.hargaAsli) || 0;
    const rowQty = Number(row.qty) || 1;

    if (isIndonesia) {
      rowHargaBersih = rawHarga + overheadPerPc;
    } else if (isKorea) {
      rowHargaBersih = rawHarga * 10000 * kursRate + overheadPerPc;
    } else if (isJapan) {
      rowHargaBersih =
        row.hargaJualPerBuyer && row.hargaJualPerBuyer > 0
          ? row.hargaJualPerBuyer
          : rawHarga * kursRate + overheadPerPc;
    } else {
      // CH & TH
      rowHargaBersih = rawHarga * kursRate + overheadPerPc;
    }

    return {
      ...row,
      qty: rowQty,
      feeNyelem: isJapan ? 0 : Number(feeNyelem) || 0,
      hargaBersih: Math.round(rowHargaBersih),
    };
  });

  const summary: CalculationSummary = {
    totalQty,
    totalBuyer: uniqueBuyers,
    totalHargaAsliValas,
    konversiIDR,
    shippingLuarNegeriIDR,
    feeWHProxyTotal,
    feeGO,
    feeRekap,
    feeKeseluruhan,
    feeNyelemTotal,
    tierLabel,
    subtotalTfSeller,
    rateSeller: effectiveRateSeller,
    rateBuyer: kursRate,
    totalModalBatch,
    totalTagihanBuyer,
    selisihHarga,
    estimasiLabaBersih,
    isJapan,
    isKorea,
    isIndonesia,
    jpHargaJualTotal,
    allJpHargaJualFilled,
    unfilledJpBuyersCount,
    hargaCOShopeeSeller,
    totalPendapatanINA,
  };

  return { summary, overheadPerPc, computedRows };
}
