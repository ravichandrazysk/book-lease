"use client";
import React from "react";
import { X, CheckCheck } from "lucide-react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface CustomToastProps {
  title: string;
  description?: string;
  className?: string;
}

export function CustomToast({
  title,
  description,
  className,
}: CustomToastProps) {
  return (
    <React.Fragment>
      <Toast
        className={cn(
          "flex w-[380px] gap-3 border-none bg-white p-4 shadow-lg",
          className
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
          <CheckCheck className="!h-9 !w-9 text-blue-600" />
        </div>
        <div className="flex-1">
          <ToastTitle>{title}</ToastTitle>
          {description && <ToastDescription>{description}</ToastDescription>}
        </div>
        <ToastClose className="h-6 w-6 rounded-md p-0 hover:bg-transparent">
          <X className="h-4 w-4" />
        </ToastClose>
      </Toast>
    </React.Fragment>
  );
}
