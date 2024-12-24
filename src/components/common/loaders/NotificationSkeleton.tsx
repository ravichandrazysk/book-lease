"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const NotificationSkeleton = () => {
  return (
    <React.Fragment>
      <section id="notification-skeleton" className="flex items-center gap-2">
        <Skeleton className="rounded-full h-4 w-4" />
        <div>
          <Skeleton className="min-w-60 min-h-4 rounded-md" />
          <Skeleton className="min-w-40 min-h-4 mt-1 rounded-md" />
        </div>
      </section>
    </React.Fragment>
  );
};

export default NotificationSkeleton;
