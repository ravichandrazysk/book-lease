"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/common/BookCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import {
  BookArrayProps,
  ComicCardProps,
  PaginationDataTypes,
} from "@/types/common-types";

const transformToComicCard = (book: BookArrayProps): ComicCardProps => {
  return {
    ...book,
    category: book.category.name,
    images: book.images.map((img) => ({
      // eslint-disable-next-line camelcase
      image_id: img.image_id,
      // eslint-disable-next-line camelcase
      image_path: img.image_path,
      // eslint-disable-next-line camelcase
      alt_text: img.alt_text,
    })),
  };
};

export function CategorySection({
  filteredBookData,
  title,
  paginationData,
  onPageChange,
}: {
  filteredBookData: BookArrayProps[];
  title?: string;
  paginationData: PaginationDataTypes;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="flex-1 sm:max-w-4xl mx-auto max-w-sm pt-4">
      <div className="mb-1 flex items-center gap-4 mx-auto max-w-3xl">
        <Button
          variant="ghost"
          size="icon"
          className="justify-start"
          onClick={() => router.back()}
        >
          <ArrowLeft className="!h-7 !w-7" color="#1F2937" strokeWidth={1} />
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-2 mx-auto max-w-3xl px-3 md:px-0">
        {filteredBookData &&
          filteredBookData.map((comic) => (
            <BookCard key={comic.id} {...transformToComicCard(comic)} />
          ))}
      </div>

      {paginationData.last_page > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={
                  paginationData.current_page === 1
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }
                onClick={() =>
                  paginationData.current_page > 1 &&
                  handlePageChange(paginationData.current_page - 1)
                }
              />
            </PaginationItem>
            {[...Array(paginationData.last_page)].map((_, pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  className={`cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => handlePageChange(pageIndex + 1)}
                  isActive={paginationData.current_page === pageIndex + 1}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                className={
                  paginationData.current_page === paginationData.last_page
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }
                onClick={() =>
                  paginationData.current_page < paginationData.last_page &&
                  handlePageChange(paginationData.current_page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
