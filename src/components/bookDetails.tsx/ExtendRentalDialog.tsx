"use client";

import * as React from "react";
import { addDays, format, differenceInDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ExtendRentalDialogProps {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  currentDueDate?: Date | null;
  // eslint-disable-next-line no-unused-vars
  extendDays?: (dueDate: number) => void;
}

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

  const daysLeft = React.useMemo(() => {
    return differenceInDays(currentDueDate || new Date(), new Date());
  }, [currentDueDate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="extend-rental-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Extend Your Rental</DialogTitle>
        </DialogHeader>
        <div id="extend-rental-description" className="space-y-6 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Due Date:</p>
            <p className="font-medium">
              {currentDueDate ? format(currentDueDate, "MMM dd, yyyy") : "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Choose New Due Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMM dd, yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate && currentDueDate) {
                      const dayDifference = differenceInDays(
                        newDate,
                        currentDueDate
                      );
                      if (extendDays) extendDays(dayDifference);
                      setDate(newDate);
                    }
                  }}
                  disabled={(date) =>
                    date < new Date() ||
                    (currentDueDate ? date <= currentDueDate : false) ||
                    (currentDueDate
                      ? date > addDays(currentDueDate, 21)
                      : false)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">New Due Date:</span>
            <span className="font-medium">
              {date && currentDueDate && date > currentDueDate
                ? format(date, "MMM dd, yyyy")
                : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Days Left:</span>
            <span className="font-medium">{daysLeft} days</span>
          </div>
        </div>
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
