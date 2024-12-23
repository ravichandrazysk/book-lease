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
} from "../ui/pagination";
import {
  PaginationDataTypes,
  ReceivedRequestTypes,
} from "@/types/common-types";

export const ReceivedRequests = () => {
  const [loading, setLoading] = useState(false);
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

  const handleRequestConfirmation = async (
    actionStatus: string,
    requestId: number
  ) => {
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
        setRequestStatus(!requestStatus);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
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
              <StockCardLoader key={index} variant="sent" />
            ))}
          </>
        ) : receivedRequests && receivedRequests.length > 0 ? (
          receivedRequests.map((item: ReceivedRequestTypes) => (
            <StockDetailsCard
              key={item.id}
              variant="received"
              title={item.book_name}
              author={item.requester}
              imageUrl={item.images[0]}
              status={item.status}
              date={item.requested_at}
              onAccept={() => handleRequestConfirmation("Accepted", item.id)}
              onCancel={() => handleRequestConfirmation("Rejected", item.id)}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Image
              src="/pngs/books-not-found.png"
              alt="books-not-found"
              width={500}
              height={500}
              className="!w-96 !h-96"
            />
            <p className="text-3xl text-center text-red-500 font-medium">
              No Books found!
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
    </React.Fragment>
  );
};

export default ReceivedRequests;
