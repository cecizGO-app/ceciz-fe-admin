import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { BuyerOption, OrderRow } from "@/types/batch";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface BuyerOrderTableProps {
  orderRows: OrderRow[]
  registeredBuyers: BuyerOption[]
  currency: string
  kursRate: number
  overheadPerPc: number
  isJapan?: boolean
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
  isJapan = false,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
}) => {
  return (
    <Card className="gap-4">
      {/* Header & Add Button */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-0">
        <CardTitle>Daftar Pesanan Buyer</CardTitle>

        <Button
          type="button"
          variant="outline"
          onClick={onAddRow}
          className="h-10 sm:h-11 px-4 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#EC4899] hover:text-[#EC4899] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Baris Buyer</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
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

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemoveRow(row.id)}
                    disabled={orderRows.length <= 1}
                    className="text-[#EF4444] hover:bg-red-50 hover:text-[#DC2626] disabled:opacity-20 cursor-pointer"
                    title="Hapus baris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Buyer Account Select */}
                <div>
                  <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                    Nama Buyer (Akun)
                  </label>
                  <Select
                    value={row.buyerId}
                    onValueChange={(val) => onUpdateRow(row.id, 'buyerId', val)}
                  >
                    <SelectTrigger className="border-[#FCE7F3] hover:border-[#FBCFE8]">
                      <SelectValue placeholder="Pilih Buyer" />
                    </SelectTrigger>
                    <SelectContent>
                      {registeredBuyers.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name} ({b.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Item / Varian */}
                <div>
                  <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                    Nama Item / Varian
                  </label>
                  <Input
                    type="text"
                    value={row.itemName}
                    placeholder="Nama barang..."
                    onChange={(e) => onUpdateRow(row.id, 'itemName', e.target.value)}
                    className="border-[#FCE7F3] hover:border-[#FBCFE8]"
                  />
                </div>

                {/* Qty & Harga Asli Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                      Qty (pcs)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={(e) => onUpdateRow(row.id, 'qty', Math.max(1, Number(e.target.value) || 1))}
                      className="text-center font-semibold border-[#FCE7F3] hover:border-[#FBCFE8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                      Harga Asli ({currency})
                    </label>
                    <div className="relative flex items-center">
                      <Input
                        type="number"
                        value={row.hargaAsli}
                        onChange={(e) => onUpdateRow(row.id, 'hargaAsli', Number(e.target.value) || 0)}
                        className="pr-11 font-semibold border-[#FCE7F3] hover:border-[#FBCFE8]"
                      />
                      <span className="absolute right-2.5 text-[11px] font-semibold text-[#A1A1AA] pointer-events-none">
                        {currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Khusus JP: Harga Jual Manual Input di Mobile */}
                {isJapan && (
                  <div>
                    <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                      Harga Jual ke Buyer (IDR)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-[11px] font-semibold text-[#A1A1AA] pointer-events-none">
                        Rp
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="0"
                        value={row.hargaJualPerBuyer || ''}
                        onChange={(e) =>
                          onUpdateRow(
                            row.id,
                            'hargaJualPerBuyer',
                            Math.max(0, Number(e.target.value) || 0)
                          )
                        }
                        className="pl-9 border-[#FCE7F3] hover:border-[#FBCFE8] font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* Computed Total IDR for this card */}
                <div className="p-3 rounded-[12px] bg-white border border-[#FCE7F3] flex items-center justify-between">
                  <span className="text-[11px] text-[#71717A] font-medium">
                    {isJapan ? 'Tagihan Buyer:' : 'Total IDR (inc. fee):'}
                  </span>
                  {isJapan ? (
                    row.hargaJualPerBuyer && row.hargaJualPerBuyer > 0 ? (
                      <span className="text-xs font-bold text-[#EC4899]">
                        {formatIDR((Number(row.qty) || 0) * (Number(row.hargaJualPerBuyer) || 0))}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">
                        Belum diisi
                      </span>
                    )
                  ) : (
                    <span className="text-xs font-bold text-[#EC4899]">
                      {formatIDR(itemTotalIDR)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop Table Data Grid (hidden on mobile, visible on md+) */}
        <div className="hidden md:block overflow-x-auto">
          <div className="rounded-[16px] border border-[#FCE7F3] overflow-hidden bg-white">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="bg-[#FFF5FA] border-b border-[#FCE7F3] hover:bg-[#FFF5FA]">
                  <TableHead className="w-12 text-center text-[11px] font-bold text-[#71717A] tracking-wider uppercase">NO</TableHead>
                  <TableHead className="min-w-[200px] text-[11px] font-bold text-[#71717A] tracking-wider uppercase">NAMA BUYER (AKUN)</TableHead>
                  <TableHead className="min-w-[180px] text-[11px] font-bold text-[#71717A] tracking-wider uppercase">ITEM / VARIAN</TableHead>
                  <TableHead className="w-20 text-center text-[11px] font-bold text-[#71717A] tracking-wider uppercase">QTY</TableHead>
                  <TableHead className="w-32 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">HARGA ASLI</TableHead>
                  {isJapan && (
                    <TableHead className="w-44 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">HARGA JUAL (IDR)</TableHead>
                  )}
                  <TableHead className="w-36 text-right text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                    {isJapan ? 'TAGIHAN BUYER' : 'TOTAL IDR'}
                  </TableHead>
                  <TableHead className="w-14 text-center text-[11px] font-bold text-[#71717A] tracking-wider uppercase">AKSI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderRows.map((row, idx) => {
                  const itemBaseIDR = (Number(row.qty) || 0) * (Number(row.hargaAsli) || 0) * kursRate
                  const itemOverheadIDR = (Number(row.qty) || 0) * overheadPerPc
                  const itemTotalIDR = itemBaseIDR + itemOverheadIDR

                  return (
                    <TableRow key={row.id} className="hover:bg-[#FFF5FA]/30 transition-colors border-b border-[#FCE7F3]">
                      <TableCell className="text-center font-medium text-[#71717A]">{idx + 1}</TableCell>

                      {/* Buyer Select */}
                      <TableCell>
                        <Select
                          value={row.buyerId}
                          onValueChange={(val) => onUpdateRow(row.id, 'buyerId', val)}
                        >
                          <SelectTrigger className="border-[#FCE7F3] hover:border-[#FBCFE8]">
                            <SelectValue placeholder="Pilih Buyer" />
                          </SelectTrigger>
                          <SelectContent>
                            {registeredBuyers.map((b) => (
                              <SelectItem key={b.id} value={b.id}>
                                {b.name} ({b.username})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Item / Varian */}
                      <TableCell>
                        <Input
                          type="text"
                          value={row.itemName}
                          placeholder="Nama barang..."
                          onChange={(e) => onUpdateRow(row.id, 'itemName', e.target.value)}
                          className="border-[#FCE7F3] hover:border-[#FBCFE8]"
                        />
                      </TableCell>

                      {/* Qty */}
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="1"
                          value={row.qty}
                          onChange={(e) => onUpdateRow(row.id, 'qty', Math.max(1, Number(e.target.value) || 1))}
                          className="w-16 mx-auto text-center font-semibold border-[#FCE7F3] hover:border-[#FBCFE8]"
                        />
                      </TableCell>

                      {/* Harga Asli Valas */}
                      <TableCell>
                        <div className="relative flex items-center">
                          <Input
                            type="number"
                            value={row.hargaAsli}
                            onChange={(e) => onUpdateRow(row.id, 'hargaAsli', Number(e.target.value) || 0)}
                            className="pr-11 font-semibold border-[#FCE7F3] hover:border-[#FBCFE8]"
                          />
                          <span className="absolute right-3 text-[11px] font-semibold text-[#A1A1AA] pointer-events-none">
                            {currency}
                          </span>
                        </div>
                      </TableCell>

                      {/* Khusus JP: Harga Jual Manual Input */}
                      {isJapan && (
                        <TableCell>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-[11px] font-semibold text-[#A1A1AA] pointer-events-none">
                              Rp
                            </span>
                            <Input
                              type="number"
                              min="0"
                              step="1000"
                              placeholder="0"
                              value={row.hargaJualPerBuyer || ''}
                              onChange={(e) =>
                                onUpdateRow(
                                  row.id,
                                  'hargaJualPerBuyer',
                                  Math.max(0, Number(e.target.value) || 0)
                                )
                              }
                              className="pl-9 font-semibold border-[#FCE7F3] hover:border-[#FBCFE8]"
                            />
                          </div>
                        </TableCell>
                      )}

                      {/* Computed Total IDR / Tagihan */}
                      <TableCell className="text-right">
                        {isJapan ? (
                          row.hargaJualPerBuyer && row.hargaJualPerBuyer > 0 ? (
                            <span className="font-bold text-[13px] text-[#18181B]">
                              {formatIDR((Number(row.qty) || 0) * (Number(row.hargaJualPerBuyer) || 0))}
                            </span>
                          ) : (
                            <span className="text-xs text-amber-600 font-medium">
                              Belum diisi
                            </span>
                          )
                        ) : (
                          <span className="font-bold text-[13px] text-[#18181B]">
                            {formatIDR(itemTotalIDR)}
                          </span>
                        )}
                      </TableCell>

                      {/* Delete Action */}
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onRemoveRow(row.id)}
                          disabled={orderRows.length <= 1}
                          className="text-[#EF4444] hover:bg-red-50 hover:text-[#DC2626] disabled:opacity-20 cursor-pointer"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isJapan && (
          <p className="text-[12px] text-[#71717A] pt-1">
            Total IDR per baris sudah termasuk pembagian ongkir &amp; fee batch secara proporsional per pcs.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default BuyerOrderTable
