import React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { BuyerOption, OrderRow, CountryCode } from "@/types/batch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BuyerOrderTableProps {
  orderRows: OrderRow[];
  registeredBuyers: BuyerOption[];
  countryCode: CountryCode;
  currency: string;
  kursRate: number;
  overheadPerPc: number;
  feeNyelemBatch: number;
  onAddRow: () => void;
  onSetRowCount?: (count: number) => void;
  onRemoveRow: (id: string) => void;
  onUpdateRow: (id: string, field: keyof OrderRow, value: any) => void;
}

function formatIDR(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.round(val));
}

export const BuyerOrderTable: React.FC<BuyerOrderTableProps> = ({
  orderRows,
  registeredBuyers,
  countryCode,
  currency,
  kursRate,
  overheadPerPc,
  feeNyelemBatch,
  onAddRow,
  onSetRowCount,
  onRemoveRow,
  onUpdateRow,
}) => {
  const isJapan = countryCode === "JP";
  const isKorea = countryCode === "KR";
  const isIndonesia = countryCode === "INA";

  return (
    <Card className="gap-4">
      {/* Header & Row Controls */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-0">
        <div>
          <CardTitle>Daftar Pesanan Buyer (1 Row = 1 Pcs = 1 Buyer)</CardTitle>
          <p className="text-xs text-[#71717A] mt-0.5">
            {isKorea
              ? "Khusus KR: Masukkan harga won dalam format dibagi 10.000 (misal 2.000 won = 0.2)."
              : isJapan
                ? "Khusus JP: Harga jual ke buyer ditentukan manual oleh admin setelah total modal batch diketahui."
                : isIndonesia
                  ? "Khusus INA: Tanpa valas, harga asli dalam rupiah + fee GO 2k/pc."
                  : "Harga asli dikonversi otomatis dengan rate kurs harian + pembagian overhead ongkir & fee."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Dropdown 1-50 Total PC */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-600 whitespace-nowrap">
              Total PC:
            </span>
            <Select
              value={String(orderRows.length)}
              onValueChange={(val) => onSetRowCount?.(Number(val) || 1)}
            >
              <SelectTrigger
                size="sm"
                className="h-9 w-[96px] bg-white text-xs font-bold border-[#FBCFE8] text-[#EC4899] hover:bg-[#FFF5FA] focus:ring-pink-300 rounded-[12px] px-3 shadow-2xs [&>span]:whitespace-nowrap cursor-pointer transition-colors"
              >
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={String(num)} className="text-xs font-semibold">
                    {num} Pcs
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onAddRow}
            className="h-9 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-[#EC4899] hover:text-[#EC4899] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Baris</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        {/* Mobile Card List (md:hidden) */}
        <div className="md:hidden space-y-3.5">
          {orderRows.map((row, idx) => {
            const rawHarga = Number(row.hargaAsli) || 0;
            const basePriceIDR = isKorea
              ? rawHarga * 10000 * kursRate
              : isIndonesia
                ? rawHarga
                : rawHarga * kursRate;

            const itemHargaBersih =
              row.hargaBersih != null
                ? row.hargaBersih
                : Math.round(basePriceIDR + overheadPerPc);

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
                    <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-semibold border">
                      Pcs = 1 (Konstan)
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
                    onValueChange={(val) => onUpdateRow(row.id, "buyerId", val)}
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
                    Detail Barang / Item
                  </label>
                  <Input
                    type="text"
                    value={row.itemName}
                    placeholder="Nama barang / varian..."
                    onChange={(e) =>
                      onUpdateRow(row.id, "itemName", e.target.value)
                    }
                    className="border-[#FCE7F3] hover:border-[#FBCFE8]"
                  />
                </div>

                {/* Harga Asli Valas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                      Harga Asli {isKorea && "(Won/10k)"}
                    </label>
                    <div className="relative flex items-center">
                      <Input
                        type="number"
                        step={isKorea ? "0.01" : "1"}
                        value={row.hargaAsli || ""}
                        onChange={(e) =>
                          onUpdateRow(
                            row.id,
                            "hargaAsli",
                            Number(e.target.value) || 0,
                          )
                        }
                        className="pr-9 border-[#FCE7F3] hover:border-[#FBCFE8] font-semibold"
                        placeholder="0"
                      />
                      <span className="absolute right-2.5 text-[11px] font-semibold text-[#A1A1AA] pointer-events-none">
                        {currency}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                      Fee Nyelem
                    </label>
                    <div className="h-11 px-3 rounded-[12px] bg-white border border-[#FCE7F3] flex items-center text-xs font-semibold text-[#71717A]">
                      {isJapan
                        ? "Total Batch"
                        : `Rp ${(row.feeNyelem ?? feeNyelemBatch).toLocaleString("id-ID")}`}
                    </div>
                  </div>
                </div>

                {/* Khusus JP: Harga Jual Manual Input di Mobile */}
                {isJapan && (
                  <div>
                    <label className="block text-[11px] font-medium text-[#71717A] mb-1">
                      Harga Jual ke Buyer (IDR) &mdash; Manual Admin
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
                        value={row.hargaJualPerBuyer || ""}
                        onChange={(e) =>
                          onUpdateRow(
                            row.id,
                            "hargaJualPerBuyer",
                            Math.max(0, Number(e.target.value) || 0),
                          )
                        }
                        className="pl-9 border-[#FCE7F3] hover:border-[#FBCFE8] font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* Computed Total IDR / Tagihan for this card */}
                <div className="p-3 rounded-[12px] bg-white border border-[#FCE7F3] flex items-center justify-between">
                  <span className="text-[11px] text-[#71717A] font-medium">
                    {isJapan
                      ? "Tagihan Buyer (Manual):"
                      : "Harga Bersih (Inc. Fee):"}
                  </span>
                  {isJapan ? (
                    row.hargaJualPerBuyer && row.hargaJualPerBuyer > 0 ? (
                      <span className="text-xs font-bold text-[#EC4899]">
                        {formatIDR(Number(row.hargaJualPerBuyer) || 0)}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">
                        Belum diisi admin
                      </span>
                    )
                  ) : (
                    <span className="text-xs font-bold text-[#EC4899]">
                      {formatIDR(itemHargaBersih)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table Data Grid (hidden on mobile, visible on md+) */}
        <div className="hidden md:block overflow-x-auto">
          <div className="rounded-[16px] border border-[#FCE7F3] overflow-hidden bg-white">
            <Table className="min-w-[840px]">
              <TableHeader>
                <TableRow className="bg-[#FFF5FA] border-b border-[#FCE7F3] hover:bg-[#FFF5FA]">
                  <TableHead className="w-12 text-center text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                    NO
                  </TableHead>
                  <TableHead className="min-w-[190px] text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                    NAMA BUYER (AKUN)
                  </TableHead>
                  <TableHead className="min-w-[170px] text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                    DETAIL BARANG
                  </TableHead>
                  <TableHead className="w-20 text-center text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                    PCS
                  </TableHead>
                  <TableHead className="w-36 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                    HARGA ASLI {isKorea && "(WON/10K)"}
                  </TableHead>
                  {!isJapan && (
                    <TableHead className="w-28 text-center text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                      FEE NYELEM
                    </TableHead>
                  )}
                  {isJapan && (
                    <TableHead className="w-44 text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                      HARGA JUAL (IDR)
                    </TableHead>
                  )}
                  <TableHead className="w-36 text-right text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                    {isJapan ? "TAGIHAN BUYER" : "HARGA BERSIH (IDR)"}
                  </TableHead>
                  <TableHead className="w-14 text-center text-[11px] font-bold text-[#71717A] tracking-wider uppercase">
                    AKSI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderRows.map((row, idx) => {
                  const rawHarga = Number(row.hargaAsli) || 0;
                  const basePriceIDR = isKorea
                    ? rawHarga * 10000 * kursRate
                    : isIndonesia
                      ? rawHarga
                      : rawHarga * kursRate;

                  const itemHargaBersih =
                    row.hargaBersih != null
                      ? row.hargaBersih
                      : Math.round(basePriceIDR + overheadPerPc);

                  return (
                    <TableRow
                      key={row.id}
                      className="hover:bg-[#FFF5FA]/30 transition-colors border-b border-[#FCE7F3]"
                    >
                      <TableCell className="text-center font-medium text-[#71717A]">
                        {idx + 1}
                      </TableCell>

                      {/* Buyer Select */}
                      <TableCell>
                        <Select
                          value={row.buyerId}
                          onValueChange={(val) =>
                            onUpdateRow(row.id, "buyerId", val)
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className="border-[#FCE7F3] hover:border-[#FBCFE8]"
                          >
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
                          size="sm"
                          type="text"
                          value={row.itemName}
                          placeholder="Nama barang..."
                          onChange={(e) =>
                            onUpdateRow(row.id, "itemName", e.target.value)
                          }
                          className="border-[#FCE7F3] hover:border-[#FBCFE8]"
                        />
                      </TableCell>

                      {/* Pcs = Konstan 1 */}
                      <TableCell className="text-center">
                        <span className="inline-block px-2.5 py-1 rounded-[6px] bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700">
                          1 pc
                        </span>
                      </TableCell>

                      {/* Harga Asli Valas */}
                      <TableCell>
                        <div className="relative flex items-center">
                          <Input
                            size="sm"
                            type="number"
                            step={isKorea ? "0.01" : "1"}
                            value={row.hargaAsli || ""}
                            onChange={(e) =>
                              onUpdateRow(
                                row.id,
                                "hargaAsli",
                                Number(e.target.value) || 0,
                              )
                            }
                            className="pr-11 font-semibold border-[#FCE7F3] hover:border-[#FBCFE8]"
                            placeholder="0"
                          />
                          <span className="absolute right-3 text-[11px] font-semibold text-[#A1A1AA] pointer-events-none">
                            {currency}
                          </span>
                        </div>
                      </TableCell>

                      {/* Fee Nyelem per Row (CH, TH, KR, INA) */}
                      {!isJapan && (
                        <TableCell className="text-center">
                          <span className="text-xs font-semibold text-[#71717A] bg-[#FFF5FA] px-2 py-1 rounded border border-[#FBCFE8]">
                            Rp{" "}
                            {(row.feeNyelem ?? feeNyelemBatch).toLocaleString(
                              "id-ID",
                            )}
                          </span>
                        </TableCell>
                      )}

                      {/* Khusus JP: Harga Jual Manual Input */}
                      {isJapan && (
                        <TableCell>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-[11px] font-semibold text-[#A1A1AA] pointer-events-none">
                              Rp
                            </span>
                            <Input
                              size="sm"
                              type="number"
                              min="0"
                              step="1000"
                              placeholder="0"
                              value={row.hargaJualPerBuyer || ""}
                              onChange={(e) =>
                                onUpdateRow(
                                  row.id,
                                  "hargaJualPerBuyer",
                                  Math.max(0, Number(e.target.value) || 0),
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
                              {formatIDR(Number(row.hargaJualPerBuyer) || 0)}
                            </span>
                          ) : (
                            <span className="text-xs text-amber-600 font-medium">
                              Belum diisi
                            </span>
                          )
                        ) : (
                          <span className="font-bold text-[13px] text-[#18181B]">
                            {formatIDR(itemHargaBersih)}
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {!isJapan && (
          <p className="text-[12px] text-[#71717A] pt-1">
            Total IDR per baris sudah termasuk pembagian ongkir &amp; fee batch
            secara proporsional per pcs.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BuyerOrderTable;
