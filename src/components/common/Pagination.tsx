// src/components/common/Pagination.tsx
import React from "react";

// Props cho Pagination gồm số trang hiện tại, tổng số trang và callback chuyển trang
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// Component phân trang đơn giản
const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex space-x-2 mt-4 justify-center">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded border ${
            page === currentPage ? "bg-blue-600 text-white" : "bg-white text-gray-800"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;