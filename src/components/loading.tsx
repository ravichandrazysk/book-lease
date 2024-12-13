"use client";
import { BooksGridSkeleton } from "@/components/common/loaders/BooksGridSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <BooksGridSkeleton />
    </div>
  );
}
