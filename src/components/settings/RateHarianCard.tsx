import React from "react";
import { Save } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { DailyRatesSettings } from "@/types/settings";

interface RateHarianCardProps {
  data: DailyRatesSettings;
  onChange: (patch: Partial<DailyRatesSettings>) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const RateHarianCard: React.FC<RateHarianCardProps> = ({
  data,
  onChange,
  onSave,
  isSaving = false,
}) => {
  return (
    <Card className="rounded-[20px] border border-[#FBCFE8]/60 shadow-xs bg-white flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3 border-b border-[#FBCFE8]/30">
          <CardTitle className="text-[17px] font-bold text-[#18181B] tracking-tight">
            Rate Harian
          </CardTitle>
          <CardDescription className="text-xs text-[#71717A]">
            Current reference rates for batch preparation.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Yuan (CH)
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  step="any"
                  value={data.yuan || ""}
                  onChange={(e) =>
                    onChange({ yuan: Number(e.target.value) || 0 })
                  }
                  placeholder="2.350"
                  className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Won (KR)
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  step="any"
                  value={data.won || ""}
                  onChange={(e) =>
                    onChange({ won: Number(e.target.value) || 0 })
                  }
                  placeholder="12.4"
                  className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Baht (TH)
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  step="any"
                  value={data.baht || ""}
                  onChange={(e) =>
                    onChange({ baht: Number(e.target.value) || 0 })
                  }
                  placeholder="475"
                  className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Yen (JP)
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  step="any"
                  value={data.yen || ""}
                  onChange={(e) =>
                    onChange({ yen: Number(e.target.value) || 0 })
                  }
                  placeholder="108"
                  className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="p-4 pt-0 flex justify-end">
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          size="sm"
          className="h-8 px-3.5 rounded-[9px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5 mr-1" />
          Save
        </Button>
      </div>
    </Card>
  );
};

