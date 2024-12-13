"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface StockCardLoaderProps {
  variant: "books" | "received" | "sent" | "rental" | "sold" | "status";
}
const StockCardLoader = ({ variant }: StockCardLoaderProps) => {
  return (
    <Card className="flex p-4 items-center gap-4 w-full  mt-4">
      <section id="book-image" className="flex-shrink-0">
        <Skeleton className="sm:w-20 h-28 rounded-sm" />
      </section>

      <section id="book-details" className="flex-grow">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="sm:h-4 sm:w-20" />
            <Skeleton className="sm:h-4 sm:w-10 mt-2" />
          </div>
          {variant === "books" && <Skeleton className="h-10 w-10" />}
        </div>

        <div className="flex justify-between mt-5 items-center gap-4">
          {variant === "books" && (
            <>
              <Skeleton className="h-4 w-20" />

              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </>
          )}

          {(variant === "received" || variant === "sent") && (
            <>
              <div className="">
                <Skeleton className="h-4 w-10" />

                <Skeleton className="h-4 w-16 mt-2" />
              </div>

              {variant === "received" && (
                <div className="flex items-end gap-2">
                  <Skeleton className="h-8 w-20" />

                  <Skeleton className="h-8 w-20" />
                </div>
              )}
            </>
          )}

          {variant === "rental" && <Skeleton className="w-20 h-4" />}
          {variant === "sold" && <Skeleton className="w-24 h-4" />}
          {(variant === "rental" ||
            variant === "status" ||
            variant === "sold") && (
            <>
              <Skeleton className="w-20 h-4" />
            </>
          )}
        </div>
      </section>
    </Card>
  );
};

export default StockCardLoader;
