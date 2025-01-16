/* eslint-disable no-extra-parens */
/* eslint-disable no-nested-ternary */
"use client";
import { Button } from "@/components/ui/button";
import GlobalContext from "@/contexts/GlobalContext";
import { Plus } from "lucide-react";
import { useContext } from "react";

export function SectionHeader({
  title,
  showListButton = false,
  onListClick,
}: {
  title: string;
  showListButton?: boolean;
  onListClick?: () => void;
}) {
  const { profileDetails } = useContext(GlobalContext);
  return (
    <div className="flex items-center sm:justify-between py-4 border shadow-lg rounded-md bg-white">
      <div className="flex items-center border justify-between px-3 w-full border-l-blue-600 border-r-0 border-y-0 border-l-4 border-l-">
        {/* <div className="w-1 h-6 bg-blue-600 rounded-full " /> */}
        <h2 className="text-xl font-medium relative">
          {title}
          {(title === "My Sent Requests" || title === "Received Requests") && (
            <span
              className={`absolute ${title === "My Sent Requests" ? "top-0 left-[165px]" : "top-0 left-44"} h-3 w-3 md:max-w-max md:max-h-max p-2.5 rounded-full bg-[#FF851B] text-[8px] md:text-[10px] font-medium text-white flex items-center justify-center`}
            >
              {title === "My Sent Requests"
                ? (profileDetails?.notification_counts?.my_requests ?? 0) > 99
                  ? "99+"
                  : (profileDetails?.notification_counts?.my_requests ?? 0)
                : (profileDetails?.notification_counts?.received_requests ??
                      0) > 99
                  ? "99+"
                  : (profileDetails?.notification_counts?.received_requests ??
                    0)}
            </span>
          )}
        </h2>

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
