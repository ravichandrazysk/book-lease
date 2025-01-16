/* eslint-disable indent */
/* eslint-disable no-extra-parens */
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
import { useContext, useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { axiosInstance } from "@/utils/AxiosConfig";
import OwnerDetailsSkeleton from "@/components/common/loaders/OwnerDetailsSkeleton";
import { toast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { OwnerDetailsTypes, StockCardProps } from "@/types/common-types";
import dynamic from "next/dynamic";
import ChatBox from "@/components/common/ChatBox";
import { useRouter } from "next/navigation";
import GlobalContext from "@/contexts/GlobalContext";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

export function StockDetailsCard({
  bookId,
  variant,
  title,
  slug,
  author,
  date,
  leaseDueDate,
  imageUrl,
  imageError,
  status,
  isAvailable,
  onEdit,
  onToggle,
  onAccept,
  onCancel,
  loader,
  ticketId,
  approved,
  read_at,
  notification_id,
  extensionStatus,
  isLeased,
  requestType,
  isExpired,
  requestStatusToggle,
}: StockCardProps) {
  const { setChangeProfile, setRefreshNotifications } =
    useContext(GlobalContext);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
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
  const router = useRouter();

  const handleNotificationRead = async () => {
    try {
      const response = await axiosInstance.patch(
        `/notifications/${notification_id}`
      );
      if (response.status === 200) setChangeProfile((prev) => !prev);

      // eslint-disable-next-line brace-style
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.status &&
        error.status >= 400 &&
        error.status < 500 &&
        error.response
      )
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
      else
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong",
        });
    }
  };

  const categoryColors = {
    Pending: "bg-[#FEF5E5] text-[#FFAE1F] ",
    Accepted: "bg-[#C4F8E2] text-[#06A561]",
    Rejected: "bg-red-100 text-red-700",
  };

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
    <Card
      className={`flex p-4 items-center gap-4 w-full  mt-4 ${(variant === "received" || variant === "sent") && !read_at && notification_id && "border-[#FF851B] border-2"}`}
    >
      <section id="book-image" className="flex-shrink-0 border rounded-md">
        <Image
          src={imageUrl}
          alt={`Cover of ${title}`}
          className="aspect-[2/3] object-cover rounded-sm "
          width={80}
          height={120}
          onError={imageError}
          onClick={() => {
            router.push(`/book-details/${slug}`);
          }}
        />
      </section>

      <section id="book-details" className="flex-grow">
        {/* Book top design */}
        <section id="book-top" className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-xl line-clamp-1 max-w-20 sm:max-w-60">
              {title}
            </h3>
            <p className="text-base font-normal text-[#202124]">{author}</p>
          </div>
          {/* Books card pen icon */}
          {variant === "books" && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <PenSquare className="h-4 w-4" />
            </Button>
          )}
        </section>
        {variant === "books" && (
          <Badge
            variant="secondary"
            className={
              approved
                ? `bg-green-100 text-green-700 hover:bg-green-100`
                : `bg-red-100 text-red-700 hover:bg-red-100`
            }
          >
            {approved ? "Approved" : "Not Approved"}
          </Badge>
        )}

        {/* Book request badge */}
        {(variant === "received" || variant === "sent") && (
          <>
            {requestType === "Lease" && isExpired && (
              <div className="flex items-center gap-2">
                <p className="text-base mt-1 text-[#7A7977]">Lease status:</p>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  Expired
                </Badge>
              </div>
            )}
            <section id="request-status">
              <div className="flex items-center gap-2">
                <p className="text-base mt-1 text-[#7A7977]">Book request:</p>
                <Badge
                  variant="secondary"
                  className={` text-sm font-medium ${categoryColors[status === "Pending" ? "Pending" : status === "Accepted" ? "Accepted" : "Rejected"]}`}
                >
                  {status}
                </Badge>
              </div>
              {isLeased && requestType === "Lease" && isExpired && (
                <div className="flex items-center gap-2 ">
                  <p className="text-base mt-1 text-[#7A7977]">
                    Extension request:
                  </p>
                  <Badge
                    variant="secondary"
                    className={` text-sm font-medium ${categoryColors[extensionStatus === "Pending" ? "Pending" : extensionStatus === "Accepted" ? "Accepted" : "Rejected"]} `}
                  >
                    {extensionStatus}
                  </Badge>
                </div>
              )}
            </section>
            {isLeased && requestType === "Lease" && !isExpired && (
              <div className="gap-2 flex items-end">
                <p className="text-base mt-1 text-[#7A7977]">
                  Lease due date:{" "}
                  <span className="font-medium text-black">{leaseDueDate}</span>
                </p>
              </div>
            )}
          </>
        )}

        {/* My request and sent request status and badge in for PC  */}
        {(variant === "received" || variant === "sent") && (
          <>
            <div className=" gap-2 flex items-end">
              <p className="text-base mt-1 text-[#7A7977]">
                {status === "Rejected"
                  ? "Rejected on "
                  : status === "Accepted"
                    ? "Accepted on "
                    : "Requested on "}
                : <span className="font-medium text-black">{date}</span>
              </p>
            </div>

            {/* Owner details sheet */}
            {variant === "sent" && status === "Accepted" && (
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
                </SheetContent>
              </Sheet>
            )}

            {/* View chat sheet */}
            <Sheet
              open={isChatOpen}
              onOpenChange={(open) => {
                setIsChatOpen(open);
                if (!open) {
                  if (requestStatusToggle) requestStatusToggle();
                  setRefreshNotifications((prev) => !prev);
                }
              }}
            >
              <SheetTrigger asChild>
                <Button className="hidden">Open Sheet</Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg p-3 sm:p-6">
                <SheetTitle className="border-gray-300 border-b-2 pb-3">
                  <div className="flex items-center justify-between pr-10 sm:pr-8">
                    {author}
                    {variant === "received" &&
                      status &&
                      status === "Pending" && (
                        <div className="flex items-end gap-2">
                          <Button
                            variant="outline"
                            className="bg-red-500 hover:bg-red-600"
                            onClick={onCancel}
                          >
                            Reject
                          </Button>
                          <Button
                            className="bg-green-500 hover:bg-green-600"
                            onClick={onAccept}
                          >
                            Accept
                          </Button>
                        </div>
                      )}
                  </div>
                </SheetTitle>
                <ChatBox
                  owner={author || ""}
                  ticketId={Number(ticketId)}
                  isOwner={variant === "received" ? true : false}
                />
              </SheetContent>
            </Sheet>
          </>
        )}

        {/* My books status badge and availability toggle */}
        {(variant === "rental" ||
          variant === "sold" ||
          variant === "books" ||
          variant === "status") && (
          <section
            id="multi-card-handler"
            className="flex justify-between mt-4 mb-1 items-end gap-4"
          >
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
                    disabled={!approved}
                    onCheckedChange={() => {
                      setAvailabilityToggle(availabilityToggle);
                      if (onToggle) onToggle();
                    }}
                    className="data-[state=checked]:bg-[#FF7A09] "
                  />
                </div>
              </>
            )}

            {/* Rental card */}
            {variant === "rental" && (
              <p className="text-sm font-normal text-[#7A7977] mt-1">
                Due Date:{" "}
                <span className="font-semibold text-[#202124]">
                  {date ? date : "NA"}
                </span>
              </p>
            )}
            {/* Sold card */}
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
                  className="text-orange-500 hover:text-orange-600 bg-accent"
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
                  </SheetContent>
                </Sheet>
              </>
            )}
          </section>
        )}

        {/* My request and sent request loader and view chat and owner deatails */}
        {(variant === "received" || variant === "sent") && (
          <section
            id="view-chat"
            className="flex w-full gap-3 justify-end mt-2"
          >
            {loader ? (
              <div className="flex justify-center items-center max-w-28 max-sm:hidden">
                <Lottie
                  loop
                  path="/lotties/loader.json"
                  play
                  style={{ width: "100%" }}
                />
              </div>
            ) : (
              <>
                {variant === "sent" && status === "Accepted" && (
                  <Button
                    variant="ghost"
                    className="text-orange-500 hover:text-orange-600 bg-accent"
                    onClick={() => setIsSheetOpen(true)}
                  >
                    Owner Details
                  </Button>
                )}
                <Button
                  className="bg-[#FF7A09] w-24 hover:bg-[#FF7A09]"
                  onClick={() => {
                    setIsChatOpen(true);
                    if (!read_at && notification_id) handleNotificationRead();
                  }}
                >
                  View Chat
                </Button>
              </>
            )}
          </section>
        )}

        {/* My request and sent request status and badge in for Mobile  */}
        {(variant === "received" || variant === "sent") && (
          <>
            <div className="flex items-center gap-2">
              <p className="text-base mt-1 text-[#7A7977]"></p>
              <Badge
                variant="secondary"
                className="bg-green-100 text-sm font-medium text-green-700 hidden"
              >
                {status}
              </Badge>
            </div>
            <p className="text-base mt-1 text-[#7A7977] hidden">
              {status === "Rejected"
                ? "Rejected on"
                : status === "Accepted"
                  ? "Accepted on"
                  : "Requested on"}
              : <span className="font-medium text-black">{date}</span>
            </p>
          </>
        )}
      </section>
    </Card>
  );
}
