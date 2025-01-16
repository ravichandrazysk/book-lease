/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
"use client";
import React, { useEffect, useState } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import StockCardLoader from "@/components/common/loaders/StockCardLoader";
import { StockDetailsCard } from "@/components/common/StockDetailsCard";
import { axiosInstance } from "@/utils/AxiosConfig";
import { isAxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  PaginationDataTypes,
  ReceivedRequestTypes,
} from "@/types/common-types";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/common/ChatBox";

export const ReceivedRequests = () => {
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState<
    ReceivedRequestTypes[]
  >([]);
  const [requestStatus, setRequestStatus] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState<PaginationDataTypes>({
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSessionStorage, setIsSessionStorage] = useState(false);
  const [bookRequestStatus, setBookRequestStatus] = useState<string | null>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("requestStatus")
      : null
  );

  const ownerName =
    typeof window !== "undefined" ? sessionStorage.getItem("ownerName") : null;
  const ticketNumber =
    typeof window !== "undefined" ? sessionStorage.getItem("ticketId") : null;
  const itemId =
    typeof window !== "undefined" ? sessionStorage.getItem("itemId") : null;

  const handleRequestConfirmation = async (
    actionStatus: string,
    requestId: number
  ) => {
    setLoader(true);
    try {
      const formData = new FormData();
      formData.append("status", actionStatus);
      const response = await axiosInstance.post(
        `/update-request-status/${requestId}`,
        formData
      );
      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Success",
          description: response.data.message,
        });
        setBookRequestStatus(() => {
          if (typeof window !== "undefined")
            sessionStorage.setItem("requestStatus", actionStatus);
          return actionStatus;
        });
        setRequestStatus(!requestStatus);
        setLoader(false);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      setLoader(false);
      if (
        isAxiosError(error) &&
        error.status &&
        error.response &&
        error.response.data
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

  useEffect(() => {
    const receiveRequests = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/received-requests?paginate=10&page=${currentPage}`
        );
        if (response.status === 200) {
          setReceivedRequests(response.data.data);
          setPaginationData(response.data?.meta);
          setLoading(false);
        }
        // eslint-disable-next-line brace-style
      } catch (error) {
        if (
          isAxiosError(error) &&
          error.status &&
          error.status >= 400 &&
          error.status < 500 &&
          error.response
        ) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response.data.message,
          });
          setLoading(false);
          // eslint-disable-next-line brace-style
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong",
          });
          setLoading(false);
        }
      }
    };
    receiveRequests();
  }, [requestStatus, currentPage]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== "undefined") {
        const ownerName = sessionStorage.getItem("ownerName");
        const ticketId = sessionStorage.getItem("ticketId");
        const itemId = sessionStorage.getItem("itemId");
        const requestStatus = sessionStorage.getItem("requestStatus");
        setIsSessionStorage(Boolean(ownerName && ticketId && itemId));
        setBookRequestStatus(requestStatus);
      }
    };
    handleStorageChange();
    if (typeof window !== "undefined")
      window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSessionStorage) setIsChatOpen(true);
  }, [isSessionStorage]);

  return (
    <React.Fragment>
      <section
        id="my-books"
        className=" sm:w-11/12 md:mr-9 mx-auto max-w-3xl my-5"
      >
        <header>
          <SectionHeader title={"Received Requests"} />
        </header>

        {loading ? (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <StockCardLoader key={index} variant="rental" />
            ))}
          </>
        ) : receivedRequests && receivedRequests.length > 0 ? (
          receivedRequests.map((item: ReceivedRequestTypes) => (
            <StockDetailsCard
              key={item.id}
              variant="received"
              title={item.book_name}
              slug={item.slug}
              author={item.requester}
              imageUrl={item.images[0]}
              status={item.book_request_status}
              isExpired={item.is_expired}
              requestType={item.type}
              extensionStatus={item.lease_extension_status}
              isLeased={item.is_leased}
              date={item.requested_at}
              leaseDueDate={item?.lease_details?.lease_end_date || "NA"}
              onAccept={() => handleRequestConfirmation("Accepted", item.id)}
              onCancel={() => handleRequestConfirmation("Rejected", item.id)}
              loader={loader}
              ticketId={item.ticket_number}
              read_at={item.read_at}
              notification_id={item.notification_id}
              requestStatusToggle={() => setRequestStatus(!requestStatus)}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Image
              src="/svgs/books-not-found.svg"
              alt="books-not-found"
              width={500}
              height={500}
              className="!w-96 !h-96"
            />
            <p className="text-3xl text-center text-red-500 font-medium">
              No requests found!
            </p>
          </div>
        )}
        {paginationData.last_page > 1 && (
          <Pagination className="mt-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={
                    paginationData.current_page === 1
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                  aria-disabled={paginationData.current_page === 1}
                  onClick={() =>
                    paginationData.current_page > 1 &&
                    setCurrentPage(paginationData.current_page - 1)
                  }
                />
              </PaginationItem>
              {[...Array(paginationData.last_page)].map((_, pageIndex) => (
                <PaginationItem key={pageIndex}>
                  <PaginationLink
                    className={`cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={() => setCurrentPage(pageIndex + 1)}
                    isActive={paginationData.current_page === pageIndex + 1}
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  className={
                    paginationData.current_page === paginationData.last_page
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                  onClick={() =>
                    paginationData.current_page < paginationData.last_page &&
                    setCurrentPage(currentPage + 1)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>
      <Sheet
        open={isChatOpen}
        onOpenChange={(open) => {
          setIsChatOpen(open);
          if (!open) {
            setRequestStatus(!requestStatus);
            setIsSessionStorage(false);
            sessionStorage.clear();
          }
        }}
      >
        <SheetTrigger asChild>
          <Button className="hidden">Open Sheet</Button>
        </SheetTrigger>
        {isChatOpen && (
          <SheetContent className="w-full sm:max-w-lg p-3 sm:p-6">
            <SheetTitle className="border-gray-300 border-b-2 pb-3">
              <div className="flex items-center justify-between pr-10 sm:pr-8">
                {ownerName}
                {bookRequestStatus && bookRequestStatus === "Pending" && (
                  <div className="flex items-end gap-2">
                    <Button
                      variant="outline"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() =>
                        handleRequestConfirmation("Rejected", Number(itemId))
                      }
                    >
                      Reject
                    </Button>
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() =>
                        handleRequestConfirmation("Accepted", Number(itemId))
                      }
                    >
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            </SheetTitle>
            <ChatBox
              owner={ownerName || ""}
              ticketId={Number(ticketNumber)}
              isOwner={true}
            />
          </SheetContent>
        )}
      </Sheet>
    </React.Fragment>
  );
};

export default ReceivedRequests;
