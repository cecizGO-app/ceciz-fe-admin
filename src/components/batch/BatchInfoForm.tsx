import React from "react";
import { Calendar } from "lucide-react";
import type { CountryCode, CountryOption } from "@/types/batch";

import { CountryFlag } from "@/components/icons/CountryFlag";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BatchInfoFormProps {
  countries: CountryOption[];
  selectedCountry: CountryCode;
  onSelectCountry: (code: CountryCode) => void;
  batchName: string;
  onChangeBatchName: (val: string) => void;
  batchNumber: number;
  onChangeBatchNumber: (val: number) => void;
  batchCode: string;
  batchDate: string;
  onChangeBatchDate: (val: string) => void;
  kursRate: number;
  onChangeKursRate: (val: number) => void;
  rateSeller?: number;
  onChangeRateSeller?: (val: number) => void;
  shippingForeign: number;
  onChangeShippingForeign: (val: number) => void;
  currentCurrency: string;
  warehouse: string;
  onChangeWarehouse: (val: string) => void;
  feeWarehouse: number;
  onChangeFeeWarehouse: (val: number) => void;
  jasaProxy: string;
  onChangeJasaProxy: (val: string) => void;
  feeProxy: number;
  onChangeFeeProxy: (val: number) => void;
  adminNyelem: string;
  onChangeAdminNyelem: (val: string) => void;
  feeNyelem: number;
  onChangeFeeNyelem: (val: number) => void;
  feeGO: number;
  onChangeFeeGO: (val: number) => void;
  hargaCOShopeeSeller?: number;
  onChangeHargaCOShopeeSeller?: (val: number) => void;
  feeKeseluruhan?: number;
  feeRekap?: number;
  tierLabel?: string;
  catatan: string;
  onChangeCatatan: (val: string) => void;
}

function formatIDR(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

export const BatchInfoForm: React.FC<BatchInfoFormProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
  batchName,
  onChangeBatchName,
  batchNumber,
  onChangeBatchNumber,
  batchCode,
  batchDate,
  onChangeBatchDate,
  kursRate,
  onChangeKursRate,
  rateSeller = 0,
  onChangeRateSeller,
  shippingForeign,
  onChangeShippingForeign,
  currentCurrency,
  warehouse,
  onChangeWarehouse,
  feeWarehouse,
  onChangeFeeWarehouse,
  jasaProxy,
  onChangeJasaProxy,
  feeProxy,
  onChangeFeeProxy,
  adminNyelem,
  onChangeAdminNyelem,
  feeNyelem,
  onChangeFeeNyelem,
  feeGO,
  onChangeFeeGO,
  hargaCOShopeeSeller = 0,
  onChangeHargaCOShopeeSeller,
  feeKeseluruhan = 0,
  feeRekap = 0,
  tierLabel = "-",
  catatan,
  onChangeCatatan,
}) => {
  const isINA = selectedCountry === "INA";
  const isKR = selectedCountry === "KR";
  const isJP = selectedCountry === "JP";

  return (
    <Card className="gap-6 p-6 sm:p-7 shadow-sm border border-[#FBCFE8]/60">
      <CardHeader className="p-0 space-y-1.5">
        <CardTitle className="text-xl font-bold text-zinc-900 tracking-tight">
          Informasi &amp; Biaya Batch
        </CardTitle>
        <CardDescription className="text-xs text-zinc-500">
          Atur negara asal, kurs konversi mata uang, dan parameter operasional batch.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-0 pt-2">
        {/* Country Selection Pills */}
        <div>
          <Label className="text-xs font-semibold text-zinc-700 mb-2 block">
            Pilih Negara Asal Batch
          </Label>
          <div className="flex flex-wrap gap-2">
            {countries.map((c) => {
              const isSelected = selectedCountry === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => onSelectCountry(c.code)}
                  className={`h-9 px-3.5 rounded-[12px] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#EC4899] text-white shadow-xs"
                      : "bg-white border border-[#FBCFE8] text-[#71717A] hover:bg-[#FFF5FA] hover:text-[#18181B]"
                  }`}
                >
                  <CountryFlag code={c.code} className="w-5 h-3.5" />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="space-y-4">
          {/* Row 1: Nama, Nomor, Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-6 space-y-1.5">
              <div className="flex items-center justify-between h-[22px]">
                <Label htmlFor="batch-name" className="text-xs font-semibold text-zinc-800 whitespace-nowrap">
                  Detail / Nama Batch
                </Label>
              </div>
              <Input
                id="batch-name"
                type="text"
                value={batchName}
                onChange={(e) => onChangeBatchName(e.target.value)}
                placeholder="Contoh: WTS Chenle Digipack Ver..."
                className="h-10 text-xs"
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <div className="flex items-center justify-between h-[22px] gap-1">
                <Label htmlFor="batch-number" className="text-xs font-semibold text-zinc-800 whitespace-nowrap">
                  Nomor Batch
                </Label>
                <span className="text-[10px] font-bold text-[#EC4899] bg-[#FFF5FA] px-1.5 py-0.5 rounded border border-[#FBCFE8] shrink-0">
                  {batchCode}
                </span>
              </div>
              <Input
                id="batch-number"
                type="number"
                min={1}
                step={1}
                value={batchNumber || ""}
                onChange={(e) =>
                  onChangeBatchNumber(
                    Math.max(1, parseInt(e.target.value, 10) || 1),
                  )
                }
                placeholder="1"
                required
                className="h-10 text-xs font-semibold"
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <div className="flex items-center justify-between h-[22px]">
                <Label htmlFor="batch-date" className="text-xs font-semibold text-zinc-800 whitespace-nowrap">
                  Tanggal Batch
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="batch-date"
                  type="date"
                  value={batchDate}
                  onChange={(e) => onChangeBatchDate(e.target.value)}
                  className="h-10 pr-9 text-xs"
                />
                <Calendar className="w-4 h-4 text-[#71717A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Kurs Rate Buyer, Rate Seller & Shiploc/Ongkir (Kondisional INA) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            {!isINA ? (
              <>
                <div className="sm:col-span-4 space-y-1.5">
                  <div className="flex items-center justify-between h-[22px] gap-1">
                    <Label htmlFor="kurs-rate" className="text-xs font-semibold text-zinc-800 whitespace-nowrap">
                      Rate Buyer ({currentCurrency})
                    </Label>
                    <span className="text-[10px] text-pink-700 font-semibold bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200 shrink-0">
                      Jual
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-[#71717A] font-medium pointer-events-none">
                      Rp
                    </span>
                    <Input
                      id="kurs-rate"
                      type="number"
                      value={kursRate || ""}
                      onChange={(e) =>
                        onChangeKursRate(Number(e.target.value) || 0)
                      }
                      className="h-10 pl-9 font-semibold text-xs"
                      placeholder="Rate tagihan..."
                    />
                  </div>
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <div className="flex items-center justify-between h-[22px] gap-1">
                    <Label htmlFor="rate-seller" className="text-xs font-semibold text-zinc-800 whitespace-nowrap">
                      Rate Seller ({currentCurrency})
                    </Label>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                      TF Seller
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-[#71717A] font-medium pointer-events-none">
                      Rp
                    </span>
                    <Input
                      id="rate-seller"
                      type="number"
                      value={rateSeller || ""}
                      onChange={(e) =>
                        onChangeRateSeller?.(Number(e.target.value) || 0)
                      }
                      className="h-10 pl-9 font-semibold text-xs text-emerald-700 bg-emerald-50/20 border-emerald-200"
                      placeholder="Rate transfer seller..."
                    />
                  </div>
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <div className="flex items-center justify-between h-[22px] gap-1">
                    <Label htmlFor="shipping-foreign" className="text-xs font-semibold text-zinc-800 whitespace-nowrap">
                      {isJP
                        ? "Shiploc (WH Tokyo)"
                        : isKR
                          ? "Shiploc WH Korea"
                          : `Shiploc (${currentCurrency})`}
                    </Label>
                    {isKR && (
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                        &divide; 10k
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Input
                      id="shipping-foreign"
                      type="number"
                      step={isKR ? "0.01" : "1"}
                      value={shippingForeign || ""}
                      onChange={(e) =>
                        onChangeShippingForeign(Number(e.target.value) || 0)
                      }
                      className="h-10 pr-12 font-semibold text-xs"
                      placeholder="0"
                    />
                    <span className="absolute right-3 text-xs font-semibold text-[#71717A] pointer-events-none">
                      {currentCurrency}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="sm:col-span-6 space-y-1.5">
                  <Label htmlFor="kurs-rate" className="text-xs font-semibold text-zinc-800">
                    Mata Uang &amp; Kurs
                  </Label>
                  <Input
                    id="kurs-rate"
                    type="text"
                    value="Rupiah (IDR) — Tanpa Valas"
                    disabled
                    className="h-10 bg-zinc-50 text-zinc-600 font-medium text-xs"
                  />
                </div>
                <div className="sm:col-span-6 space-y-1.5">
                  <Label htmlFor="harga-co-shopee" className="text-xs font-semibold text-zinc-800">
                    Harga CO Shopee dari Seller (Nominal)
                  </Label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-[#71717A] font-medium pointer-events-none">
                      Rp
                    </span>
                    <Input
                      id="harga-co-shopee"
                      type="number"
                      value={hargaCOShopeeSeller || ""}
                      onChange={(e) =>
                        onChangeHargaCOShopeeSeller?.(Number(e.target.value) || 0)
                      }
                      className="h-10 pl-9 font-semibold text-xs"
                      placeholder="Contoh: 15000"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Row 3: Warehouse & Fee Warehouse */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-6 space-y-1.5">
              <div className="flex items-center justify-between h-[22px]">
                <Label htmlFor="warehouse" className="text-xs font-semibold text-zinc-800">
                  {isINA ? "Warehouse / Ekspedisi Lokal" : "Warehouse Tujuan"}
                </Label>
              </div>
              <Select value={warehouse} onValueChange={onChangeWarehouse}>
                <SelectTrigger id="warehouse" className="h-10 text-xs">
                  <SelectValue placeholder="Pilih Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {isINA ? (
                    <>
                      <SelectItem value="WH Jakarta">WH Jakarta</SelectItem>
                      <SelectItem value="WH Bandung">WH Bandung</SelectItem>
                      <SelectItem value="WH Surabaya">WH Surabaya</SelectItem>
                    </>
                  ) : isKR ? (
                    <>
                      <SelectItem value="WH Seoul">WH Seoul (Korea)</SelectItem>
                      <SelectItem value="WH Incheon">WH Incheon (Korea)</SelectItem>
                    </>
                  ) : isJP ? (
                    <>
                      <SelectItem value="WH Tokyo">WH Tokyo (Jepang)</SelectItem>
                      <SelectItem value="WH Osaka">WH Osaka (Jepang)</SelectItem>
                    </>
                  ) : selectedCountry === "TH" ? (
                    <>
                      <SelectItem value="WH Bangkok">WH Bangkok (Thailand)</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="WH Guangzhou">WH Guangzhou (China)</SelectItem>
                      <SelectItem value="WH Yiwu">WH Yiwu (China)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-6 space-y-1.5">
              <div className="flex items-center justify-between h-[22px]">
                <Label htmlFor="fee-warehouse" className="text-xs font-semibold text-zinc-800">
                  Fee Warehouse (per batch)
                </Label>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-[#71717A] font-medium pointer-events-none">
                  Rp
                </span>
                <Input
                  id="fee-warehouse"
                  type="number"
                  value={feeWarehouse || ""}
                  onChange={(e) =>
                    onChangeFeeWarehouse(Number(e.target.value) || 0)
                  }
                  className="h-10 pl-9 text-xs font-medium"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Jasa Proxy CO / Seller & Fee Proxy */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-6 space-y-1.5">
              <div className="flex items-center justify-between h-[22px]">
                <Label htmlFor="jasa-proxy" className="text-xs font-semibold text-zinc-800">
                  {isINA ? "Nama Seller (Penjual)" : "Proxy CO (Jasa CO Barang)"}
                </Label>
              </div>
              <Input
                id="jasa-proxy"
                type="text"
                value={jasaProxy}
                onChange={(e) => onChangeJasaProxy(e.target.value)}
                placeholder={
                  isINA
                    ? "Nama seller / toko Shopee..."
                    : "Nama jasa CO barang..."
                }
                className="h-10 text-xs"
              />
            </div>

            <div className="sm:col-span-6 space-y-1.5">
              <div className="flex items-center justify-between h-[22px]">
                <Label htmlFor="fee-proxy" className="text-xs font-semibold text-zinc-800">
                  {isINA
                    ? "Fee Packing Seller (per batch)"
                    : "Fee Proxy / CO / TF (per batch)"}
                </Label>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-[#71717A] font-medium pointer-events-none">
                  Rp
                </span>
                <Input
                  id="fee-proxy"
                  type="number"
                  value={feeProxy || ""}
                  onChange={(e) =>
                    onChangeFeeProxy(Number(e.target.value) || 0)
                  }
                  className="h-10 pl-9 text-xs font-medium"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Admin Nyelem, Fee Nyelem, Fee GO */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between h-[22px]">
                <Label htmlFor="admin-nyelem" className="text-xs font-semibold text-zinc-800">
                  Admin Nyelem
                </Label>
              </div>
              <Select value={adminNyelem} onValueChange={onChangeAdminNyelem}>
                <SelectTrigger id="admin-nyelem" className="h-10 text-xs">
                  <SelectValue placeholder="Pilih Admin Nyelem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin 1 (Aurel)">
                    Admin 1 (Aurel)
                  </SelectItem>
                  <SelectItem value="Admin 2 (Nadia)">
                    Admin 2 (Nadia)
                  </SelectItem>
                  <SelectItem value="Owner (Cecilia)">
                    Owner (Cecilia)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between h-[22px]">
                <Label htmlFor="fee-nyelem" className="text-xs font-semibold text-zinc-800">
                  Fee Nyelem ({isJP ? "Total Batch" : "Per Pc"})
                </Label>
                <span className="text-[10px] text-zinc-400">
                  {isJP ? "Flat batch" : "Default 2k"}
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-[#71717A] font-medium pointer-events-none">
                  Rp
                </span>
                <Input
                  id="fee-nyelem"
                  type="number"
                  value={feeNyelem || ""}
                  onChange={(e) =>
                    onChangeFeeNyelem(Number(e.target.value) || 0)
                  }
                  className="h-10 pl-9 text-xs font-medium"
                  placeholder={isJP ? "Contoh: 10000" : "2000"}
                />
              </div>
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between h-[22px]">
                <Label htmlFor="fee-go" className="text-xs font-semibold text-zinc-800">
                  Fee GO ({isINA ? "Total Batch" : "Per Batch"})
                </Label>
                {isINA && (
                  <span className="text-[10px] text-zinc-400">2k/pc</span>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-[#71717A] font-medium pointer-events-none">
                  Rp
                </span>
                <Input
                  id="fee-go"
                  type="number"
                  value={feeGO || ""}
                  onChange={(e) => onChangeFeeGO(Number(e.target.value) || 0)}
                  className="h-10 pl-9 font-semibold text-xs"
                />
              </div>
            </div>
          </div>

          {/* Fee Keseluruhan Indicator (Clean & Modern Summary) */}
          <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-zinc-900 flex items-center gap-2">
                <span>Total Fee Operasional Batch</span>
                <span className="text-[10px] font-bold text-[#EC4899] bg-white px-2 py-0.5 rounded-full border border-pink-200">
                  {tierLabel.startsWith("Tier") ? tierLabel : `Tier ${tierLabel}`}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Fee WH ({formatIDR(feeWarehouse)}) + Fee Proxy ({formatIDR(feeProxy)}) + Fee GO ({formatIDR(feeGO)}) + Fee Rekap ({formatIDR(feeRekap)})
              </p>
            </div>
            <div className="flex items-baseline gap-1.5 self-end sm:self-auto shrink-0">
              <span className="text-xs text-zinc-500 font-medium">Subtotal Fee:</span>
              <span className="text-base font-extrabold text-[#EC4899] tabular-nums">
                {formatIDR(feeKeseluruhan)}
              </span>
            </div>
          </div>

          {/* Row 6: Keterangan / Catatan */}
          <div className="space-y-1.5">
            <Label htmlFor="catatan" className="text-xs font-semibold text-zinc-800">
              Keterangan Barang &amp; Catatan
            </Label>
            <Input
              id="catatan"
              type="text"
              value={catatan}
              onChange={(e) => onChangeCatatan(e.target.value)}
              placeholder="Contoh: Estimasi sampai WH 3 hari, exclude packing lokal INA..."
              className="h-10 text-xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchInfoForm;
