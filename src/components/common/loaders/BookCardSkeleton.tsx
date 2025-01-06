"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-10 sm:w-20 rounded-full" />
          <Skeleton className="h-4 w-20 sm:w-32" />
        </div>
        <Skeleton className="h-4 w-28 sm:w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 sm:w-16" />
          <Skeleton className="h-4 w-12 sm:w-16 opacity-50" />
        </div>
      </div>
    </div>
  );
}
