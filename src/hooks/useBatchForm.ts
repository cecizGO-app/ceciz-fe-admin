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
  const [feeNyelem, setFeeNyelem] = useState(2000); // Default Rp2.000 (per pc for CH/KR/TH/INA, total batch for JP)
  const [feeGO, setFeeGO] = useState(25000);
  const [hargaCOShopeeSeller, setHargaCOShopeeSeller] = useState(0); // Khusus INA
  const [catatan, setCatatan] = useState(
    "Contoh: Estimasi sampai WH China 3 hari, exclude packing lokal INA...",
  );

  // Dynamic Buyer Order Rows (Setiap baris konstan 1 pc)
  const [orderRows, setOrderRows] = useState<OrderRow[]>([
    {
      id: "1",
      buyerId: "b_01",
      itemName: "Chenle Set A",
      qty: 1,
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
    if (code === "KR") {
      setWarehouseTujuan("WH Seoul");
      setJasaProxy("Proxy Korea / Bunjang");
      setShippingWHForeign(0.3); // 3.000 won / 10.000
      setFeeWarehouse(15000);
      setFeeProxy(10000);
      setFeeNyelem(2000); // 2k/pc
      setFeeGO(25000);
      setHargaCOShopeeSeller(0);
      setBatchName("WTS Batch Merch Korea (Weverse / Bunjang)");
      setCatatan(
        "Batch KR: Nominal harga won diinput dalam bentuk dibagi 10.000 (misal 2.000 won = 0.2).",
      );
      setOrderRows([
        {
          id: "kr_1",
          buyerId: REGISTERED_BUYERS[0].id,
          itemName: "PC Jaemin Weverse POB",
          qty: 1,
          hargaAsli: 0.2, // 2.000 won
        },
        {
          id: "kr_2",
          buyerId: REGISTERED_BUYERS[1].id,
          itemName: "PC Jeno Lucky Draw",
          qty: 1,
          hargaAsli: 0.5, // 5.000 won
        },
      ]);
    } else if (code === "TH") {
      setWarehouseTujuan("WH Bangkok");
      setJasaProxy("Proxy Thailand (Fast Cargo TH)");
      setShippingWHForeign(50); // 50 baht
      setFeeWarehouse(15000);
      setFeeProxy(10000);
      setFeeNyelem(2000); // 2k/pc
      setFeeGO(25000);
      setHargaCOShopeeSeller(0);
      setBatchName("WTS Batch Merch Thailand (GMMTV)");
      setCatatan("Batch TH: Rate baht flat, ongkir WH split per batch.");
      setOrderRows([
        {
          id: "th_1",
          buyerId: REGISTERED_BUYERS[0].id,
          itemName: "Photocard GeminiFourth Ver A",
          qty: 1,
          hargaAsli: 45,
        },
        {
          id: "th_2",
          buyerId: REGISTERED_BUYERS[1].id,
          itemName: "Postcard Set",
          qty: 1,
          hargaAsli: 30,
        },
      ]);
    } else if (code === "CH") {
      setWarehouseTujuan("WH Guangzhou");
      setJasaProxy("Taobao Pay / Superbuy");
      setShippingWHForeign(15); // 15 yuan
      setFeeWarehouse(15000);
      setFeeProxy(10000);
      setFeeNyelem(2000); // 2k/pc
      setFeeGO(25000);
      setHargaCOShopeeSeller(0);
      setBatchName("WTS Album Chenle Digipack Ver");
      setCatatan(
        "Batch CH: Estimasi sampai WH China 3 hari, exclude packing lokal INA.",
      );
      setOrderRows([
        {
          id: "ch_1",
          buyerId: REGISTERED_BUYERS[0].id,
          itemName: "Chenle Set A",
          qty: 1,
          hargaAsli: 85,
        },
        {
          id: "ch_2",
          buyerId: REGISTERED_BUYERS[1].id,
          itemName: "Chenle Photobook",
          qty: 1,
          hargaAsli: 50,
        },
      ]);
    } else if (code === "JP") {
      setWarehouseTujuan("WH Tokyo");
      setJasaProxy("Neokyo / FromJapan (Proxy JP)");
      setShippingWHForeign(500); // Shiploc 500 Yen
      setFeeWarehouse(15000);
      setFeeProxy(10000);
      setFeeNyelem(15000); // Nominal TOTAL batch khusus JP
      setFeeGO(25000);
      setHargaCOShopeeSeller(0);
      setBatchName("WTS Batch Merch Official Japan (Mercari)");
      setCatatan(
        "Batch JP: Exclude packing lokal INA, rate yen flat, shiploc split per batch. Harga jual manual diisi admin.",
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
      setJasaProxy("Seller Shopee Official (Seller Lokal)");
      setShippingWHForeign(0);
      setFeeWarehouse(0);
      setFeeProxy(0);
      setFeeNyelem(2000); // Fee adm nyelem
      setFeeGO(4000); // 2 pcs * 2.000 (default PRD B §7.4: 2k/pc)
      setHargaCOShopeeSeller(15000); // Harga CO Shopee dari seller
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
        qty: 1, // Konstan 1 pc
        hargaAsli: 0,
        feeNyelem: selectedCountry === "JP" ? 0 : 2000,
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
  const { summary, overheadPerPc, computedRows } = useMemo(() => {
    return calculateBatchPreview({
      countryCode: selectedCountry,
      orderRows,
      kursRate,
      shippingWHForeign,
      feeWarehouse,
      feeProxy,
      feeGO,
      feeNyelem,
      hargaCOShopeeSeller,
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
    hargaCOShopeeSeller,
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
    hargaCOShopeeSeller,
    setHargaCOShopeeSeller,
    catatan,
    setCatatan,
    orderRows,
    handleAddRow,
    handleRemoveRow,
    handleUpdateRow,
    summary,
    overheadPerPc,
    computedRows,
  };
}
