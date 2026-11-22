import { useState, useMemo, useEffect } from "react";
import {
  getNextBatchNumberApi,
  getBatchFormOptionsApi,
  getAdminUsersApi,
  type BackendUserOption,
} from "@/services/batch.service";
import type { BuyerOption, CountryCode, OrderRow } from "@/types/batch";
import { calculateBatchPreview } from "@/lib/calculations/batch-preview";
import { COUNTRIES, REGISTERED_BUYERS } from "@/components/batch/constants";

function mapBackendUsersToBuyerOptions(users: BackendUserOption[]): BuyerOption[] {
  return users.map((u) => {
    const displayName = u.dnLine?.trim() || u.name || u.email || u.id;
    const handle = u.idLine?.trim()
      ? `@${u.idLine.replace(/^@/, "")}`
      : u.email || u.id;
  return {
      id: u.id,
      name: displayName,
      username: handle,
      email: u.email,
      dnLine: u.dnLine ?? undefined,
      idLine: u.idLine ?? undefined,
      lineGroup: u.lineGroup ?? undefined,
    };
  });
}

export function useBatchForm() {
  // Selected Country
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("CH");

  // Live Buyers & Admins from Backend API (fallback to REGISTERED_BUYERS only if offline)
  const [buyers, setBuyers] = useState<BuyerOption[]>(REGISTERED_BUYERS);
  const [isBuyersFromApi, setIsBuyersFromApi] = useState(false);
  const [isLoadingBuyers, setIsLoadingBuyers] = useState(true);
  const [admins, setAdmins] = useState<BackendUserOption[]>([]);

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

  // Otomatis mengambil Nomor Batch Berikutnya (Next Batch Number) dari Backend Vercel
  useEffect(() => {
    let isCurrent = true;
    getNextBatchNumberApi(selectedCountry)
      .then((res) => {
        if (isCurrent && res?.nextBatchNumber) {
          setBatchNumber(res.nextBatchNumber);
        }
      })
      .catch((err) => {
        console.warn(`Gagal mengambil next batch number untuk ${selectedCountry}:`, err);
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedCountry]);

  // Ambil opsi form (kurs harian, daftar buyer & admin asli dari database) saat pertama kali dimuat
  useEffect(() => {
    let isMounted = true;
    setIsLoadingBuyers(true);

    getBatchFormOptionsApi()
      .then(async (opts) => {
        if (!isMounted) return;

        if (opts?.settings?.dailyRate) {
          const dr = opts.settings.dailyRate;
          if (selectedCountry === "CH" && dr.yuan) {
            setKursRate(Number(dr.yuan));
          } else if (selectedCountry === "KR" && dr.won) {
            setKursRate(Number(dr.won));
          } else if (selectedCountry === "TH" && dr.baht) {
            setKursRate(Number(dr.baht));
          } else if (selectedCountry === "JP" && dr.yen) {
            setKursRate(Number(dr.yen));
          }
        }

        if (opts?.admins && Array.isArray(opts.admins) && opts.admins.length > 0) {
          setAdmins(opts.admins);
          setAdminNyelem(opts.admins[0].id);
        }

        let rawBuyers: BackendUserOption[] = Array.isArray(opts?.buyers) ? opts.buyers : [];
        if (rawBuyers.length === 0) {
          try {
            rawBuyers = await getAdminUsersApi({ role: "BUYER" });
          } catch {
            // Biarkan fallback jika endpoint users gagal
          }
        }

        if (isMounted && rawBuyers.length > 0) {
          const mapped = mapBackendUsersToBuyerOptions(rawBuyers);
          setBuyers(mapped);
          setIsBuyersFromApi(true);
          // Sinkronkan row default agar tidak menggunakan ID dummy (b_01/b_02/b_03)
          setOrderRows((prev) =>
            prev.map((row, idx) => {
              const existsInReal = mapped.some((b) => b.id === row.buyerId);
              if (existsInReal) return row;
              const replacement = mapped[idx % mapped.length];
  return { ...row, buyerId: replacement.id };
            }),
          );
        }
      })
      .catch(async (err) => {
        console.warn("Gagal memuat form-options dari backend:", err);
        try {
          const fallbackUsers = await getAdminUsersApi({ role: "BUYER" });
          if (isMounted && fallbackUsers.length > 0) {
            const mapped = mapBackendUsersToBuyerOptions(fallbackUsers);
            setBuyers(mapped);
            setIsBuyersFromApi(true);
            setOrderRows((prev) =>
              prev.map((row, idx) => {
                const existsInReal = mapped.some((b) => b.id === row.buyerId);
                if (existsInReal) return row;
  return { ...row, buyerId: mapped[idx % mapped.length].id };
              }),
            );
          }
        } catch {
          // Gunakan REGISTERED_BUYERS sebagai fallback offline
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingBuyers(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Rates & Fees
  const [kursRate, setKursRate] = useState(2250); // Rate Buyer
  const [rateSeller, setRateSeller] = useState(2200); // Rate Seller (kurs transfer ke seller/WH)
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

  const getBuyerIdAt = (index: number) => {
    const list = buyers.length > 0 ? buyers : REGISTERED_BUYERS;
    return list[index % list.length]?.id || "";
  };

  // Switch Country Handler
  const handleCountryChange = (code: CountryCode) => {
    setSelectedCountry(code);
    const target = COUNTRIES.find((c) => c.code === code);
    if (target) {
      setKursRate(target.defaultRate);
      setRateSeller(target.defaultRateSeller ?? target.defaultRate);
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
          buyerId: getBuyerIdAt(0),
          itemName: "PC Jaemin Weverse POB",
          qty: 1,
          hargaAsli: 0.2, // 2.000 won
        },
        {
          id: "kr_2",
          buyerId: getBuyerIdAt(1),
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
          buyerId: getBuyerIdAt(0),
          itemName: "Photocard GeminiFourth Ver A",
          qty: 1,
          hargaAsli: 45,
        },
        {
          id: "th_2",
          buyerId: getBuyerIdAt(1),
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
          buyerId: getBuyerIdAt(0),
          itemName: "Chenle Set A",
          qty: 1,
          hargaAsli: 85,
        },
        {
          id: "ch_2",
          buyerId: getBuyerIdAt(1),
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
          buyerId: getBuyerIdAt(0),
          itemName: "PC Jaemin Bstage Special",
          qty: 1,
          hargaAsli: 2500,
          hargaJualPerBuyer: 320000,
        },
        {
          id: "jp_2",
          buyerId: getBuyerIdAt(1),
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
          buyerId: getBuyerIdAt(0),
          itemName: "PC Mark Glitch Mode",
          qty: 1,
          hargaAsli: 45000,
        },
        {
          id: "ina_2",
          buyerId: getBuyerIdAt(1),
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
        buyerId: getBuyerIdAt(prev.length),
        itemName: "",
        qty: 1, // Konstan 1 pc
        hargaAsli: 0,
        feeNyelem: selectedCountry === "JP" ? 0 : 2000,
        hargaJualPerBuyer: selectedCountry === "JP" ? 0 : undefined,
      },
    ]);
  };

  // Bulk Set Row Count Handler (1-50 Total PC)
  const handleSetRowCount = (count: number) => {
    const targetCount = Math.max(1, Math.min(50, count));
    setOrderRows((prev) => {
      if (prev.length === targetCount) return prev;
      if (prev.length > targetCount) {
        return prev.slice(0, targetCount);
      }
      const diff = targetCount - prev.length;
      const newRows: OrderRow[] = [];
      const baseTimestamp = Date.now();
      for (let i = 0; i < diff; i++) {
        newRows.push({
          id: `${baseTimestamp}_${i}`,
          buyerId: getBuyerIdAt(prev.length + i),
          itemName: "",
          qty: 1,
          hargaAsli: 0,
          feeNyelem: selectedCountry === "JP" ? 0 : 2000,
          hargaJualPerBuyer: selectedCountry === "JP" ? 0 : undefined,
        });
      }
      return [...prev, ...newRows];
    });
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
      rateSeller,
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
    rateSeller,
    shippingWHForeign,
    feeWarehouse,
    feeProxy,
    feeGO,
    feeNyelem,
    hargaCOShopeeSeller,
  ]);

  const loadFromBackendBatch = (batch: {
    countryCode: CountryCode;
    title: string;
    batchNumber: number;
    batchDate: string;
    rateHarian?: number | string | null;
    shippingFee?: number | string | null;
    feeWh?: number | string | null;
    feeProxy?: number | string | null;
    feeNyelem?: number | string;
    feeGo?: number | string;
    proxyCoName?: string | null;
    adminNyelemId?: string | null;
    description?: string | null;
    items?: Array<{
      id: string;
      buyerId: string;
      description: string;
      hargaAsli: number | string;
      pcs: number;
      feeNyelem?: number | string | null;
      hargaPerBuyer?: number | string | null;
      hargaJualPerBuyer?: number | string | null;
    }>;
  }) => {
    setSelectedCountry(batch.countryCode);
    setBatchName(batch.title || "");
    setBatchNumber(Number(batch.batchNumber) || 1);
    if (batch.batchDate) {
      setBatchDate(String(batch.batchDate).split("T")[0]);
    }
    if (batch.rateHarian != null) {
      setKursRate(Number(batch.rateHarian) || 0);
      setRateSeller(Number(batch.rateHarian) || 0);
    }
    if (batch.shippingFee != null) setShippingWHForeign(Number(batch.shippingFee) || 0);
    if (batch.feeWh != null) setFeeWarehouse(Number(batch.feeWh) || 0);
    if (batch.feeProxy != null) setFeeProxy(Number(batch.feeProxy) || 0);
    if (batch.feeNyelem != null) setFeeNyelem(Number(batch.feeNyelem) || 0);
    if (batch.feeGo != null) setFeeGO(Number(batch.feeGo) || 0);
    if (batch.proxyCoName) setJasaProxy(batch.proxyCoName);
    if (batch.adminNyelemId) setAdminNyelem(batch.adminNyelemId);
    if (batch.description != null) setCatatan(batch.description);
    if (Array.isArray(batch.items) && batch.items.length > 0) {
      setOrderRows(
        batch.items.map((it) => ({
          id: it.id,
          buyerId: it.buyerId,
          itemName: it.description,
          qty: 1,
          hargaAsli: Number(it.hargaAsli) || 0,
          feeNyelem: it.feeNyelem != null ? Number(it.feeNyelem) : undefined,
          hargaBersih: it.hargaPerBuyer != null ? Number(it.hargaPerBuyer) : undefined,
          hargaJualPerBuyer:
            it.hargaJualPerBuyer != null ? Number(it.hargaJualPerBuyer) : undefined,
        })),
      );
    }
  };

  const saveDraftToLocal = () => {
    const draft = {
      selectedCountry,
      batchName,
      batchNumber,
      batchDate,
      kursRate,
      rateSeller,
      shippingWHForeign,
      warehouseTujuan,
      feeWarehouse,
      jasaProxy,
      feeProxy,
      adminNyelem,
      feeNyelem,
      feeGO,
      hargaCOShopeeSeller,
      catatan,
      orderRows,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("ceciz_admin_batch_draft_v1", JSON.stringify(draft));
      return true;
    } catch {
      return false;
    }
  };

  const hasSavedDraft = (() => {
    try {
      return Boolean(localStorage.getItem("ceciz_admin_batch_draft_v1"));
    } catch {
      return false;
    }
  })();

  const restoreDraftFromLocal = () => {
    try {
      const raw = localStorage.getItem("ceciz_admin_batch_draft_v1");
      if (!raw) return false;
      const d = JSON.parse(raw);
      if (d.selectedCountry) setSelectedCountry(d.selectedCountry);
      if (d.batchName) setBatchName(d.batchName);
      if (d.batchNumber) setBatchNumber(Number(d.batchNumber));
      if (d.batchDate) setBatchDate(d.batchDate);
      if (d.kursRate != null) setKursRate(Number(d.kursRate));
      if (d.rateSeller != null) setRateSeller(Number(d.rateSeller));
      if (d.shippingWHForeign != null) setShippingWHForeign(Number(d.shippingWHForeign));
      if (d.warehouseTujuan) setWarehouseTujuan(d.warehouseTujuan);
      if (d.feeWarehouse != null) setFeeWarehouse(Number(d.feeWarehouse));
      if (d.jasaProxy) setJasaProxy(d.jasaProxy);
      if (d.feeProxy != null) setFeeProxy(Number(d.feeProxy));
      if (d.adminNyelem) setAdminNyelem(d.adminNyelem);
      if (d.feeNyelem != null) setFeeNyelem(Number(d.feeNyelem));
      if (d.feeGO != null) setFeeGO(Number(d.feeGO));
      if (d.hargaCOShopeeSeller != null) setHargaCOShopeeSeller(Number(d.hargaCOShopeeSeller));
      if (d.catatan != null) setCatatan(d.catatan);
      if (Array.isArray(d.orderRows) && d.orderRows.length > 0) setOrderRows(d.orderRows);
      return true;
    } catch {
      return false;
    }
  };

  const clearDraftFromLocal = () => {
    try {
      localStorage.removeItem("ceciz_admin_batch_draft_v1");
    } catch {
      // Ignore
    }
  };

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
    rateSeller,
    setRateSeller,
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
    handleSetRowCount,
    handleRemoveRow,
    handleUpdateRow,
    summary,
    overheadPerPc,
    computedRows,
    buyers,
    isBuyersFromApi,
    isLoadingBuyers,
    admins,
    loadFromBackendBatch,
    saveDraftToLocal,
    hasSavedDraft,
    restoreDraftFromLocal,
    clearDraftFromLocal,
  };
}
