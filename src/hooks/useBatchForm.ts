import { useState, useMemo } from "react";
import type { CountryCode, OrderRow } from "@/types/batch";
import { calculateBatchPreview } from "@/lib/calculations/batch-preview";
import { COUNTRIES, REGISTERED_BUYERS } from "@/components/batch/constants";

export function useBatchForm() {
  // Selected Country
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("CH");

  // Form State (Manual Batch Number sesuai schema Backend)
  const [batchName, setBatchName] = useState("WTS Album Chenle Digipack Ver");
  const [batchNumber, setBatchNumber] = useState<number>(1);
  const [batchDate, setBatchDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  // Derived Batch Code: [Negara]-[Nomor 3 Digit]
  const batchCode = useMemo(() => {
    return `${selectedCountry}-${String(batchNumber || 1).padStart(3, "0")}`;
  }, [selectedCountry, batchNumber]);

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
    if (code === "JP") {
      setWarehouseTujuan("WH Tokyo");
      setJasaProxy("Neokyo / FromJapan (Proxy JP)");
      setShippingWHForeign(500); // Shiploc 500 Yen
      setFeeNyelem(15000); // Nominal TOTAL batch khusus JP
      setFeeGO(25000);
      setBatchName("WTS Batch Merch Official Japan (Mercari)");
      setCatatan(
        "Batch JP: Exclude packing lokal INA, rate yen flat, shiploc split per batch.",
      );
      setOrderRows([
        {
          id: "jp_1",
          buyerId: REGISTERED_BUYERS[0].id,
          itemName: "PC Jaemin Bstage Special",
          qty: 1,
          hargaAsli: 2500,
          hargaJualPerBuyer: 320000,
        },
        {
          id: "jp_2",
          buyerId: REGISTERED_BUYERS[1].id,
          itemName: "Album Unsealed Ver A",
          qty: 1,
          hargaAsli: 1200,
          hargaJualPerBuyer: 165000,
        },
      ]);
    } else if (code === "INA") {
      setWarehouseTujuan("WH Jakarta");
      setJasaProxy("Shopee Indonesia (Seller Lokal)");
      setShippingWHForeign(0);
      setFeeWarehouse(0);
      setFeeProxy(0);
      setFeeNyelem(0);
      setFeeGO(4000); // 2 pcs * 2.000 (default PRD B §7.4: 2k/pc)
      setBatchName("WTS Batch Ready INA (Split PC NCT Dream)");
      setCatatan("Batch INA: Pengiriman lokal via J&T/SiCepat.");
      setOrderRows([
        {
          id: "ina_1",
          buyerId: REGISTERED_BUYERS[0].id,
          itemName: "PC Mark Glitch Mode",
          qty: 1,
          hargaAsli: 45000,
        },
        {
          id: "ina_2",
          buyerId: REGISTERED_BUYERS[1].id,
          itemName: "PC Renjun Candy",
          qty: 1,
          hargaAsli: 50000,
        },
      ]);
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
        hargaJualPerBuyer: selectedCountry === "JP" ? 0 : undefined,
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

  // Real-Time Calculations (PRD 5 Negara Engine & Khusus JP §7.3 via Pure Function)
  const { summary, overheadPerPc } = useMemo(() => {
    return calculateBatchPreview({
      countryCode: selectedCountry,
      orderRows,
      kursRate,
      shippingWHForeign,
      feeWarehouse,
      feeProxy,
      feeGO,
      feeNyelem,
    });
  }, [
    selectedCountry,
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
    batchNumber,
    setBatchNumber,
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
