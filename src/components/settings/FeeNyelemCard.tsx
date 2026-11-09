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
import type { FeeNyelemSettings } from "@/types/settings";

interface FeeNyelemCardProps {
  data: FeeNyelemSettings;
  onChange: (patch: Partial<FeeNyelemSettings>) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const FeeNyelemCard: React.FC<FeeNyelemCardProps> = ({
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
            Fee Nyelem
          </CardTitle>
          <CardDescription className="text-xs text-[#71717A]">
            Configure the default operational fee per PC.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Default fee per PC
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                Rp
              </span>
              <Input
                type="number"
                min={0}
                value={data.defaultFeePerPc || ""}
                onChange={(e) =>
                  onChange({ defaultFeePerPc: Number(e.target.value) || 0 })
                }
                placeholder="10.000"
                className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
              />
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

