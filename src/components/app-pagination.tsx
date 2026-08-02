"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

export function AppPagination({
  currentPage,
  totalPages,
  onPageChange,
  isFetching = false,
}: AppPaginationProps) {
  const getPaginationRange = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.add(i);
    }

    if (currentPage <= 3) {
      pages.add(2);
      pages.add(3);
      pages.add(4);
    }
    if (currentPage >= totalPages - 2) {
      pages.add(totalPages - 3);
      pages.add(totalPages - 2);
      pages.add(totalPages - 1);
    }

    const sorted = Array.from(pages).sort((a, b) => a - b);

    const range: (number | string)[] = [];
    let prev = 0;
    for (const page of sorted) {
      if (prev !== 0) {
        if (page - prev === 2) {
          range.push(prev + 1);
        } else if (page - prev > 2) {
          range.push("...");
        }
      }
      range.push(page);
      prev = page;
    }
    return range;
  };

  if (totalPages <= 1) {
    return null;
  }

  const range = getPaginationRange();

  return (
    <Pagination data-loc="AppPagination" className="mt-8">
      <PaginationContent>
        {/* Mobile: compact prev / page indicator / next */}
        <PaginationItem className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>
        <PaginationItem className="flex md:hidden">
          <span className="flex h-9 min-w-[3.75rem] items-center justify-center rounded-xl border border-input bg-background px-3 text-sm font-medium text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
        </PaginationItem>
        <PaginationItem className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isFetching}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>

        {/* Desktop: full navigation */}
        <PaginationItem className="hidden md:flex">
          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        </PaginationItem>
        {range.map((page, index) => (
          <PaginationItem key={index} className="hidden md:flex">
            {typeof page === "number" ? (
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                className="!w-8 !h-8"
              >
                {page}
              </PaginationLink>
            ) : (
              <span className="flex h-9 items-center justify-center px-1 text-muted-foreground">
                ...
              </span>
            )}
          </PaginationItem>
        ))}
        <PaginationItem className="hidden md:flex">
          <Button
            variant="ghost"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isFetching}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
