"use client";
import { BookCardSkeleton } from "@/components/common/loaders/BookCardSkeleton";
import { cn } from "@/lib/utils";

interface BooksGridSkeletonProps {
  count?: number;
  className?: string;
}

export function BooksGridSkeleton({
  count = 5,
  className,
}: BooksGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-3 mt-8 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
}
