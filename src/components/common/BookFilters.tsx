"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterContent } from "@/components/common/FilterContent";

export function FilterSection() {
  return (
    <>
      <div className="hidden md:block pt-4">
        <FilterContent />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden z-50 fixed bottom-10 right-4 w-fit h-fit flex items-center justify-end rounded-full p-3  bg-white !shadow-md"
          >
            <Filter className="!h-9 !w-9" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[400px] min-h-screen"
        >
          <SheetHeader>
            <SheetTitle className="hidden"></SheetTitle>
            <SheetDescription className="hidden"></SheetDescription>
          </SheetHeader>
          <FilterContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
