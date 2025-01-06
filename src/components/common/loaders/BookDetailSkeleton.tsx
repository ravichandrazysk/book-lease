"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const BookDetailSkeleton = () => {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="max-w-xs w-full mx-auto">
        <Skeleton className="w-[320px] sm:w-[350px] h-[500px]" />
      </div>
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-6 sm:h-8 w-20" />
        <Skeleton className="h-8 sm:h-10 w-60" />
        <Skeleton className="h-7 sm:h-9 w-60" />
        <Skeleton className="h-7 sm:h-10 w-28" />
        <Skeleton className="h-4 sm:h-6 w-20" />
        <Skeleton className="h-4 sm:h-6 w-20" />
        <Skeleton className="h-8 sm:h-10 w-80" />
        <Skeleton className="h-9 sm:h-12 w-80" />
        <Skeleton className="h-6 sm:h-8 w-20" />
        <Skeleton className="h-6 sm:h-9 w-52" />
      </div>
    </div>
  );
};

export default BookDetailSkeleton;
