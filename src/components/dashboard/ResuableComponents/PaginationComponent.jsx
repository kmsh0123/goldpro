// components/PaginationComponent.jsx
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({ page, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    let pages = [];

    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      pages.push(1);

      if (page > 3) pages.push("ellipsis-start");

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("ellipsis-end");

      pages.push(totalPages);
    }

    return pages.map((p, i) => {
      if (p === "ellipsis-start" || p === "ellipsis-end") {
        return (
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      return (
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(p)}
            isActive={page === p}
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <Pagination className="cursor-pointer">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(page - 1)}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          >
            Previous
          </PaginationPrevious>
        </PaginationItem>

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(page + 1)}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          >
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
