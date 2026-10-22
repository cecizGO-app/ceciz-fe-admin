import React, { useState } from "react";
import { Coins } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExchangeRates } from "./types";

interface UpdateKursModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRates: ExchangeRates;
  onSaveRates: (newRates: ExchangeRates) => void;
}

export const UpdateKursModal: React.FC<UpdateKursModalProps> = ({
  open,
  onOpenChange,
  currentRates,
  onSaveRates,
}) => {
  const [formData, setFormData] = useState<ExchangeRates>(currentRates);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setFormData(currentRates);
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")} WIB`;

    onSaveRates({
      ...formData,
      checkedTime: timeStr,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[#EC4899] mb-1">
            <Coins className="w-5 h-5" />
            <DialogTitle>Update Kurs Valas Harian</DialogTitle>
          </div>
          <DialogDescription>
            Perbarui nilai kurs valuta asing harian untuk Calculation Engine
            (PRD §4 &amp; §5). Nilai akan berlaku untuk kalkulasi batch baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* China (Yuan) */}
          <div className="space-y-1.5">
            <Label htmlFor="rate-yuan">China (Yuan - CNY)</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71717A]">
                Rp
              </span>
              <Input
                id="rate-yuan"
                value={formData.yuan}
                onChange={(e) =>
                  setFormData({ ...formData, yuan: e.target.value })
                }
                className="pl-10"
                placeholder="2.350"
                required
              />
            </div>
          </div>

          {/* Korea Selatan (Won) */}
          <div className="space-y-1.5">
            <Label htmlFor="rate-won">Korea Selatan (Won - KRW)</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71717A]">
                Rp
              </span>
              <Input
                id="rate-won"
                value={formData.won}
                onChange={(e) =>
                  setFormData({ ...formData, won: e.target.value })
                }
                className="pl-10"
                placeholder="12,40"
                required
              />
            </div>
          </div>

          {/* Thailand (Baht) */}
          <div className="space-y-1.5">
            <Label htmlFor="rate-baht">Thailand (Baht - THB)</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71717A]">
                Rp
              </span>
              <Input
                id="rate-baht"
                value={formData.baht}
                onChange={(e) =>
                  setFormData({ ...formData, baht: e.target.value })
                }
                className="pl-10"
                placeholder="475"
                required
              />
            </div>
          </div>

          {/* Jepang (Yen) */}
          <div className="space-y-1.5">
            <Label htmlFor="rate-yen">Jepang (Yen - JPY)</Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#71717A]">
                Rp
              </span>
              <Input
                id="rate-yen"
                value={formData.yen}
                onChange={(e) =>
                  setFormData({ ...formData, yen: e.target.value })
                }
                className="pl-10"
                placeholder="108"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#EC4899] hover:bg-[#DB2777] text-white cursor-pointer font-semibold"
            >
              Simpan Kurs
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
