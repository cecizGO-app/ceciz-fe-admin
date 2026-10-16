import React from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import type { CountryCode, CountryOption } from './types'
import { CountryFlag } from '../icons/CountryFlag'

interface BatchInfoFormProps {
  countries: CountryOption[]
  selectedCountry: CountryCode
  onSelectCountry: (code: CountryCode) => void
  batchName: string
  onChangeBatchName: (val: string) => void
  batchCode: string
  batchDate: string
  onChangeBatchDate: (val: string) => void
  kursRate: number
  onChangeKursRate: (val: number) => void
  shippingForeign: number
  onChangeShippingForeign: (val: number) => void
  currentCurrency: string
  warehouse: string
  onChangeWarehouse: (val: string) => void
  feeWarehouse: number
  onChangeFeeWarehouse: (val: number) => void
  jasaProxy: string
  onChangeJasaProxy: (val: string) => void
  feeProxy: number
  onChangeFeeProxy: (val: number) => void
  adminNyelem: string
  onChangeAdminNyelem: (val: string) => void
  feeNyelem: number
  onChangeFeeNyelem: (val: number) => void
  feeGO: number
  onChangeFeeGO: (val: number) => void
  catatan: string
  onChangeCatatan: (val: string) => void
}

export const BatchInfoForm: React.FC<BatchInfoFormProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
  batchName,
  onChangeBatchName,
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
    <div className="bg-white rounded-[24px] shadow-ceciz-surface border border-[#FBCFE8]/40 p-6 sm:p-7 space-y-6">
      <h2 className="text-[17px] font-bold text-[#18181B] tracking-tight">
        Informasi & Biaya Batch
      </h2>

      {/* Country Selection Pills */}
      <div className="flex flex-wrap gap-2">
        {countries.map((c) => {
          const isSelected = selectedCountry === c.code
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelectCountry(c.code)}
              className={`h-9 px-3.5 rounded-[12px] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${isSelected
                  ? 'bg-[#EC4899] text-white shadow-xs'
                  : 'bg-white border border-[#FBCFE8] text-[#71717A] hover:bg-[#FFF5FA] hover:text-[#18181B]'
                }`}
            >
              <CountryFlag code={c.code} className="w-5 h-3.5" />
              <span>{c.name}</span>
            </button>
          )
        })}
      </div>

      {/* Form Fields */}
      <div className="space-y-4 pt-1">
        {/* Row 1: Nama, Kode, Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Nama / Judul Batch
            </label>
            <input
              type="text"
              value={batchName}
              onChange={(e) => onChangeBatchName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] focus-ceciz-ring"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Kode Batch (Auto)
            </label>
            <input
              type="text"
              value={batchCode}
              readOnly
              className="w-full h-11 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-zinc-50 text-xs font-medium text-[#71717A] cursor-not-allowed"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Tanggal Batch
            </label>
            <div className="relative">
              <input
                type="date"
                value={batchDate}
                onChange={(e) => onChangeBatchDate(e.target.value)}
                className="w-full h-11 px-3.5 pr-10 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] focus-ceciz-ring"
              />
              <Calendar className="w-4 h-4 text-[#71717A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Kurs & Ongkir Luar Negeri */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Kurs / Exchange Rate (IDR/{currentCurrency})
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-[#71717A] font-medium">Rp</span>
              <input
                type="number"
                value={kursRate}
                onChange={(e) => onChangeKursRate(Number(e.target.value) || 0)}
                className="w-full h-11 pl-9 pr-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-semibold text-[#18181B] focus-ceciz-ring"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              {selectedCountry === "JP"
                ? "Shiploc (Shipping Lokal ke WH)"
                : "Ongkir Luar Negeri (Shipping WH)"}
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={shippingForeign}
                onChange={(e) => onChangeShippingForeign(Number(e.target.value) || 0)}
                className="w-full h-11 px-3.5 pr-12 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-semibold text-[#18181B] focus-ceciz-ring"
              />
              <span className="absolute right-3.5 text-xs font-semibold text-[#71717A]">
                {currentCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Warehouse & Fee Warehouse */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Warehouse Tujuan
            </label>
            <div className="relative">
              <select
                value={warehouse}
                onChange={(e) => onChangeWarehouse(e.target.value)}
                className="w-full h-11 px-3.5 pr-8 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] appearance-none focus-ceciz-ring cursor-pointer"
              >
                <option value="WH Guangzhou">WH Guangzhou</option>
                <option value="WH Seoul">WH Seoul</option>
                <option value="WH Tokyo">WH Tokyo</option>
                <option value="WH Bangkok">WH Bangkok</option>
                <option value="WH Jakarta">WH Jakarta</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#71717A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Fee Warehouse (per batch)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-[#71717A] font-medium">Rp</span>
              <input
                type="number"
                value={feeWarehouse}
                onChange={(e) => onChangeFeeWarehouse(Number(e.target.value) || 0)}
                className="w-full h-11 pl-9 pr-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] focus-ceciz-ring"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Jasa Proxy CO & Fee Proxy */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Jasa Proxy CO
            </label>
            <input
              type="text"
              value={jasaProxy}
              onChange={(e) => onChangeJasaProxy(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] focus-ceciz-ring"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Fee Proxy (per batch)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-[#71717A] font-medium">Rp</span>
              <input
                type="number"
                value={feeProxy}
                onChange={(e) => onChangeFeeProxy(Number(e.target.value) || 0)}
                className="w-full h-11 pl-9 pr-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] focus-ceciz-ring"
              />
            </div>
          </div>
        </div>

        {/* Row 5: Admin Nyelem, Fee Nyelem, Fee GO */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-4">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Admin Nyelem (Relasi Gaji)
            </label>
            <div className="relative">
              <select
                value={adminNyelem}
                onChange={(e) => onChangeAdminNyelem(e.target.value)}
                className="w-full h-11 px-3.5 pr-8 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] appearance-none focus-ceciz-ring cursor-pointer"
              >
                <option value="Admin 1 (Aurel)">Admin 1 (Aurel)</option>
                <option value="Admin 2 (Nadia)">Admin 2 (Nadia)</option>
                <option value="Owner (Cecilia)">Owner (Cecilia)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#71717A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Fee Nyelem (per batch)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-[#71717A] font-medium">Rp</span>
              <input
                type="number"
                value={feeNyelem}
                onChange={(e) => onChangeFeeNyelem(Number(e.target.value) || 0)}
                className="w-full h-11 pl-9 pr-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] focus-ceciz-ring"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
              Fee GO (per batch)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-[#71717A] font-medium">Rp</span>
              <input
                type="number"
                value={feeGO}
                onChange={(e) => onChangeFeeGO(Number(e.target.value) || 0)}
                className="w-full h-11 pl-9 pr-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-semibold text-[#18181B] focus-ceciz-ring"
              />
            </div>
          </div>
        </div>

        {/* Row 6: Keterangan / Catatan */}
        <div>
          <label className="block text-[12px] font-medium text-[#71717A] mb-1.5">
            Keterangan Barang & Catatan
          </label>
          <input
            type="text"
            value={catatan}
            onChange={(e) => onChangeCatatan(e.target.value)}
            placeholder="Contoh: Estimasi sampai WH China 3 hari, exclude packing lokal INA..."
            className="w-full h-11 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs text-[#18181B] placeholder-[#71717A] focus-ceciz-ring"
          />
        </div>
      </div>
    </div>
  )
}

export default BatchInfoForm
