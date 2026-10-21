import React from "react";

interface TaxPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const TaxPagination: React.FC<TaxPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3">
      {/* Left items count */}
      <span className="text-xs text-[#71717A] font-medium">
        Menampilkan {startItem}&ndash;{endItem} dari {totalItems} invoice tax
      </span>

      {/* Right pagination controls */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 rounded-[10px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#71717A] hover:text-[#18181B] hover:bg-[#FFF5FA] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Sebelumnya
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-[10px] text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? "bg-[#EC4899] text-white shadow-xs"
                  : "bg-white border border-[#FBCFE8] text-[#71717A] hover:bg-[#FFF5FA] hover:text-[#18181B]"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 rounded-[10px] border border-[#FBCFE8] bg-white text-xs font-medium text-[#18181B] hover:bg-[#FFF5FA] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};
