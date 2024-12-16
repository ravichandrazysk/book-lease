"use client";
import { SquareChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/common/BookCard";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

interface BookArrayProps {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: string;
  discounted_price: string;
  is_free: boolean;
  category: string;
  images: { image_path: string }[];
}

export function CategorySection({
  filteredBookData,
  title,
}: {
  filteredBookData: BookArrayProps[];
  title?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredBookData.length / itemsPerPage);
  const router = useRouter();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = filteredBookData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex-1 sm:max-w-4xl mx-auto max-w-sm pt-4">
      <div className="mb-1 flex items-center gap-4 mx-auto max-md:w-[90%]">
        <Button
          variant="ghost"
          size="icon"
          className="justify-start"
          onClick={() => router.back()}
        >
          <SquareChevronLeft
            className="!h-9 !w-9"
            color="#1F2937"
            strokeWidth={1.8}
          />
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-2 mx-auto max-md:w-[90%]">
        {paginatedData.map((comic, index) => (
          <BookCard key={index} {...comic} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  onClick={() => handlePageChange(pageIndex + 1)}
                  isActive={currentPage === pageIndex + 1}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
