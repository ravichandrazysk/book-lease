import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
  title,
  body,
}: {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  body: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent className="max-w-[325px] rounded-md sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <section id="confirmation-details">
            <p className="text-sm font-normal">{body}</p>
          </section>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 sm:w-auto"
              onClick={() => {
                onOpenChange(false);
                onConfirm();
              }}
            >
              Ok
            </Button>
            <Button
              className="w-full bg-gray-500 hover:bg-gray-600 sm:w-auto"
              onClick={() => {
                onOpenChange(false);
                onCancel();
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default ConfirmationModal;
