import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "./formatters";
import type { PaymentMethodSummary } from "@/types/reports";

interface PaymentSummaryTabProps {
  methodSummaries: PaymentMethodSummary[];
}

export const PaymentSummaryTab: React.FC<PaymentSummaryTabProps> = ({
  methodSummaries,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState("ALL");

  const filteredSummaries = useMemo(() => {
    return methodSummaries.filter((m) => {
      const matchSearch =
        !searchQuery ||
        m.method.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [methodSummaries, searchQuery]);

  const totalPaymentsCount = filteredSummaries.reduce(
    (sum, m) => sum + m.paymentCount,
    0
  );

  const totalAmountSum = filteredSummaries.reduce(
    (sum, m) => sum + m.totalAmount,
    0
  );

  return (
    <div className="space-y-4">
      {/* Search Records & Period Filter Bar Sesuai Screenshot */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white p-2.5 rounded-[16px] border border-[#FBCFE8]/60 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA] pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899] bg-[#FFF5FA]/20"
          />
        </div>

        <div className="w-full sm:w-40">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger size="sm" className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Periode</SelectItem>
              <SelectItem value="September 2026">September 2026</SelectItem>
              <SelectItem value="Agustus 2026">Agustus 2026</SelectItem>
              <SelectItem value="Juli 2026">Juli 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table: Payment Methods Summary */}
      <Card className="rounded-[20px] border border-[#FBCFE8]/60 shadow-xs bg-white overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#FFF5FA]/60">
              <TableRow className="border-[#FBCFE8]/30 hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-[#18181B] pl-6 py-3.5">
                  Payment method
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B]">
                  Number of payments
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B]">
                  Total amount
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B]">
                  Share
                </TableHead>
                <TableHead className="text-xs font-semibold text-[#18181B] pr-6">
                  Last payment
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredSummaries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-28 text-center text-xs text-[#71717A]"
                  >
                    Tidak ada data metode pembayaran.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSummaries.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-[#FBCFE8]/30 hover:bg-[#FFF5FA]/40 transition-colors"
                  >
                    <TableCell className="font-semibold text-xs text-[#18181B] pl-6 py-3.5">
                      {row.method}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-[#71717A]">
                      {row.paymentCount}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-[#18181B]">
                      {formatRupiah(row.totalAmount)}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-[#71717A]">
                      {row.sharePercent}%
                    </TableCell>
                    <TableCell className="text-xs text-[#71717A] pr-6">
                      {row.lastPaymentTime}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

            {filteredSummaries.length > 0 && (
              <TableFooter className="bg-[#FFF5FA]/40 border-t border-[#FBCFE8]/40 font-semibold text-xs text-[#18181B]">
                <TableRow>
                  <TableCell className="pl-6 py-3.5 font-bold">Total</TableCell>
                  <TableCell className="text-xs font-bold text-[#18181B]">
                    {totalPaymentsCount}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-[#EC4899]">
                    {formatRupiah(totalAmountSum)}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-[#18181B]">
                    100%
                  </TableCell>
                  <TableCell className="pr-6 text-[11px] text-[#71717A]">
                    Rekap Terkini
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
