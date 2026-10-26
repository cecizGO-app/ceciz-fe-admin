import React from "react";
import { Calendar } from "lucide-react";
import type { CountryCode, CountryOption } from "@/types/batch";

import { CountryFlag } from "@/components/icons/CountryFlag";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function formatDateDDMMYY(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const [year, month, day] = dateStr.split("-");
    if (year && month && day) {
      return `${day}-${month}-${year.slice(-2)}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
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
    <Card className="gap-6">
      <CardHeader>
        <CardTitle>Informasi &amp; Biaya Batch</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Country Selection Pills */}
        <div className="flex flex-wrap gap-2">
          {countries.map((c) => {
            const isSelected = selectedCountry === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => onSelectCountry(c.code)}
                className={`h-9 px-3.5 rounded-[12px] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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

        {/* Form Fields */}
        <div className="space-y-4 pt-1">
          {/* Row 1: Nama, Kode, Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <Label htmlFor="batch-name">Detail / Nama Batch</Label>
              <Input
                id="batch-name"
                type="text"
                value={batchName}
                onChange={(e) => onChangeBatchName(e.target.value)}
                placeholder="Contoh: WTS Chenle Digipack Ver..."
              />
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="batch-number">Nomor Batch (Angka)</Label>
                <span className="text-[10px] font-bold text-[#EC4899] bg-[#FFF5FA] px-1.5 py-0.5 rounded border border-[#FBCFE8]">
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
                placeholder="Contoh: 1, 2, 18"
                required
              />
            </div>

            <div className="sm:col-span-4">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="batch-date">Tanggal Batch</Label>
                <span className="text-[10px] text-[#71717A] bg-zinc-100 px-1.5 py-0.5 rounded font-mono">
                  dd-mm-yy: {formatDateDDMMYY(batchDate)}
                </span>
              </div>
              <div className="relative">
                <Input
                  id="batch-date"
                  type="date"
                  value={batchDate}
                  onChange={(e) => onChangeBatchDate(e.target.value)}
                  className="pr-10"
                />
                <Calendar className="w-4 h-4 text-[#71717A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 2: Kurs & Shiploc/Ongkir (Kondisional INA) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {!isINA ? (
              <div className="sm:col-span-6">
                <Label htmlFor="kurs-rate">
                  {isKR
                    ? "Rate / Kurs Won (IDR/KRW)"
                    : isJP
                      ? "Rate / Kurs Yen (IDR/JPY)"
                      : `Rate Kurs (IDR/${currentCurrency})`}
                </Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs text-[#71717A] font-medium pointer-events-none">
                    Rp
                  </span>
                  <Input
                    id="kurs-rate"
                    type="number"
                    value={kursRate || ""}
                    onChange={(e) =>
                      onChangeKursRate(Number(e.target.value) || 0)
                    }
                    className="pl-9 font-semibold"
                    placeholder="Masukan rate harian..."
                  />
                </div>
              </div>
            ) : (
              <div className="sm:col-span-6">
                <Label htmlFor="kurs-rate">Mata Uang &amp; Kurs</Label>
                <Input
                  id="kurs-rate"
                  type="text"
                  value="Rupiah (IDR) - Tanpa Valas"
                  disabled
                  className="bg-zinc-50 text-zinc-600 font-medium"
                />
              </div>
            )}

            {!isINA ? (
              <div className="sm:col-span-6">
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="shipping-foreign">
                    {isJP
                      ? "Shiploc (Shipping Lokal ke WH Tokyo)"
                      : isKR
                        ? "Shiploc / Ongkir WH Korea"
                        : `Shiploc / Ongkir Luar Negeri (${currentCurrency})`}
                  </Label>
                  {isKR && (
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Won &divide; 10.000 (3k won = 0.3)
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
                    className="pr-14 font-semibold"
                    placeholder="0"
                  />
                  <span className="absolute right-3.5 text-xs font-semibold text-[#71717A] pointer-events-none">
                    {currentCurrency}
                  </span>
                </div>
              </div>
            ) : (
              <div className="sm:col-span-6">
                <Label htmlFor="harga-co-shopee">
                  Harga CO Shopee dari Seller (Nominal)
                </Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs text-[#71717A] font-medium pointer-events-none">
                    Rp
                  </span>
                  <Input
                    id="harga-co-shopee"
                    type="number"
                    value={hargaCOShopeeSeller || ""}
                    onChange={(e) =>
                      onChangeHargaCOShopeeSeller?.(Number(e.target.value) || 0)
                    }
                    className="pl-9 font-semibold"
                    placeholder="Contoh: 15000"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Row 3: Warehouse & Fee Warehouse */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <Label htmlFor="warehouse">
                {isINA ? "Warehouse / Pengiriman Lokal" : "Warehouse Tujuan"}
              </Label>
              <Select value={warehouse} onValueChange={onChangeWarehouse}>
                <SelectTrigger id="warehouse">
                  <SelectValue placeholder="Pilih Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WH Guangzhou">
                    WH Guangzhou (China)
                  </SelectItem>
                  <SelectItem value="WH Seoul">WH Seoul (Korea)</SelectItem>
                  <SelectItem value="WH Tokyo">WH Tokyo (Jepang)</SelectItem>
                  <SelectItem value="WH Bangkok">
                    WH Bangkok (Thailand)
                  </SelectItem>
                  <SelectItem value="WH Jakarta">
                    WH Jakarta (Indonesia)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-6">
              <Label htmlFor="fee-warehouse">
                {isINA
                  ? "Fee Operasional Lokal (IDR)"
                  : "Fee Warehouse (per batch)"}
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs text-[#71717A] font-medium pointer-events-none">
                  Rp
                </span>
                <Input
                  id="fee-warehouse"
                  type="number"
                  value={feeWarehouse || ""}
                  onChange={(e) =>
                    onChangeFeeWarehouse(Number(e.target.value) || 0)
                  }
                  className="pl-9"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Jasa Proxy CO / Seller & Fee Proxy */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <Label htmlFor="jasa-proxy">
                {isINA ? "Nama Seller (Penjual)" : "Proxy CO (Jasa CO Barang)"}
              </Label>
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
              />
            </div>

            <div className="sm:col-span-6">
              <Label htmlFor="fee-proxy">
                {isINA
                  ? "Fee Packing Seller (per batch)"
                  : "Fee Proxy / CO / TF (per batch)"}
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs text-[#71717A] font-medium pointer-events-none">
                  Rp
                </span>
                <Input
                  id="fee-proxy"
                  type="number"
                  value={feeProxy || ""}
                  onChange={(e) =>
                    onChangeFeeProxy(Number(e.target.value) || 0)
                  }
                  className="pl-9"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Admin Nyelem, Fee Nyelem, Fee GO */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <Label htmlFor="admin-nyelem">Admin Nyelem (Role Admin)</Label>
              <Select value={adminNyelem} onValueChange={onChangeAdminNyelem}>
                <SelectTrigger id="admin-nyelem">
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

            <div className="sm:col-span-4">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="fee-nyelem">
                  {isJP
                    ? "Fee Nyelem (Total Batch)"
                    : isINA
                      ? "Fee Adm Nyelem"
                      : "Fee Nyelem (per pc)"}
                </Label>
                <span className="text-[10px] text-[#71717A]">
                  {isJP ? "Flat batch" : "Otomatis 2k, editable"}
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs text-[#71717A] font-medium pointer-events-none">
                  Rp
                </span>
                <Input
                  id="fee-nyelem"
                  type="number"
                  value={feeNyelem || ""}
                  onChange={(e) =>
                    onChangeFeeNyelem(Number(e.target.value) || 0)
                  }
                  className="pl-9"
                  placeholder={isJP ? "Contoh: 10000" : "2000"}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="fee-go">
                  {isINA ? "Fee GO (Total Batch)" : "Fee GO (per batch)"}
                </Label>
                {isINA && (
                  <span className="text-[10px] text-[#71717A]">2k/pc</span>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs text-[#71717A] font-medium pointer-events-none">
                  Rp
                </span>
                <Input
                  id="fee-go"
                  type="number"
                  value={feeGO || ""}
                  onChange={(e) => onChangeFeeGO(Number(e.target.value) || 0)}
                  className="pl-9 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Fee Keseluruhan Indicator (Poin 11: fee wh + fee co/tf + fee go + fee rekap) */}
          <div className="p-3 rounded-[12px] bg-[#FFF5FA] border border-[#FBCFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-[#71717A]">
              <strong>Fee Keseluruhan</strong> = Fee WH (Rp{" "}
              {feeWarehouse.toLocaleString("id-ID")}) + Fee CO/Proxy (Rp{" "}
              {feeProxy.toLocaleString("id-ID")}) + Fee GO (Rp{" "}
              {feeGO.toLocaleString("id-ID")}) + Fee Rekap [{tierLabel}] (Rp{" "}
              {feeRekap.toLocaleString("id-ID")})
            </span>
            <span className="font-bold text-[#EC4899] shrink-0 text-sm">
              = Rp {feeKeseluruhan.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Row 6: Keterangan / Catatan */}
          <div>
            <Label htmlFor="catatan">Keterangan Barang &amp; Catatan</Label>
            <Input
              id="catatan"
              type="text"
              value={catatan}
              onChange={(e) => onChangeCatatan(e.target.value)}
              placeholder="Contoh: Estimasi sampai WH 3 hari, exclude packing lokal INA..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchInfoForm;
