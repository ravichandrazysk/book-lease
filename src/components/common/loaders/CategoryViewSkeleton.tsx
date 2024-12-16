"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { BooksGridSkeleton } from "./BooksGridSkeleton";

const CategoryViewSkeleton = () => {
  return (
    <div className="flex gap-5 w-full mt-8">
      <Skeleton className="min-h-[500px] min-w-80 max-sm:hidden" />
      <div className="w-full">
        <Skeleton className="min-h-5  min-w-96 rounded-lg w-16 " />
        <BooksGridSkeleton
          count={6}
          className="grid sm:grid-cols-3 xl:!grid-cols-3"
        />
      </div>
    </div>
  );
};

export default CategoryViewSkeleton;
