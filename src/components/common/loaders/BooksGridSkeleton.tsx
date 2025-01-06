"use client";
import { BookCardSkeleton } from "@/components/common/loaders/BookCardSkeleton";
import { cn } from "@/lib/utils";

export function BooksGridSkeleton({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-6 sm:grid-cols-3 mt-8 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
}
