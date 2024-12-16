"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const BookDetailSkeleton = () => {
  return (
    <div className="flex  gap-20  mt-8">
      <Skeleton className="min-h-[500px] min-w-[400px]" />
      <div className="w-full space-y-4">
        <Skeleton className="min-h-5  min-w-96 rounded-lg w-16 " />
        <Skeleton className="min-h-2  min-w-96 rounded-lg w-16 " />
        <Skeleton className="min-h-5  min-w-96 rounded-lg w-16 " />
        <Skeleton className="min-h-2  min-w-96 rounded-lg w-16 " />
        <Skeleton className="min-h-6  min-w-96 rounded-lg w-16 " />
        <Skeleton className="min-h-16  min-w-96 rounded-lg w-16 " />
        <Skeleton className="min-h-8  min-w-96 rounded-lg w-16 " />
        <div className="flex gap-3">
          <div>
            <Skeleton className="min-h-8 min-w-60  rounded-lg w-16 " />
            <Skeleton className="min-h-2 min-w-60 mt-2 rounded-lg w-16 " />
          </div>
          <div>
            <Skeleton className="min-h-8 min-w-60  rounded-lg w-5 " />
            <Skeleton className="min-h-2 min-w-60  mt-2 rounded-lg w-5 " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailSkeleton;
