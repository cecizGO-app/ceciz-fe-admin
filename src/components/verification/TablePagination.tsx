import React from "react";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalCount,
  onPageChange,
}) => {
  return (
    <div className="p-4 border-t border-[#FCE7F3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      <div className="text-[#71717A]">
        Menampilkan{" "}
        <strong className="text-[#18181B]">
          {startIndex}-{endIndex}
        </strong>{" "}
        dari <strong className="text-[#18181B]">{totalCount}</strong> antrian
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 px-3 rounded-[10px] border-[#FCE7F3] text-xs font-medium text-[#71717A] hover:text-[#18181B] disabled:opacity-40 cursor-pointer"
        >
          Sebelumnya
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-[10px] text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === p
                ? "bg-[#EC4899] text-white shadow-2xs"
                : "text-[#71717A] hover:bg-[#FFF5FA] hover:text-[#18181B]"
            }`}
          >
            {p}
          </button>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 px-3 rounded-[10px] border-[#FCE7F3] text-xs font-medium text-[#71717A] hover:text-[#18181B] disabled:opacity-40 cursor-pointer"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
};
