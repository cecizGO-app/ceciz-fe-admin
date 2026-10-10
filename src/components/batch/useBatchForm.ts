import { useState, useMemo } from "react";
import type { CountryCode, OrderRow, CalculationSummary } from "./types";
import { COUNTRIES, REGISTERED_BUYERS, calculateFeeRekap } from "./constants";

export function useBatchForm() {
  // Selected Country
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("CH");

  // Form State
  const [batchName, setBatchName] = useState("WTS Album Chenle Digipack Ver");
  const [batchCode] = useState("CN-2610-018");
  const [batchDate, setBatchDate] = useState("2026-10-02");

  // Rates & Fees
  const [kursRate, setKursRate] = useState(2250);
  const [shippingWHForeign, setShippingWHForeign] = useState(15);
  const [warehouseTujuan, setWarehouseTujuan] = useState("WH Guangzhou");
  const [feeWarehouse, setFeeWarehouse] = useState(15000);
  const [jasaProxy, setJasaProxy] = useState("Taobao Pay / Superbuy");
  const [feeProxy, setFeeProxy] = useState(10000);
  const [adminNyelem, setAdminNyelem] = useState("Admin 1 (Aurel)");
  const [feeNyelem, setFeeNyelem] = useState(0);
  const [feeGO, setFeeGO] = useState(25000);
  const [catatan, setCatatan] = useState(
    "Contoh: Estimasi sampai WH China 3 hari, exclude packing lokal INA...",
  );

  // Dynamic Buyer Order Rows
  const [orderRows, setOrderRows] = useState<OrderRow[]>([
    {
      id: "1",
      buyerId: "b_01",
      itemName: "Chenle Set A",
      qty: 2,
      hargaAsli: 85,
    },
    {
      id: "2",
      buyerId: "b_02",
      itemName: "Chenle Photobook",
      qty: 1,
      hargaAsli: 50,
    },
    {
      id: "3",
      buyerId: "b_03",
      itemName: "Digipack Random",
      qty: 1,
      hargaAsli: 40,
    },
  ]);

  // Active Country Config
  const currentCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.code === selectedCountry) || COUNTRIES[0];
  }, [selectedCountry]);

  // Switch Country Handler
  const handleCountryChange = (code: CountryCode) => {
    setSelectedCountry(code);
    const target = COUNTRIES.find((c) => c.code === code);
    if (target) {
      setKursRate(target.defaultRate);
    }
  };

  // Row Handlers
  const handleAddRow = () => {
    const newId = String(Date.now());
    setOrderRows((prev) => [
      ...prev,
      {
        id: newId,
        buyerId: REGISTERED_BUYERS[0].id,
        itemName: "",
        qty: 1,
        hargaAsli: 0,
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (orderRows.length <= 1) return;
    setOrderRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof OrderRow, value: any) => {
    setOrderRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  // Real-Time Calculations (PRD 5 Negara Engine)
  const { summary, overheadPerPc } = useMemo(() => {
    const totalQty = orderRows.reduce(
      (sum, r) => sum + (Number(r.qty) || 0),
      0,
    );
    const uniqueBuyers = new Set(orderRows.map((r) => r.buyerId)).size;

    const totalHargaAsliValas = orderRows.reduce(
      (sum, r) => sum + (Number(r.qty) || 0) * (Number(r.hargaAsli) || 0),
      0,
    );

    const konversiIDR = totalHargaAsliValas * kursRate;
    const shippingLuarNegeriIDR = (Number(shippingWHForeign) || 0) * kursRate;
    const feeWHProxyTotal =
      (Number(feeWarehouse) || 0) + (Number(feeProxy) || 0);
    const { fee: feeRekap, tierLabel } = calculateFeeRekap(totalQty);
    const totalModalBatch =
      konversiIDR + shippingLuarNegeriIDR + feeWHProxyTotal;
    const totalTagihanBuyer = totalModalBatch + feeGO + feeRekap;
    const estimasiLabaBersih = feeGO - feeNyelem;

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
    };

    return { summary, overheadPerPc };
  }, [
    orderRows,
    kursRate,
    shippingWHForeign,
    feeWarehouse,
    feeProxy,
    feeGO,
    feeNyelem,
  ]);

  return {
    selectedCountry,
    handleCountryChange,
    currentCountry,
    batchName,
    setBatchName,
    batchCode,
    batchDate,
    setBatchDate,
    kursRate,
    setKursRate,
    shippingWHForeign,
    setShippingWHForeign,
    warehouseTujuan,
    setWarehouseTujuan,
    feeWarehouse,
    setFeeWarehouse,
    jasaProxy,
    setJasaProxy,
    feeProxy,
    setFeeProxy,
    adminNyelem,
    setAdminNyelem,
    feeNyelem,
    setFeeNyelem,
    feeGO,
    setFeeGO,
    catatan,
    setCatatan,
    orderRows,
    handleAddRow,
    handleRemoveRow,
    handleUpdateRow,
    summary,
    overheadPerPc,
  };
}
