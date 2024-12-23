"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function SectionHeader({
  title,
  showListButton = false,
  onListClick,
}: {
  title: string;
  showListButton?: boolean;
  onListClick?: () => void;
}) {
  return (
    <div className="flex items-center sm:justify-between py-4 border shadow-lg rounded-md">
      <div className="flex items-center border justify-between px-3 w-full border-l-blue-600 border-r-0 border-y-0 border-l-4 border-l-">
        {/* <div className="w-1 h-6 bg-blue-600 rounded-full " /> */}
        <h2 className="text-xl font-medium ">{title}</h2>

        {showListButton && (
          <Button
            onClick={onListClick}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            List New Book
          </Button>
        )}
      </div>
    </div>
  );
}
