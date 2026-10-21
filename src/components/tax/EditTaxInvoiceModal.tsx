import React, { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  availableBuyersList,
  availableBatchCodesList,
} from "./mockTaxData";
import {
  type TaxInvoiceItem,
  type TaxStatus,
  type BatchItemRef,
  type CountryCode,
  formatReadableDateTime,
} from "./types";

interface FormBatchItem {
  id: string;
  batchCode: string;
  country: CountryCode;
  itemName: string;
  qty: number;
  itemTax: number;
  isPhotocard: boolean;
}

interface EditTaxInvoiceModalProps {
  item: TaxInvoiceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: TaxInvoiceItem) => void;
}

interface EditFormProps {
  item: TaxInvoiceItem;
  onClose: () => void;
  onSave: (updated: TaxInvoiceItem) => void;
}

const EditTaxInvoiceForm: React.FC<EditFormProps> = ({
  item,
  onClose,
  onSave,
}) => {
  // Find buyer from available buyers
  const initialBuyer =
    availableBuyersList.find((b) => b.name === item.buyerName) ||
    availableBuyersList[0];

  const [selectedBuyerId, setSelectedBuyerId] = useState<string>(
    initialBuyer.id
  );
  const [period, setPeriod] = useState<string>(item.periodMonth || "September 2026");
  const [deadline, setDeadline] = useState<string>(() => {
    if (item.rawDeadline) {
      try {
        const d = new Date(item.rawDeadline);
        return d.toISOString().slice(0, 16);
      } catch {
        // fallback
      }
    }
    return "2026-09-25T23:59";
  });
  const [status, setStatus] = useState<TaxStatus>(item.status || "Pending");
  const [notes, setNotes] = useState<string>(
    item.notes || "Gabungan barang yang sudah tiba di warehouse Indonesia."
  );

  // Initialize batch items
  const [batchItems, setBatchItems] = useState<FormBatchItem[]>(() => {
    if (item.batches && item.batches.length > 0) {
      return item.batches.map((b, idx) => ({
        id: `batch-item-${idx}-${b.batchCode}`,
        batchCode: b.batchCode,
        country: b.country,
        itemName: b.itemName || "",
        qty: b.qty || 1,
        itemTax: b.itemTax || 0,
        isPhotocard: b.isPhotocard ?? true,
      }));
    }
    return [
      {
        id: "item-default-1",
        batchCode: "CH-015",
        country: "CH",
        itemName: "IVE Photocard Set",
        qty: 2,
        itemTax: 72000,
        isPhotocard: true,
      },
    ];
  });

  const handleAddItem = () => {
    const newItem: FormBatchItem = {
      id: `item-${Date.now()}`,
      batchCode: "CH-015",
      country: "CH",
      itemName: "",
      qty: 1,
      itemTax: 0,
      isPhotocard: true,
    };
    setBatchItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (batchItems.length <= 1) return;
    setBatchItems((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof FormBatchItem,
    value: string | number | boolean
  ) => {
    setBatchItems((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        if (field === "batchCode") {
          const found = availableBatchCodesList.find((c) => c.code === value);
          return {
            ...b,
            batchCode: String(value),
            country: found ? found.country : b.country,
          };
        }
        return {
          ...b,
          [field]: value,
        };
      })
    );
  };

  // Compute total tax amount from all items
  const totalCalculatedTax = batchItems.reduce(
    (sum, b) => sum + (Number(b.itemTax) || 0),
    0
  );
  const totalItemCount = batchItems.reduce(
    (sum, b) => sum + (Number(b.qty) || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentBuyer =
      availableBuyersList.find((b) => b.id === selectedBuyerId) || initialBuyer;

    const updatedBatches: BatchItemRef[] = batchItems.map((b) => ({
      batchCode: b.batchCode,
      country: b.country,
      itemName: b.itemName.trim() || "Item Kpop",
      qty: Math.max(1, Number(b.qty) || 1),
      isPhotocard: b.isPhotocard,
      itemTax: Math.max(0, Number(b.itemTax) || 0),
    }));

    const updatedInvoice: TaxInvoiceItem = {
      ...item,
      buyerName: currentBuyer.name,
      buyerHandle: currentBuyer.handle,
      buyerPhone: currentBuyer.phone,
      buyerLineId: currentBuyer.lineId,
      period: period,
      periodMonth: period,
      deadline: formatReadableDateTime(deadline),
      rawDeadline: new Date(deadline).toISOString(),
      status: status,
      batches: updatedBatches,
      totalItemsCount: totalItemCount,
      itemSummary: updatedBatches
        .map((b) => `${b.qty} ${b.isPhotocard ? "PC" : "Item"}`)
        .join(", "),
      totalAmount: totalCalculatedTax,
      notes: notes.trim(),
    };

    onSave(updatedInvoice);
    onClose();
  };

  // Payment proof status display text
  const getProofStatusText = () => {
    if (item.status === "Approved") {
      return `Proof verified · ${item.bankName || "BCA Transfer"}`;
    }
    if (item.hasProof) {
      return "Proof uploaded · awaiting approval";
    }
    return "No proof uploaded yet";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {/* Row 1: Buyer & Tax Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-semibold text-[#18181B] block mb-1.5">
            Buyer
          </label>
          <Select
            value={selectedBuyerId}
            onValueChange={setSelectedBuyerId}
          >
            <SelectTrigger className="w-full h-10 rounded-[12px] border-[#FBCFE8] bg-white text-xs text-[#18181B] focus:ring-[#EC4899]/20 focus:border-[#EC4899]">
              <SelectValue placeholder="Pilih buyer" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-[#FBCFE8] shadow-card max-h-56">
              {availableBuyersList.map((buyer) => (
                <SelectItem key={buyer.id} value={buyer.id}>
                  {buyer.name} ({buyer.handle})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#18181B] block mb-1.5">
            Tax Period
          </label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full h-10 rounded-[12px] border-[#FBCFE8] bg-white text-xs text-[#18181B] focus:ring-[#EC4899]/20 focus:border-[#EC4899]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-[#FBCFE8] shadow-card">
              <SelectItem value="September 2026">September 2026</SelectItem>
              <SelectItem value="Agustus 2026">Agustus 2026</SelectItem>
              <SelectItem value="Juli 2026">Juli 2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Deadline & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-semibold text-[#18181B] block mb-1.5 flex items-center justify-between">
            <span>Deadline (Tanggal &amp; Waktu)</span>
            <span className="text-[10px] text-[#71717A]">DateTime PRD</span>
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full h-10 px-3.5 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-semibold text-[#18181B] outline-none focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/20"
            />
          </div>
          <p className="text-[11px] text-[#71717A] mt-1">
            Format: {formatReadableDateTime(deadline)}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#18181B] block mb-1.5">
            Status
          </label>
          <Select
            value={status}
            onValueChange={(val) => setStatus(val as TaxStatus)}
          >
            <SelectTrigger className="w-full h-10 rounded-[12px] border-[#FBCFE8] bg-white text-xs text-[#18181B] focus:ring-[#EC4899]/20 focus:border-[#EC4899]">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent className="rounded-[16px] border-[#FBCFE8] shadow-card">
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section: Items from batches */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#18181B]">
              Items from batches
            </h4>
            <p className="text-[11px] text-[#71717A]">
              Enter tax amount for each item
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[10px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-xs font-semibold text-[#EC4899] transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add item</span>
          </button>
        </div>

        {/* Dynamic item cards */}
        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
          {batchItems.map((bItem) => (
            <div
              key={bItem.id}
              className="p-3.5 rounded-[16px] bg-[#FFFDFC] border border-[#FBCFE8]/80 space-y-2.5 relative group"
            >
              {batchItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(bItem.id)}
                  title="Hapus item"
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full text-[#71717A] hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Row 1: Batch & Item name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pr-6">
                <div>
                  <label className="text-[11px] font-semibold text-[#71717A] block mb-1">
                    Batch
                  </label>
                  <Select
                    value={bItem.batchCode}
                    onValueChange={(val) =>
                      handleUpdateItem(bItem.id, "batchCode", val)
                    }
                  >
                    <SelectTrigger className="w-full h-9 rounded-[10px] border-[#FBCFE8] bg-white text-xs text-[#18181B]">
                      <SelectValue placeholder="Pilih batch" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[14px] border-[#FBCFE8] shadow-card max-h-48">
                      {availableBatchCodesList.map((batch) => (
                        <SelectItem key={batch.code} value={batch.code}>
                          {batch.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#71717A] block mb-1">
                    Item name
                  </label>
                  <input
                    type="text"
                    value={bItem.itemName}
                    onChange={(e) =>
                      handleUpdateItem(bItem.id, "itemName", e.target.value)
                    }
                    placeholder="Nama item / merchandise"
                    required
                    className="w-full h-9 px-3 rounded-[10px] border border-[#FBCFE8] bg-white text-xs text-[#18181B] outline-none focus:border-[#EC4899]"
                  />
                </div>
              </div>

              {/* Row 2: Quantity & Tax amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#71717A] block mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={bItem.qty}
                    onChange={(e) =>
                      handleUpdateItem(bItem.id, "qty", Number(e.target.value))
                    }
                    required
                    className="w-full h-9 px-3 rounded-[10px] border border-[#FBCFE8] bg-white text-xs text-[#18181B] outline-none focus:border-[#EC4899]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#71717A] block mb-1">
                    Tax amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                      Rp
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={bItem.itemTax}
                      onChange={(e) =>
                        handleUpdateItem(
                          bItem.id,
                          "itemTax",
                          Number(e.target.value)
                        )
                      }
                      required
                      className="w-full h-9 pl-9 pr-3 rounded-[10px] border border-[#FBCFE8] bg-white text-xs font-semibold text-[#18181B] outline-none focus:border-[#EC4899]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calculated Total Tax preview */}
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-xs text-[#71717A] font-medium">
            Total Estimasi Tax ({batchItems.length} item):
          </span>
          <span className="text-xs font-bold text-[#EC4899]">
            Rp {totalCalculatedTax.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Section: Notes */}
      <div>
        <label className="text-xs font-semibold text-[#18181B] block mb-1.5">
          Notes
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add invoice notes or correction details..."
          className="w-full p-3 rounded-[12px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] outline-none focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/20 resize-none"
        />
      </div>

      {/* Section: Payment proof status bar matching wireframe */}
      <div className="rounded-[12px] bg-[#FFF5FA]/70 border border-[#FBCFE8]/60 px-4 py-3 flex items-center justify-between text-xs">
        <span className="text-[#71717A] font-medium">Payment proof</span>
        <span className="text-[#18181B] font-semibold">
          {getProofStatusText()}
        </span>
      </div>

      {/* Footer Buttons */}
      <DialogFooter className="pt-2 flex flex-row items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-[12px] border border-[#FBCFE8] bg-white hover:bg-[#FFF5FA] text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save changes</span>
        </button>
      </DialogFooter>
    </form>
  );
};

export const EditTaxInvoiceModal: React.FC<EditTaxInvoiceModalProps> = ({
  item,
  open,
  onOpenChange,
  onSave,
}) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-[24px] p-6 sm:p-7 border border-[#FBCFE8] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-[#18181B] tracking-tight">
              Edit Tagihan
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#71717A] mt-0.5">
            Combine items from one or more batches into a single buyer invoice.
          </DialogDescription>
        </DialogHeader>

        <EditTaxInvoiceForm
          key={item.id}
          item={item}
          onClose={() => onOpenChange(false)}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  );
};
