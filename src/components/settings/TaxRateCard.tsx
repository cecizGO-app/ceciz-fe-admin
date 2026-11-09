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
import type { TaxRateSettings } from "@/types/settings";

interface TaxRateCardProps {
  data: TaxRateSettings;
  onChange: (patch: Partial<TaxRateSettings>) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const TaxRateCard: React.FC<TaxRateCardProps> = ({
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
            Tax Rate
          </CardTitle>
          <CardDescription className="text-xs text-[#71717A]">
            Country and weight references without prototype formulas.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                CH · PC tax
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  min={0}
                  value={data.chPcTax || ""}
                  onChange={(e) =>
                    onChange({ chPcTax: Number(e.target.value) || 0 })
                  }
                  placeholder="18.000"
                  className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                KR · PC tax
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  min={0}
                  value={data.krPcTax || ""}
                  onChange={(e) =>
                    onChange({ krPcTax: Number(e.target.value) || 0 })
                  }
                  placeholder="20.000"
                  className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                TH · PC tax
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  min={0}
                  value={data.thPcTax || ""}
                  onChange={(e) =>
                    onChange({ thPcTax: Number(e.target.value) || 0 })
                  }
                  placeholder="16.000"
                  className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                JP · PC tax
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  min={0}
                  value={data.jpPcTax || ""}
                  onChange={(e) =>
                    onChange({ jpPcTax: Number(e.target.value) || 0 })
                  }
                  placeholder="22.000"
                  className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Non-PC by weight
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                Rp
              </span>
              <Input
                type="number"
                min={0}
                value={data.nonPcPerKg || ""}
                onChange={(e) =>
                  onChange({ nonPcPerKg: Number(e.target.value) || 0 })
                }
                placeholder="85.000"
                className="pl-9 pr-14 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#71717A] pointer-events-none">
                / kg
              </span>
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

