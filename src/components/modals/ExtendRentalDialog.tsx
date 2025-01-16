"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { ExtendRentalDialogProps } from "@/types/common-types";

export function ExtendRentalDialog({
  open,
  onOpenChange,
  onConfirm,
  currentDueDate = new Date(),
  extendDays,
}: ExtendRentalDialogProps) {
  const [date, setDate] = React.useState<Date>(
    addDays(currentDueDate || new Date(), 0)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[325px] rounded-md sm:max-w-[425px]"
        aria-describedby="extend-rental-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Extend Your Rental</DialogTitle>
        </DialogHeader>

        {/* Extend rental */}
        <section id="extend-rental-description" className="space-y-6 py-4">
          {/* Due date */}
          <section id="due-date" className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Due Date:</p>
            <p className="font-medium">
              {currentDueDate ? format(currentDueDate, "MMM dd, yyyy") : "N/A"}
            </p>
          </section>

          {/* Extension dropdown */}
          <section id="extend-days" className="space-y-2">
            <p className="text-sm text-muted-foreground">Extend by days</p>

            <Select
              onValueChange={(value) => {
                if (extendDays) extendDays(value);
                if (currentDueDate)
                  setDate(addDays(currentDueDate, Number(value)));
              }}
            >
              <SelectTrigger className="border border-[#D1D5DB]">
                <SelectValue placeholder="Select extension duration..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="21">21</SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* New due date */}
          <section
            id="due-date"
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">New Due Date:</span>
            <span className="font-medium">
              {date && currentDueDate && date > currentDueDate
                ? format(date, "MMM dd, yyyy")
                : "N/A"}
            </span>
          </section>
        </section>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 sm:w-auto"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Confirm Extension
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
