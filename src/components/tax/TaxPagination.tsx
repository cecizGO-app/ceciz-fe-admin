import React from "react";
import { TablePagination } from "@/components/verification/TablePagination";

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
    <TablePagination
      currentPage={currentPage}
      totalPages={totalPages}
      startIndex={startItem}
      endIndex={endItem}
      totalCount={totalItems}
      itemLabel="invoice tax"
      onPageChange={onPageChange}
    />
  );
};
