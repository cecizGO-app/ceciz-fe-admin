import React from "react";
import {
  MoreHorizontal,
  Pencil,
  Calculator,
  Copy,
  EyeOff,
  Eye,
  Check,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import type { BatchItem, BatchStatus } from "@/types/batch";

interface BatchRowActionsProps {
  batch: BatchItem;
  onEdit?: (batchId: string) => void;
  onCalculate: (batch: BatchItem) => void;
  onCopy: (batch: BatchItem) => void;
  onToggleHide: (batchId: string) => void;
  onUpdateStatus: (batchId: string, status: BatchStatus) => void;
  onDelete?: (batchId: string) => void;
}

export const BatchRowActions: React.FC<BatchRowActionsProps> = ({
  batch,
  onEdit,
  onCalculate,
  onCopy,
  onToggleHide,
  onUpdateStatus,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="w-8 h-8 rounded-full text-[#71717A] hover:text-[#EC4899] hover:bg-[#FFF5FA] cursor-pointer"
          aria-label="Menu Aksi Batch"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => onEdit?.(batch.id)}
          className="gap-2.5 cursor-pointer"
        >
          <Pencil className="w-4 h-4 text-[#71717A]" />
          <span>Edit Batch</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onCalculate(batch)}
          className="gap-2.5 cursor-pointer text-[#18181B] hover:text-[#EC4899]"
        >
          <Calculator className="w-4 h-4 text-[#EC4899]" />
          <span className="font-medium">Hitung Internal Calculation</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onCopy(batch)}
          className="gap-2.5 cursor-pointer"
        >
          <Copy className="w-4 h-4 text-[#71717A]" />
          <span>Copy untuk Share</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Submenu Ubah Status Batch (Open, Closed, Archived) */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2.5 cursor-pointer px-3 py-2 text-xs font-medium text-[#18181B]">
            <RefreshCw className="w-4 h-4 text-[#71717A]" />
            <span>Ubah Status Batch</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44 p-1.5 rounded-[14px]">
            <DropdownMenuItem
              onClick={() => onUpdateStatus(batch.id, "Open")}
              className="gap-2.5 cursor-pointer text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Set Open</span>
              {batch.status === "Open" && (
                <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onUpdateStatus(batch.id, "Closed")}
              className="gap-2.5 cursor-pointer text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-zinc-400 shrink-0" />
              <span>Set Closed</span>
              {batch.status === "Closed" && (
                <Check className="w-3.5 h-3.5 text-zinc-600 ml-auto" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onUpdateStatus(batch.id, "Archived")}
              className="gap-2.5 cursor-pointer text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
              <span>Set Archived</span>
              {batch.status === "Archived" && (
                <Check className="w-3.5 h-3.5 text-purple-600 ml-auto" />
              )}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onToggleHide(batch.id)}
          className="gap-2.5 cursor-pointer text-[#71717A] hover:text-[#EC4899]"
        >
          {batch.isHidden ? (
            <>
              <Eye className="w-4 h-4" />
              <span>Tampilkan Batch</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Sembunyikan Batch</span>
            </>
          )}
        </DropdownMenuItem>

        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(batch.id)}
              className="gap-2.5 cursor-pointer text-[#EF4444] hover:text-[#DC2626] hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-medium">Hapus Batch</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BatchRowActions;
