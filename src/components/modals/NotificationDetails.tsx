"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotificationTypes } from "@/types/common-types";
import { DialogPortal } from "@radix-ui/react-dialog";

export function NotificationDetails({
  open,
  onOpenChange,
  notificationDetails,
  onNotificatoinClose,
}: {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
  notificationDetails: NotificationTypes;
  // eslint-disable-next-line no-unused-vars
  onNotificatoinClose: (id: number) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent
          className="max-w-[325px] rounded-md sm:max-w-[425px]"
          aria-describedby="notification-details"
          onInteractOutside={() => onNotificatoinClose(notificationDetails.id)}
        >
          <DialogHeader>
            <DialogTitle className="text-xl">
              {notificationDetails.title}
            </DialogTitle>
          </DialogHeader>
          <section id="notification-details">
            <p className="text-sm font-normal">{notificationDetails.body}</p>
          </section>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 sm:w-auto"
              onClick={() => {
                onOpenChange(false);
                onNotificatoinClose(notificationDetails.id);
              }}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
