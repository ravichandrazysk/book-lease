/* eslint-disable no-nested-ternary */
/* eslint-disable multiline-ternary */
/* eslint-disable camelcase */
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PenSquare } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { axiosInstance } from "@/utils/AxiosConfig";
import OwnerDetailsSkeleton from "@/components/common/loaders/OwnerDetailsSkeleton";
import { toast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";

interface BookCardProps {
  variant: "rental" | "books" | "received" | "status" | "sold" | "sent";
  bookId?: number;
  title: string;
  author?: string;
  date?: string;
  imageUrl: string;
  status?: string;
  isAvailable?: boolean;
  imageError?: () => void;
  onEdit?: () => void;
  // eslint-disable-next-line no-unused-vars
  onToggle?: () => void;
  onAccept?: () => void;
  onCancel?: () => void;
}

interface OwnerDetailsTypes {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  profile_photo: string | null;
}

export function StockDetailsCard({
  bookId,
  variant,
  title,
  author,
  date,
  imageUrl,
  imageError,
  status,
  isAvailable,
  onEdit,
  onToggle,
  onAccept,
  onCancel,
}: BookCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [ownnerDetails, setOwnerDetails] = useState<OwnerDetailsTypes>({
    first_name: "",
    last_name: "",
    email: ".",
    phone: "",
    address: "",
    profile_photo: null,
  });
  const [loading, setLoading] = useState(true);
  const [availabilityToggle, setAvailabilityToggle] = useState(isAvailable);

  useEffect(() => {
    const getOwnerDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/book-requests/${bookId}/owner-details`
        );
        if (response.status === 200 && response.data.data) {
          setLoading(false);
          setOwnerDetails(response.data.data);
        }
        // eslint-disable-next-line brace-style
      } catch (error) {
        if (
          isAxiosError(error) &&
          error.status &&
          error.status >= 400 &&
          error.response
        ) {
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response.data.message,
          });
          // eslint-disable-next-line no-console
          console.error("Error in getting owner details", error);
          // eslint-disable-next-line brace-style
        } else {
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong!",
          });
        }
      }
    };
    if (isSheetOpen) getOwnerDetails();
  }, [bookId, isSheetOpen]);
  return (
    <Card className="flex p-4 items-center gap-4 w-full  mt-4">
      <section id="book-image" className="flex-shrink-0 border rounded-md">
        <Image
          src={imageUrl}
          alt={`Cover of ${title}`}
          className={`${variant === "received" ? "max-sm:h-36 max-sm:w-24 w-20 h-28" : "w-20 h-28"} object-cover rounded-sm`}
          width={200}
          height={200}
          onError={imageError}
        />
      </section>

      <section id="book-details" className="flex-grow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-xl line-clamp-1 max-w-60">
              {title}
            </h3>
            <p className="text-base font-normal text-[#202124]">{author}</p>
          </div>

          {variant === "books" && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <PenSquare className="h-4 w-4" />
            </Button>
          )}
          {(variant === "received" || variant === "sent") && (
            <>
              <div className="">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-sm font-medium text-green-700 sm:hidden"
                >
                  {status}
                </Badge>
                <p className="text-base mt-1 text-[#7A7977] hidden">
                  {status === "Rejected"
                    ? "Rejected on"
                    : status === "Accepted"
                      ? "Accepted on"
                      : "Requested on"}
                  : <span className="font-medium text-black">{date}</span>
                </p>
              </div>

              {variant === "received" && status && status === "Pending" && (
                <div className="items-end justify-between gap-2 hidden">
                  <Button variant="outline" onClick={onCancel} className="w-24">
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#FF7A09] w-24 hover:bg-[#FF7A09]"
                    onClick={onAccept}
                  >
                    Accept
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between my-5 items-center gap-4">
          {variant === "books" && (
            <>
              {status && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {status}
                </Badge>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-500">Available</span>
                <Switch
                  checked={availabilityToggle}
                  onCheckedChange={() => {
                    setAvailabilityToggle(!availabilityToggle);
                    if (onToggle) onToggle();
                  }}
                  className="data-[state=checked]:bg-[#FF7A09] "
                />
              </div>
            </>
          )}

          {(variant === "received" || variant === "sent") && (
            <>
              <div className="">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-sm font-medium text-green-700 max-sm:hidden"
                >
                  {status}
                </Badge>
                <p className="text-base mt-1 text-[#7A7977]">
                  {status === "Rejected"
                    ? "Rejected on"
                    : status === "Accepted"
                      ? "Accepted on"
                      : "Requested on"}
                  : <span className="font-medium text-black">{date}</span>
                </p>
              </div>

              {variant === "received" && status && status === "Pending" && (
                <div className="flex items-end gap-2 max-sm:hidden">
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#FF7A09] hover:bg-[#FF7A09]"
                    onClick={onAccept}
                  >
                    Accept
                  </Button>
                </div>
              )}
            </>
          )}

          {variant === "rental" && date && (
            <p className="text-sm font-normal text-[#7A7977] mt-1">
              Due Date:{" "}
              <span className="font-semibold text-[#202124]">{date}</span>
            </p>
          )}

          {variant === "sold" && (
            <p className="text-sm font-normal text-[#7A7977] mt-1">
              Sold on:{" "}
              <span className="font-semibold text-[#202124]">{date}</span>
            </p>
          )}
          {(variant === "rental" ||
            variant === "status" ||
            variant === "sold") && (
            <>
              <Button
                variant="ghost"
                className="text-orange-500 hover:text-orange-600"
                onClick={() => setIsSheetOpen(true)}
              >
                Owner Details
              </Button>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="hidden">Open Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetTitle>Owner Details</SheetTitle>
                  <SheetDescription className="hidden"></SheetDescription>
                  {loading ? (
                    <OwnerDetailsSkeleton />
                  ) : (
                    <>
                      <section
                        id="profile-photo"
                        className="flex flex-col items-center justify-center min-h-40 sm:max-w-full bg-[#f6f6f6] rounded-md"
                      >
                        <Avatar className="min-w-24 min-h-24 sm:min-w-20 sm:min-h-20 sm:max-w-24 sm:max-h-24">
                          <AvatarImage
                            src="/svgs/profile-img.svg"
                            alt="owner-profile-photo"
                          />
                        </Avatar>
                        <p className="">
                          {ownnerDetails.first_name} {ownnerDetails.last_name}
                        </p>
                      </section>
                      <section id="owner-details" className="mt-2">
                        <p className="text-[#7A7977] text-lg">
                          Adress:{" "}
                          <span className="text-black font-medium ">
                            {ownnerDetails.address}
                          </span>
                        </p>
                        <p className="text-[#7A7977] text-lg">
                          Phone:{" "}
                          <span className="text-black font-medium ">
                            {ownnerDetails.phone}
                          </span>
                        </p>
                        <p className="text-[#7A7977] text-lg">
                          Email:{" "}
                          <span className="text-black font-medium break-words whitespace-pre-wrap">
                            {ownnerDetails.email}
                          </span>
                        </p>
                      </section>
                    </>
                  )}
                  {/* Add owner details content here */}
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
        {(variant === "received" || variant === "sent") && (
          <>
            <div className="">
              <Badge
                variant="secondary"
                className="bg-green-100 text-sm font-medium text-green-700 hidden"
              >
                {status}
              </Badge>
              <p className="text-base mt-1 text-[#7A7977] hidden">
                {status === "Rejected"
                  ? "Rejected on"
                  : status === "Accepted"
                    ? "Accepted on"
                    : "Requested on"}
                : <span className="font-medium text-black">{date}</span>
              </p>
            </div>

            {variant === "received" && status && status === "Pending" && (
              <div className="flex items-end justify-evenly gap-2 sm:hidden">
                <Button variant="outline" onClick={onCancel} className="w-24">
                  Cancel
                </Button>
                <Button
                  className="bg-[#FF7A09] w-24 hover:bg-[#FF7A09]"
                  onClick={onAccept}
                >
                  Accept
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </Card>
  );
}
