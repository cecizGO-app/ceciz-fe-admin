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
import type { PenaltyRulesSettings } from "@/types/settings";

interface PenaltyRulesCardProps {
  data: PenaltyRulesSettings;
  onChange: (patch: Partial<PenaltyRulesSettings>) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const PenaltyRulesCard: React.FC<PenaltyRulesCardProps> = ({
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
            Penalty Rules
          </CardTitle>
          <CardDescription className="text-xs text-[#71717A]">
            Set deadline references for overdue handling.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Amount per day
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#71717A]">
                  Rp
                </span>
                <Input
                  type="number"
                  min={0}
                  value={data.amountPerDay || ""}
                  onChange={(e) =>
                    onChange({ amountPerDay: Number(e.target.value) || 0 })
                  }
                  placeholder="5.000"
                  className="pl-9 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
                Batch deadline
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min={1}
                  value={data.batchDeadlineDays || ""}
                  onChange={(e) =>
                    onChange({ batchDeadlineDays: Number(e.target.value) || 0 })
                  }
                  placeholder="7"
                  className="pr-14 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#71717A] pointer-events-none">
                  days
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Tax deadline
            </Label>
            <div className="relative">
              <Input
                type="number"
                min={1}
                value={data.taxDeadlineDays || ""}
                onChange={(e) =>
                  onChange({ taxDeadlineDays: Number(e.target.value) || 0 })
                }
                placeholder="5"
                className="pr-14 h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#71717A] pointer-events-none">
                days
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

