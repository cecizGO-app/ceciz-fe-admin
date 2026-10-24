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
  catatan: string;
  onChangeCatatan: (val: string) => void;
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
  catatan,
  onChangeCatatan,
}) => {
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
              <Label htmlFor="batch-name">Nama / Judul Batch</Label>
              <Input
                id="batch-name"
                type="text"
                value={batchName}
                onChange={(e) => onChangeBatchName(e.target.value)}
              />
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="batch-number">Nomor Batch (Manual)</Label>
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
              <Label htmlFor="batch-date">Tanggal Batch</Label>
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

          {/* Row 2: Kurs & Ongkir Luar Negeri */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <Label htmlFor="kurs-rate">
                Kurs / Exchange Rate (IDR/{currentCurrency})
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
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <Label htmlFor="shipping-foreign">
                {selectedCountry === "JP"
                  ? "Shiploc (Shipping Lokal ke WH)"
                  : "Ongkir Luar Negeri (Shipping WH)"}
              </Label>
              <div className="relative flex items-center">
                <Input
                  id="shipping-foreign"
                  type="number"
                  value={shippingForeign || ""}
                  onChange={(e) =>
                    onChangeShippingForeign(Number(e.target.value) || 0)
                  }
                  className="pr-12 font-semibold"
                />
                <span className="absolute right-3.5 text-xs font-semibold text-[#71717A] pointer-events-none">
                  {currentCurrency}
                </span>
              </div>
            </div>
          </div>

          {/* Row 3: Warehouse & Fee Warehouse */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <Label htmlFor="warehouse">Warehouse Tujuan</Label>
              <Select value={warehouse} onValueChange={onChangeWarehouse}>
                <SelectTrigger id="warehouse">
                  <SelectValue placeholder="Pilih Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WH Guangzhou">WH Guangzhou</SelectItem>
                  <SelectItem value="WH Seoul">WH Seoul</SelectItem>
                  <SelectItem value="WH Tokyo">WH Tokyo</SelectItem>
                  <SelectItem value="WH Bangkok">WH Bangkok</SelectItem>
                  <SelectItem value="WH Jakarta">WH Jakarta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-6">
              <Label htmlFor="fee-warehouse">Fee Warehouse (per batch)</Label>
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
                />
              </div>
            </div>
          </div>

          {/* Row 4: Jasa Proxy CO & Fee Proxy */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <Label htmlFor="jasa-proxy">Jasa Proxy CO</Label>
              <Input
                id="jasa-proxy"
                type="text"
                value={jasaProxy}
                onChange={(e) => onChangeJasaProxy(e.target.value)}
              />
            </div>

            <div className="sm:col-span-6">
              <Label htmlFor="fee-proxy">Fee Proxy (per batch)</Label>
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
                />
              </div>
            </div>
          </div>

          {/* Row 5: Admin Nyelem, Fee Nyelem, Fee GO */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4">
              <Label htmlFor="admin-nyelem">Admin Nyelem (Relasi Gaji)</Label>
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
              <Label htmlFor="fee-nyelem">Fee Nyelem (per batch)</Label>
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
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <Label htmlFor="fee-go">Fee GO (per batch)</Label>
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

          {/* Row 6: Keterangan / Catatan */}
          <div>
            <Label htmlFor="catatan">Keterangan Barang &amp; Catatan</Label>
            <Input
              id="catatan"
              type="text"
              value={catatan}
              onChange={(e) => onChangeCatatan(e.target.value)}
              placeholder="Contoh: Estimasi sampai WH China 3 hari, exclude packing lokal INA..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchInfoForm;
