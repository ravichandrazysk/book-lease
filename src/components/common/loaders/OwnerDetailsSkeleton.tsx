"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const OwnerDetailsSkeleton = () => {
  return (
    <React.Fragment>
      <section id="owner-name" className="space-y-4 mt-2">
        <Skeleton className="w-full h-40 gap-2 flex flex-col items-center justify-center">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="w-36 h-4" />
        </Skeleton>
      </section>
      <section id="owner-details" className="space-y-4 mt-3">
        <Skeleton className="w-36 h-4" />
        <Skeleton className="w-36 h-4" />
        <Skeleton className="w-36 h-4" />
      </section>
    </React.Fragment>
  );
};

export default OwnerDetailsSkeleton;
