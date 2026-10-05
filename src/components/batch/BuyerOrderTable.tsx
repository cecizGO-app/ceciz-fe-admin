import React from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import type { BuyerOption, OrderRow } from './types'

interface BuyerOrderTableProps {
  orderRows: OrderRow[]
  registeredBuyers: BuyerOption[]
  currency: string
  kursRate: number
  overheadPerPc: number
  onAddRow: () => void
  onRemoveRow: (id: string) => void
  onUpdateRow: (id: string, field: keyof OrderRow, value: any) => void
}

function formatIDR(val: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Math.round(val))
}

export const BuyerOrderTable: React.FC<BuyerOrderTableProps> = ({
  orderRows,
  registeredBuyers,
  currency,
  kursRate,
  overheadPerPc,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
}) => {
  return (
    <div className="bg-white rounded-[24px] shadow-ceciz-surface border border-[#FBCFE8]/40 p-6 sm:p-7 space-y-4">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-[17px] font-bold text-[#18181B] tracking-tight">
          Daftar Pesanan Buyer
        </h2>

        <button
          type="button"
          onClick={onAddRow}
          className="h-9 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#EC4899] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Baris Buyer</span>
        </button>
      </div>

      {/* Mobile Card List (md:hidden) */}
      <div className="md:hidden space-y-3.5">
        {orderRows.map((row, idx) => {
          const itemBaseIDR = (Number(row.qty) || 0) * (Number(row.hargaAsli) || 0) * kursRate
          const itemOverheadIDR = (Number(row.qty) || 0) * overheadPerPc
          const itemTotalIDR = itemBaseIDR + itemOverheadIDR

          return (
            <div
              key={row.id}
              className="p-4 rounded-[16px] bg-[#FFF5FA]/40 border border-[#FCE7F3] space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EC4899] text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-[#18181B]">
                    Item #{idx + 1}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveRow(row.id)}
                  disabled={orderRows.length <= 1}
                  className="p-1.5 rounded-lg text-[#EF4444] hover:bg-red-50 hover:text-[#DC2626] disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                  title="Hapus baris"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Buyer Account Select */}
              <div>
                <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                  Nama Buyer (Akun)
                </label>
                <div className="relative">
                  <select
                    value={row.buyerId}
                    onChange={(e) => onUpdateRow(row.id, 'buyerId', e.target.value)}
                    className="w-full h-11 px-3.5 pr-8 rounded-[12px] border border-[#FCE7F3] bg-white text-xs font-normal text-[#18181B] appearance-none focus-ceciz-ring cursor-pointer hover:border-[#FBCFE8] transition-colors"
                  >
                    {registeredBuyers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.username})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#71717A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Item / Varian */}
              <div>
                <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                  Nama Item / Varian
                </label>
                <input
                  type="text"
                  value={row.itemName}
                  placeholder="Nama barang..."
                  onChange={(e) => onUpdateRow(row.id, 'itemName', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-[12px] border border-[#FCE7F3] bg-white text-xs text-[#18181B] placeholder-[#A1A1AA] focus-ceciz-ring hover:border-[#FBCFE8] transition-colors"
                />
              </div>

              {/* Qty & Harga Asli Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                    Qty (pcs)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={row.qty}
                    onChange={(e) => onUpdateRow(row.id, 'qty', Math.max(1, Number(e.target.value) || 1))}
                    className="w-full h-11 px-2 text-center rounded-[12px] border border-[#FCE7F3] bg-white text-xs font-semibold text-[#18181B] focus-ceciz-ring hover:border-[#FBCFE8] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                    Harga Asli ({currency})
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={row.hargaAsli}
                      onChange={(e) => onUpdateRow(row.id, 'hargaAsli', Number(e.target.value) || 0)}
                      className="w-full h-11 px-3 pr-10 rounded-[12px] border border-[#FCE7F3] bg-white text-xs font-semibold text-[#18181B] focus-ceciz-ring hover:border-[#FBCFE8] transition-colors"
                    />
                    <span className="absolute right-2.5 text-[11px] font-semibold text-[#A1A1AA]">
                      {currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Computed Total IDR for this card */}
              <div className="p-3 rounded-[12px] bg-white border border-[#FCE7F3] flex items-center justify-between">
                <span className="text-[11px] text-[#71717A] font-medium">Total IDR (inc. fee):</span>
                <span className="text-xs font-bold text-[#EC4899]">
                  {formatIDR(itemTotalIDR)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop Table Data Grid (hidden on mobile, visible on md+) */}
      <div className="hidden md:block overflow-x-auto">
        <div className="rounded-[16px] border border-[#FCE7F3] overflow-hidden bg-white">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#FFF5FA] border-b border-[#FCE7F3] text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                <th className="py-3 px-4 w-12 text-center">NO</th>
                <th className="py-3 px-4 min-w-[220px]">NAMA BUYER (AKUN)</th>
                <th className="py-3 px-4 min-w-[200px]">ITEM / VARIAN</th>
                <th className="py-3 px-4 w-20 text-center">QTY</th>
                <th className="py-3 px-4 w-32">HARGA ASLI</th>
                <th className="py-3 px-4 w-36 text-right">TOTAL IDR</th>
                <th className="py-3 px-4 w-14 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FCE7F3] text-xs">
              {orderRows.map((row, idx) => {
                // Row total IDR with proportional overhead
                const itemBaseIDR = (Number(row.qty) || 0) * (Number(row.hargaAsli) || 0) * kursRate
                const itemOverheadIDR = (Number(row.qty) || 0) * overheadPerPc
                const itemTotalIDR = itemBaseIDR + itemOverheadIDR

                return (
                  <tr key={row.id} className="hover:bg-[#FFF5FA]/30 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium text-[#71717A]">{idx + 1}</td>

                    {/* Buyer Select */}
                    <td className="py-3.5 px-4">
                      <div className="relative">
                        <select
                          value={row.buyerId}
                          onChange={(e) => onUpdateRow(row.id, 'buyerId', e.target.value)}
                          className="w-full h-11 px-3.5 pr-8 rounded-[12px] border border-[#FCE7F3] bg-white text-xs font-normal text-[#18181B] appearance-none focus-ceciz-ring cursor-pointer hover:border-[#FBCFE8] transition-colors"
                        >
                          {registeredBuyers.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.username})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#71717A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>

                    {/* Item / Varian */}
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        value={row.itemName}
                        placeholder="Nama barang..."
                        onChange={(e) => onUpdateRow(row.id, 'itemName', e.target.value)}
                        className="w-full h-11 px-3.5 rounded-[12px] border border-[#FCE7F3] bg-white text-xs text-[#18181B] placeholder-[#A1A1AA] focus-ceciz-ring hover:border-[#FBCFE8] transition-colors"
                      />
                    </td>

                    {/* Qty */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="number"
                        min="1"
                        value={row.qty}
                        onChange={(e) => onUpdateRow(row.id, 'qty', Math.max(1, Number(e.target.value) || 1))}
                        className="w-14 h-11 mx-auto text-center rounded-[12px] border border-[#FCE7F3] bg-white text-xs font-semibold text-[#18181B] focus-ceciz-ring hover:border-[#FBCFE8] transition-colors"
                      />
                    </td>

                    {/* Harga Asli Valas */}
                    <td className="py-3.5 px-4">
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          value={row.hargaAsli}
                          onChange={(e) => onUpdateRow(row.id, 'hargaAsli', Number(e.target.value) || 0)}
                          className="w-full h-11 px-3.5 pr-11 rounded-[12px] border border-[#FCE7F3] bg-white text-xs font-semibold text-[#18181B] focus-ceciz-ring hover:border-[#FBCFE8] transition-colors"
                        />
                        <span className="absolute right-3 text-[11px] font-semibold text-[#A1A1AA] pointer-events-none">
                          {currency}
                        </span>
                      </div>
                    </td>

                    {/* Computed Total IDR */}
                    <td className="py-3.5 px-4 text-right font-bold text-[13px] text-[#18181B]">
                      {formatIDR(itemTotalIDR)}
                    </td>

                    {/* Delete Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveRow(row.id)}
                        disabled={orderRows.length <= 1}
                        className="p-2 rounded-lg text-[#EF4444] hover:bg-red-50 hover:text-[#DC2626] disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                        title="Hapus baris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proportional Note */}
      <p className="text-[12px] text-[#71717A] pt-2">
        Total IDR per baris sudah termasuk pembagian ongkir & fee batch secara proporsional per pcs.
      </p>
    </div>
  )
}

export default BuyerOrderTable
