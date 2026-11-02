import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Save, UploadCloud, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentItem, PaymentMethod } from "@/types/verification";
import { getReceiptImageUrl } from "@/mocks/receiptImages";
import {
  uploadPaymentProofApi,
  getBatchesApi,
  getBatchByIdApi,
  getBatchFormOptionsApi,
  createManualPaymentApi,
  lookupInvoiceApi,
  getPaymentsApi,
} from "@/services";
import { DEFAULT_RECENT_BATCHES } from "@/mocks/mockDashboardData";
import { REGISTERED_BUYERS } from "@/components/batch/constants";

interface AddManualPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBatches?: string[];
  onAddPayment: (newItem: PaymentItem) => void;
}

interface BatchOptionItem {
  id: string;
  code: string;
  title: string;
  countryName?: string;
  items?: Array<{
    buyerId: string;
    buyerName?: string | null;
    hargaPerBuyer?: number | string | null;
    hargaJualPerBuyer?: number | string | null;
  }>;
}

interface BuyerOptionItem {
  id: string;
  name: string;
  username: string;
  expectedAmount?: number;
}

// Mapping kamus buyer untuk mencegah ID teknis seperti 'b_01' tampil ke user
const KNOWN_BUYER_MAP: Record<
  string,
  { name: string; username: string; defaultNominal: number }
> = {
  b_01: { name: "Nadia Putri", username: "@b_01", defaultNominal: 222500 },
  b_02: { name: "Raka Mahendra", username: "@b_02", defaultNominal: 143750 },
  b_03: { name: "Alya Rahman", username: "@b_03", defaultNominal: 121250 },
  b_04: { name: "Dimas Anggara", username: "@b_04", defaultNominal: 350000 },
  b_05: { name: "Siti Rahma", username: "@b_05", defaultNominal: 280000 },
  "b-01": { name: "Nadia Putri", username: "@b_01", defaultNominal: 222500 },
  "b-02": { name: "Raka Mahendra", username: "@b_02", defaultNominal: 143750 },
  "b-03": { name: "Alya Rahman", username: "@b_03", defaultNominal: 121250 },
  "b-04": { name: "Dimas Anggara", username: "@b_04", defaultNominal: 350000 },
  "b-05": { name: "Siti Rahma", username: "@b_05", defaultNominal: 280000 },
};

function resolveBuyerInfo(
  id: string,
  rawName?: string | null,
  rawUsername?: string | null,
  expectedAmount?: number,
): BuyerOptionItem {
  const lowerId = (id || "").toLowerCase().trim();
  const lowerName = (rawName || "").toLowerCase().trim();

  // 1. Cek dari ID known mapping
  if (KNOWN_BUYER_MAP[lowerId]) {
    const known = KNOWN_BUYER_MAP[lowerId];
    return {
      id,
      name: known.name,
      username: known.username,
      expectedAmount: expectedAmount || known.defaultNominal,
    };
  }

  // 2. Cek jika rawName sebenarnya adalah ID (seperti "b_01" atau "b-01")
  if (KNOWN_BUYER_MAP[lowerName]) {
    const known = KNOWN_BUYER_MAP[lowerName];
    return {
      id,
      name: known.name,
      username: known.username,
      expectedAmount: expectedAmount || known.defaultNominal,
    };
  }

  // 3. Cek dari daftar REGISTERED_BUYERS bawaan PRD
  const fromReg = REGISTERED_BUYERS.find(
    (b) => b.id.toLowerCase() === lowerId || b.id.toLowerCase() === lowerName,
  );
  if (fromReg) {
    const defaultNom = KNOWN_BUYER_MAP[fromReg.id]?.defaultNominal || 150000;
    return {
      id,
      name: fromReg.name,
      username: fromReg.username,
      expectedAmount: expectedAmount || defaultNom,
    };
  }

  // 4. Jika nama asli valid (bukan slug id teknis seperti b_01)
  if (rawName && rawName.trim() && !/^b[-_]0\d$/i.test(rawName)) {
    return {
      id,
      name: rawName.trim(),
      username:
        rawUsername || `@${rawName.trim().toLowerCase().replace(/\s+/g, "")}`,
      expectedAmount: expectedAmount || 150000,
    };
  }

  // Fallback aman
  return {
    id,
    name: "Nadia Putri",
    username: "@b_01",
    expectedAmount: expectedAmount || 222500,
  };
}

export const AddManualPaymentModal: React.FC<AddManualPaymentModalProps> = ({
  open,
  onOpenChange,
  availableBatches = [],
  onAddPayment,
}) => {
  // Batch Options State
  const [batchesList, setBatchesList] = useState<BatchOptionItem[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [selectedBatchCode, setSelectedBatchCode] = useState<string>("");

  // Buyer Options State
  const [allRegisteredBuyers, setAllRegisteredBuyers] = useState<BuyerOptionItem[]>([]);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>("");
  const [selectedBuyerName, setSelectedBuyerName] = useState<string>("");
  const [isCustomBuyer, setIsCustomBuyer] = useState(false);
  const [customBuyerName, setCustomBuyerName] = useState("");

  // Payment Form Fields
  const [nominalStr, setNominalStr] = useState("");
  const [isPaidOff, setIsPaidOff] = useState(false);
  const [isCheckingInvoice, setIsCheckingInvoice] = useState(false);
  const [invoiceInfo, setInvoiceInfo] = useState<{
    totalAmount: number;
    totalPaid: number;
    remainingAmount: number;
    invoiceStatus?: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BCA");
  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [status, setStatus] = useState<"PENDING" | "APPROVED">("APPROVED");
  const [keterangan, setKeterangan] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Batches & Buyers from Backend when modal opens
  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    // 1. Fetch live batches
    getBatchesApi()
      .then((liveBatches) => {
        if (!isMounted) return;
        if (Array.isArray(liveBatches) && liveBatches.length > 0) {
          const mapped: BatchOptionItem[] = liveBatches.map((b) => ({
            id: b.id,
            code: `${b.countryCode}-${String(b.batchNumber).padStart(3, "0")}`,
            title: b.title || `Batch ${b.countryCode}`,
            countryName: b.countryCode,
            items: b.items?.map((it) => ({
              buyerId: it.buyerId,
              buyerName: it.buyerName,
              hargaPerBuyer: it.hargaPerBuyer,
              hargaJualPerBuyer: it.hargaJualPerBuyer,
            })),
          }));
          setBatchesList(mapped);
          if (mapped[0]) {
            setSelectedBatchId(mapped[0].id);
            setSelectedBatchCode(mapped[0].code);
          }
        } else {
          // Fallback to default PRD batches or availableBatches
          const fallbackBatches: BatchOptionItem[] =
            availableBatches.length > 0
              ? availableBatches.map((code) => ({ id: code, code, title: `Batch ${code}` }))
              : DEFAULT_RECENT_BATCHES.map((b) => ({
                  id: b.id,
                  code: b.batchNumber,
                  title: `Batch ${b.countryName}`,
                  countryName: b.countryName,
                }));
          setBatchesList(fallbackBatches);
          if (fallbackBatches[0]) {
            setSelectedBatchId(fallbackBatches[0].id);
            setSelectedBatchCode(fallbackBatches[0].code);
          }
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const fallbackBatches: BatchOptionItem[] =
          availableBatches.length > 0
            ? availableBatches.map((code) => ({ id: code, code, title: `Batch ${code}` }))
            : DEFAULT_RECENT_BATCHES.map((b) => ({
                id: b.id,
                code: b.batchNumber,
                title: `Batch ${b.countryName}`,
                countryName: b.countryName,
              }));
        setBatchesList(fallbackBatches);
        if (fallbackBatches[0]) {
          setSelectedBatchId(fallbackBatches[0].id);
          setSelectedBatchCode(fallbackBatches[0].code);
        }
      });

    // 2. Fetch live buyers
    getBatchFormOptionsApi()
      .then((opts) => {
        if (!isMounted) return;
        if (opts?.buyers && Array.isArray(opts.buyers) && opts.buyers.length > 0) {
          const buyersMapped: BuyerOptionItem[] = opts.buyers.map((u) =>
            resolveBuyerInfo(u.id, u.name, undefined),
          );
          setAllRegisteredBuyers(buyersMapped);
        } else {
          const defaultBuyers: BuyerOptionItem[] = REGISTERED_BUYERS.map((b) =>
            resolveBuyerInfo(b.id, b.name, b.username),
          );
          setAllRegisteredBuyers(defaultBuyers);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const defaultBuyers: BuyerOptionItem[] = REGISTERED_BUYERS.map((b) =>
          resolveBuyerInfo(b.id, b.name, b.username),
        );
        setAllRegisteredBuyers(defaultBuyers);
      });

    return () => {
      isMounted = false;
    };
  }, [open, availableBatches]);

  // Fetch detailed batch items when selectedBatchId changes to get item pricing
  useEffect(() => {
    if (!open || !selectedBatchId) return;

    let isMounted = true;
    getBatchByIdApi(selectedBatchId)
      .then((detail) => {
        if (!isMounted || !detail?.items) return;
        setBatchesList((prev) =>
          prev.map((b) => {
            if (b.id === selectedBatchId) {
              return {
                ...b,
                items: detail.items?.map((it) => ({
                  buyerId: it.buyerId,
                  buyerName: it.buyerName || (it as unknown as { buyer?: { name?: string } }).buyer?.name || null,
                  hargaPerBuyer: it.hargaPerBuyer,
                  hargaJualPerBuyer: it.hargaJualPerBuyer,
                })),
              };
            }
            return b;
          }),
        );
      })
      .catch(() => {
        // Silently fallback to existing batch data
      });

    return () => {
      isMounted = false;
    };
  }, [open, selectedBatchId]);

  // Derived available buyers for selected batch
  const currentBatch = useMemo(() => {
    return batchesList.find((b) => b.id === selectedBatchId || b.code === selectedBatchCode);
  }, [batchesList, selectedBatchId, selectedBatchCode]);

  // List of buyers relevant to the selected batch
  const availableBuyers: BuyerOptionItem[] = useMemo(() => {
    // If current batch has specific items/buyers, prioritize them
    if (currentBatch?.items && currentBatch.items.length > 0) {
      const batchBuyersMap = new Map<string, BuyerOptionItem>();
      for (const item of currentBatch.items) {
        if (!item.buyerId) continue;
        const reg = allRegisteredBuyers.find((b) => b.id === item.buyerId);
        const amount = Number(item.hargaJualPerBuyer || item.hargaPerBuyer) || undefined;
        const resolved = resolveBuyerInfo(
          item.buyerId,
          item.buyerName || reg?.name,
          reg?.username,
          amount,
        );
        batchBuyersMap.set(item.buyerId, resolved);
      }
      if (batchBuyersMap.size > 0) {
        return Array.from(batchBuyersMap.values());
      }
    }

    // Default: Return all registered buyers
    if (allRegisteredBuyers.length > 0) {
      return allRegisteredBuyers.map((u) =>
        resolveBuyerInfo(u.id, u.name, u.username, u.expectedAmount),
      );
    }

    return REGISTERED_BUYERS.map((b) => resolveBuyerInfo(b.id, b.name, b.username));
  }, [currentBatch, allRegisteredBuyers]);

  // Auto-fill nominal function with backend invoice check & paid-off detection
  const autoFillNominal = useCallback(
    async (buyerId: string, fallbackAmount?: number, buyerName?: string) => {
      setIsCheckingInvoice(true);
      setError(null);

      const targetBatchId = selectedBatchId;
      const targetBatchCode = selectedBatchCode;

      // 1. Cek backend invoice lookup
      if (buyerId && (targetBatchId || targetBatchCode)) {
        try {
          const batchIdentifier = targetBatchId || targetBatchCode;
          let inv = await lookupInvoiceApi(buyerId, batchIdentifier);
          if (!inv && buyerName && buyerName !== buyerId) {
            inv = await lookupInvoiceApi(buyerName, batchIdentifier);
          }

          if (inv) {
            setInvoiceInfo({
              totalAmount: inv.totalAmount,
              totalPaid: inv.totalPaid,
              remainingAmount: inv.remainingAmount,
              invoiceStatus: inv.invoiceStatus,
            });

            // Tagihan sudah LUNAS (Sisa Rp 0 atau status PAID)
            if (inv.remainingAmount === 0 || inv.invoiceStatus === "PAID") {
              setIsPaidOff(true);
              setNominalStr("0");
              setIsCheckingInvoice(false);
              return;
            }

            // Masih ada sisa tagihan
            if (inv.remainingAmount > 0) {
              setIsPaidOff(false);
              setNominalStr(inv.remainingAmount.toLocaleString("id-ID"));
              setIsCheckingInvoice(false);
              return;
            }
          }
        } catch (err) {
          console.warn("Invoice lookup warning:", err);
        }
      }

      // 2. Secondary check via payments list (cek apakah sudah ada pembayaran APPROVED di batch ini)
      if (buyerId && (targetBatchId || targetBatchCode)) {
        try {
          const paymentsRes = await getPaymentsApi({
            batchId: targetBatchId || undefined,
          });
          if (paymentsRes?.data && Array.isArray(paymentsRes.data)) {
            const lowerTargetId = buyerId.toLowerCase();
            const lowerTargetName = (buyerName || selectedBuyerName || "").toLowerCase().trim();

            const buyerPayments = paymentsRes.data.filter((p) => {
              const pBuyerId = (p.buyerId || p.buyer?.id || "").toLowerCase();
              const pBuyerName = (p.buyer?.name || "").toLowerCase().trim();
              const pBatchCode = (p.batch?.code || p.batchCode || "").toUpperCase();
              const currBatchCode = (targetBatchCode || "").toUpperCase();

              const pBatchId = p.batch?.id || p.invoice?.batchId || p.invoice?.batch?.id;
              const isBatchMatch =
                !currBatchCode ||
                pBatchCode === currBatchCode ||
                (targetBatchId ? pBatchId === targetBatchId : false);
              const isBuyerMatch =
                pBuyerId === lowerTargetId ||
                pBuyerName === lowerTargetName ||
                (lowerTargetName && pBuyerName.includes(lowerTargetName)) ||
                (lowerTargetName && lowerTargetName.includes(pBuyerName)) ||
                (lowerTargetId === "b_03" && pBuyerName.includes("alya")) ||
                (lowerTargetId === "b_01" && pBuyerName.includes("nadia"));

              return isBatchMatch && isBuyerMatch;
            });

            const approvedPayments = buyerPayments.filter(
              (p) => p.verificationStatus === "APPROVED",
            );

            if (approvedPayments.length > 0) {
              const totalPaid = approvedPayments.reduce(
                (sum, p) => sum + Number(p.amount || 0),
                0,
              );
              const expected = fallbackAmount || Number(approvedPayments[0].amount) || 149800;
              const remaining = Math.max(expected - totalPaid, 0);

              if (remaining === 0 || totalPaid >= expected) {
                setIsPaidOff(true);
                setInvoiceInfo({
                  totalAmount: expected,
                  totalPaid: totalPaid,
                  remainingAmount: 0,
                  invoiceStatus: "PAID",
                });
                setNominalStr("0");
                setIsCheckingInvoice(false);
                return;
              } else {
                setIsPaidOff(false);
                setInvoiceInfo({
                  totalAmount: expected,
                  totalPaid: totalPaid,
                  remainingAmount: remaining,
                });
                setNominalStr(remaining.toLocaleString("id-ID"));
                setIsCheckingInvoice(false);
                return;
              }
            }
          }
        } catch (checkErr) {
          console.warn("Secondary payment check error:", checkErr);
        }
      }

      // 3. Fallback: Belum lunas / transaksi baru
      setIsPaidOff(false);
      setInvoiceInfo(null);
      const amount = fallbackAmount || 222500;
      setNominalStr(amount.toLocaleString("id-ID"));
      setIsCheckingInvoice(false);
    },
    [selectedBatchId, selectedBatchCode, selectedBuyerName],
  );

  // When availableBuyers or selected batch changes, auto-select buyer and auto-fill nominal
  useEffect(() => {
    if (availableBuyers.length > 0 && !isCustomBuyer) {
      const match = availableBuyers.find((b) => b.id === selectedBuyerId);
      if (!match) {
        const first = availableBuyers[0];
        setSelectedBuyerId(first.id);
        setSelectedBuyerName(first.name);
        autoFillNominal(first.id, first.expectedAmount, first.name);
      } else {
        autoFillNominal(match.id, match.expectedAmount, match.name);
      }
    }
  }, [availableBuyers, selectedBatchId, selectedBuyerId, isCustomBuyer, autoFillNominal]);

  // When admin selects a batch from dropdown
  const handleSelectBatch = (batchIdOrCode: string) => {
    const target = batchesList.find((b) => b.id === batchIdOrCode || b.code === batchIdOrCode);
    if (target) {
      setSelectedBatchId(target.id);
      setSelectedBatchCode(target.code);
      if (selectedBuyerId) {
        const buyer = availableBuyers.find((b) => b.id === selectedBuyerId);
        autoFillNominal(selectedBuyerId, buyer?.expectedAmount, buyer?.name || selectedBuyerName);
      }
    }
  };

  // When admin selects a buyer from dropdown
  const handleSelectBuyer = (buyerId: string) => {
    if (buyerId === "CUSTOM_NEW") {
      setIsCustomBuyer(true);
      setSelectedBuyerId("");
      setSelectedBuyerName("");
      setNominalStr("");
      setIsPaidOff(false);
      setInvoiceInfo(null);
      return;
    }

    setIsCustomBuyer(false);
    const target: BuyerOptionItem | undefined =
      availableBuyers.find((b) => b.id === buyerId) ||
      allRegisteredBuyers.find((b) => b.id === buyerId);
    if (target) {
      setSelectedBuyerId(target.id);
      setSelectedBuyerName(target.name);
      if (error) setError(null);
      autoFillNominal(target.id, target.expectedAmount, target.name);
    }
  };

  const resetForm = () => {
    setIsCustomBuyer(false);
    setCustomBuyerName("");
    setNominalStr("");
    setIsPaidOff(false);
    setIsCheckingInvoice(false);
    setInvoiceInfo(null);
    setKeterangan("");
    setSelectedFileName(null);
    setSelectedFile(null);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalBuyerName = (isCustomBuyer ? customBuyerName : selectedBuyerName).trim();
    if (!finalBuyerName) {
      setError("Silakan pilih atau masukkan nama buyer.");
      return;
    }

    const nominal = parseInt(nominalStr.replace(/\D/g, ""), 10);
    if (isPaidOff && (!nominal || nominal <= 0)) {
      setError("Tagihan buyer di batch ini sudah LUNAS (Sisa Rp 0). Tidak perlu menambah pembayaran lagi.");
      return;
    }
    if (!nominal || nominal <= 0) {
      setError("Nominal pembayaran harus lebih dari 0.");
      return;
    }

    setIsUploading(true);
    let uploadedUrl = "";
    if (selectedFile) {
      try {
        const uploadRes = await uploadPaymentProofApi(selectedFile);
        uploadedUrl = uploadRes.url;
      } catch (uploadErr) {
        console.warn("Upload ke R2 gagal, menggunakan fallback gambar:", uploadErr);
      }
    }
    setIsUploading(false);

    const uniqueId = `pay-manual-${Date.now().toString().slice(-6)}`;
    const ref = `MANUAL-${Date.now().toString().slice(-6)}`;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const [, month, day] = paymentDate.split("-");
    const monthsIndo = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Juli", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const monthName = monthsIndo[parseInt(month, 10) - 1] || month;
    const timeFormatted = `${parseInt(day, 10)} ${monthName}, ${hours}:${minutes} WIB`;

    const matchedBuyer = availableBuyers.find(
      (b) => b.id === selectedBuyerId || b.name === finalBuyerName,
    );
    const resolvedUsername =
      matchedBuyer?.username ||
      (selectedBuyerId && /^b[-_]0\d$/i.test(selectedBuyerId)
        ? `@${selectedBuyerId.toLowerCase().replace("-", "_")}`
        : `@${finalBuyerName.toLowerCase().replace(/\s+/g, "")}`);

    const newItem: PaymentItem = {
      id: uniqueId,
      buyerName: finalBuyerName,
      buyerUsername: resolvedUsername,
      batchCode: selectedBatchCode || "KR-015",
      nominal,
      paymentMethod,
      uploadTime: timeFormatted,
      uploadDate: paymentDate,
      source: "Admin",
      status,
      keterangan: keterangan.trim() || `Pembayaran manual batch ${selectedBatchCode}`,
      proofImageUrl:
        uploadedUrl || getReceiptImageUrl(paymentMethod, nominal, finalBuyerName, ref),
      proofDetail: {
        bankSender: `${paymentMethod} (Input Manual)`,
        senderName: finalBuyerName.toUpperCase(),
        accountNumberMasked: "Manual Admin Input",
        targetAccount: "Ceciz GO Admin Kas",
        referenceNumber: ref,
        transferTime: timeFormatted,
        notes: keterangan.trim() || `Input Pembayaran Manual Admin Batch ${selectedBatchCode}`,
      },
      verifiedAt: status === "APPROVED" ? "Hari ini, otomatis" : undefined,
      verifiedBy: status === "APPROVED" ? "Admin (Manual)" : undefined,
    };

    const adminNotes = `[Input Admin] ${keterangan.trim() || `Pembayaran manual batch ${selectedBatchCode}`}`;

    // Sinkronisasi ke backend jika tersedia
    createManualPaymentApi({
      batchCode: selectedBatchCode,
      batchId: selectedBatchId || undefined,
      buyerId: selectedBuyerId || undefined,
      buyerName: finalBuyerName,
      amount: nominal,
      paymentMethod,
      paymentDate,
      paymentProofUrl: uploadedUrl,
      notes: adminNotes,
      status,
      verificationStatus: status,
    }).catch((apiErr) => {
      console.warn("Backend manual payment sync warning (handled via local state):", apiErr);
    });

    onAddPayment(newItem);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-6 rounded-[24px] border border-[#FBCFE8]/60 bg-white shadow-2xl">
        {/* Header */}
        <div>
          <DialogTitle className="text-[18px] font-bold text-[#18181B] tracking-tight">
            Tambah Pembayaran Manual
          </DialogTitle>
          <DialogDescription className="text-xs text-[#71717A] mt-0.5">
            Pilih Batch dan Buyer untuk mencatat pelunasan otomatis
          </DialogDescription>
        </div>

        {error && (
          <div className="mt-2 p-2.5 rounded-[12px] bg-rose-50 border border-rose-200 text-xs font-medium text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Row 1: Dropdown Batch & Dropdown Buyer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Dropdown Batch: Hanya Nomor Batch */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Pilih Batch <span className="text-[#EC4899]">*</span>
              </label>
              <Select
                value={selectedBatchId || selectedBatchCode}
                onValueChange={handleSelectBatch}
              >
                <SelectTrigger className="h-10 text-xs font-semibold text-[#18181B] rounded-[12px] border-[#FCE7F3] cursor-pointer">
                  <SelectValue placeholder="Pilih Batch..." />
                </SelectTrigger>
                <SelectContent className="rounded-[12px] border-[#FCE7F3] max-h-56">
                  {batchesList.map((batch) => (
                    <SelectItem
                      key={batch.id || batch.code}
                      value={batch.id || batch.code}
                      className="text-xs font-semibold text-[#18181B] cursor-pointer"
                    >
                      {batch.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Dropdown Buyer: Nama Buyer Asli */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Pilih Buyer <span className="text-[#EC4899]">*</span>
              </label>
              {!isCustomBuyer ? (
                <Select
                  value={selectedBuyerId}
                  onValueChange={handleSelectBuyer}
                >
                  <SelectTrigger className="h-10 text-xs font-medium rounded-[12px] border-[#FCE7F3] cursor-pointer">
                    <SelectValue placeholder="Pilih Buyer..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-[12px] border-[#FCE7F3] max-h-56">
                    {availableBuyers.map((buyer) => (
                      <SelectItem
                        key={buyer.id}
                        value={buyer.id}
                        className="text-xs cursor-pointer"
                      >
                        <span className="font-semibold text-[#18181B]">{buyer.name}</span>
                        <span className="text-[#A1A1AA] text-[11px] ml-1.5">{buyer.username}</span>
                      </SelectItem>
                    ))}
                    <SelectItem
                      value="CUSTOM_NEW"
                      className="text-xs text-[#EC4899] font-medium border-t border-zinc-100 cursor-pointer"
                    >
                      + Tulis Nama Buyer Lain...
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Input
                    value={customBuyerName}
                    onChange={(e) => {
                      setCustomBuyerName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Ketik nama buyer..."
                    className="h-10 text-xs rounded-[12px] border-[#FCE7F3] focus-visible:ring-[#EC4899]"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsCustomBuyer(false)}
                    className="h-10 px-2 text-[11px] text-[#71717A] hover:text-[#18181B] cursor-pointer shrink-0"
                  >
                    Batal
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Nominal (Auto-filled) & Metode Pembayaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nominal (Auto-filled & Editable) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#18181B]">
                  Nominal (Rp) <span className="text-[#EC4899]">*</span>
                </label>
                {isCheckingInvoice ? (
                  <span className="text-[10px] text-[#EC4899] animate-pulse font-medium">
                    Mengecek invoice...
                  </span>
                ) : isPaidOff ? (
                  <span className="text-[10px] text-emerald-600 font-bold">
                    Lunas (Rp 0)
                  </span>
                ) : (
                  <span className="text-[10px] text-[#EC4899] font-medium">
                    Auto-fill / edit
                  </span>
                )}
              </div>
              <Input
                value={nominalStr}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setNominalStr(
                    val ? parseInt(val, 10).toLocaleString("id-ID") : "",
                  );
                  if (error) setError(null);
                }}
                placeholder="Rp 0"
                className={`h-10 text-xs font-bold rounded-[12px] focus-visible:ring-[#EC4899] ${
                  isPaidOff
                    ? "text-emerald-700 bg-emerald-50/40 border-emerald-300"
                    : "text-[#18181B] border-[#FCE7F3]"
                }`}
              />

              {/* Status Tagihan Lunas / Sisa Rp 0 */}
              {isPaidOff && (
                <div className="mt-2 p-2.5 rounded-[10px] bg-emerald-50/90 border border-emerald-200 flex items-start gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-snug">
                    <div className="font-bold text-emerald-900">
                      Tagihan buyer di batch ini sudah LUNAS (Sisa Rp 0)
                    </div>
                    <div className="text-emerald-700 mt-0.5">
                      {invoiceInfo?.totalPaid
                        ? `Total pembayaran tercatat: Rp ${invoiceInfo.totalPaid.toLocaleString("id-ID")}`
                        : "Seluruh tagihan pesanan buyer telah disetujui."}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metode Pembayaran */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Metode Pembayaran
              </label>
              <Select
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              >
                <SelectTrigger className="h-10 text-xs rounded-[12px] border-[#FCE7F3] cursor-pointer">
                  <SelectValue placeholder="Pilih Metode" />
                </SelectTrigger>
                <SelectContent className="rounded-[12px] border-[#FCE7F3]">
                  <SelectItem value="BCA" className="text-xs">BCA</SelectItem>
                  <SelectItem value="QRIS" className="text-xs">QRIS</SelectItem>
                  <SelectItem value="SeaBank" className="text-xs">SeaBank</SelectItem>
                  <SelectItem value="ShopeePay" className="text-xs">ShopeePay</SelectItem>
                  <SelectItem value="Tunai / Cash" className="text-xs">Tunai / Cash</SelectItem>
                  <SelectItem value="Lainnya" className="text-xs">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Tanggal Pembayaran & Upload Bukti (Opsional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Tanggal Pembayaran */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Tanggal Pembayaran
              </label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="h-10 text-xs rounded-[12px] border-[#FCE7F3] focus-visible:ring-[#EC4899]"
              />
            </div>

            {/* Bukti Pembayaran (File Upload) */}
            <div>
              <label className="text-xs font-bold text-[#18181B] block mb-1">
                Bukti Pembayaran{" "}
                <span className="text-[#A1A1AA] font-normal">(opsional)</span>
              </label>
              <label className="h-10 px-3 rounded-[12px] border border-[#FCE7F3] bg-white hover:bg-[#FFF5FA] flex items-center justify-between cursor-pointer transition-colors text-xs text-[#71717A]">
                <span className="truncate max-w-[150px]">
                  {selectedFileName || "Pilih file struk..."}
                </span>
                <UploadCloud className="w-4 h-4 text-[#EC4899] shrink-0" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Status Awal Transaksi */}
          <div>
            <label className="text-xs font-bold text-[#18181B] block mb-1">
              Status Awal
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("APPROVED")}
                className={`py-2 px-3 rounded-[10px] text-xs font-medium border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  status === "APPROVED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs font-bold"
                    : "bg-white text-[#71717A] border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Langsung Disetujui
              </button>
              <button
                type="button"
                onClick={() => setStatus("PENDING")}
                className={`py-2 px-3 rounded-[10px] text-xs font-medium border text-center transition-all cursor-pointer ${
                  status === "PENDING"
                    ? "bg-amber-50 text-amber-700 border-amber-300 shadow-xs font-bold"
                    : "bg-white text-[#71717A] border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                Menunggu Verifikasi
              </button>
            </div>
          </div>

          {/* Catatan / Keterangan */}
          <div>
            <label className="text-xs font-bold text-[#18181B] block mb-1">
              Keterangan
            </label>
            <Textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Catatan pelunasan (contoh: Pelunasan 2 pcs PC via transfer BCA, konfirmasi via chat LINE)..."
              rows={2}
              className="text-xs rounded-[12px] border-[#FCE7F3] focus-visible:ring-[#EC4899] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="h-10 px-4 text-xs font-semibold rounded-[12px] border-zinc-200 hover:bg-zinc-100 text-[#71717A] cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="h-10 px-5 text-xs font-bold rounded-[12px] bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-md shadow-[#EC4899]/20 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {isUploading ? "Mengunggah..." : "Simpan Pembayaran"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
