import React from "react";
import { Link2, Calendar, Save } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BuyerCheckoutLinks } from "@/types/settings";

interface LinkCheckoutCardProps {
  data: BuyerCheckoutLinks;
  onChange: (patch: Partial<BuyerCheckoutLinks>) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const LinkCheckoutCard: React.FC<LinkCheckoutCardProps> = ({
  data,
  onChange,
  onSave,
  isSaving = false,
}) => {
  return (
    <Card className="rounded-[20px] border border-[#FBCFE8]/60 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-[#FBCFE8]/30 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-[17px] font-bold text-[#18181B] tracking-tight">
            Link Checkout Buyer
          </CardTitle>
          <CardDescription className="text-xs text-[#71717A]">
            Atur kapan link Google Form & checkout Shopee tampil di sisi buyer
          </CardDescription>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#FFF5FA] border border-[#FBCFE8] flex items-center justify-center text-[#EC4899] shrink-0">
          <Link2 className="w-4 h-4" />
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Row 1: Google Form & Shopee URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Link Google Form
            </Label>
            <Input
              type="text"
              value={data.googleFormUrl}
              onChange={(e) => onChange({ googleFormUrl: e.target.value })}
              placeholder="https://forms.gle/..."
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block">
              Link checkout Shopee
            </Label>
            <Input
              type="text"
              value={data.shopeeCheckoutUrl}
              onChange={(e) => onChange({ shopeeCheckoutUrl: e.target.value })}
              placeholder="https://shopee.co.id/..."
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>
        </div>

        {/* Row 2: Mulai (WIB) & Selesai (WIB) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
              Mulai (WIB)
            </Label>
            <Input
              type="date"
              value={data.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#18181B] mb-1.5 block flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#EC4899]" />
              Selesai (WIB)
            </Label>
            <Input
              type="date"
              value={data.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
              className="h-10 text-xs rounded-[10px] border-[#FBCFE8]/70 focus-visible:border-[#EC4899]"
            />
          </div>
        </div>

        {/* Row 3: Switches for Google Form & Shopee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#FFF5FA]/30 border border-[#FBCFE8]/40">
            <span className="text-xs font-medium text-[#18181B]">
              Google Form dibuka
            </span>
            <Switch
              checked={data.isGoogleFormOpen}
              onCheckedChange={(val) => onChange({ isGoogleFormOpen: val })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#FFF5FA]/30 border border-[#FBCFE8]/40">
            <span className="text-xs font-medium text-[#18181B]">
              Shopee dibuka
            </span>
            <Switch
              checked={data.isShopeeOpen}
              onCheckedChange={(val) => onChange({ isShopeeOpen: val })}
            />
          </div>
        </div>

        {/* Footer Bar: Status di buyer & Save Button */}
        <div className="pt-2 border-t border-[#FBCFE8]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="font-medium text-[#71717A]">Status di buyer:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#71717A]">Google Form</span>
              <Badge
                variant={data.isGoogleFormOpen ? "success" : "outline"}
                className="text-[10px] px-2 py-0.5 rounded-full"
              >
                {data.isGoogleFormOpen ? "Open" : "Closed"}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#71717A]">Shopee</span>
              <Badge
                variant={data.isShopeeOpen ? "success" : "outline"}
                className="text-[10px] px-2 py-0.5 rounded-full"
              >
                {data.isShopeeOpen ? "Open" : "Closed"}
              </Badge>
            </div>
          </div>

          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            size="sm"
            className="h-9 px-4 rounded-[10px] bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold text-xs shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Simpan & terapkan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
