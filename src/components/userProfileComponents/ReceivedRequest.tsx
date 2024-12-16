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

interface ReceivedRequestTypes {
  id: 4;
  book_name: string;
  requester: string;
  requested_at: string;
  status: string;
  type: string;
  images: string[];
}
export const ReceivedRequests = () => {
  const [loading, setLoading] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState<
    ReceivedRequestTypes[]
  >([]);
  const [requestStatus, setRequestStatus] = useState<boolean>(false);

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
        const response = await axiosInstance.get("/received-requests");
        if (response.status === 200) {
          setReceivedRequests(response.data.data);
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
  }, [requestStatus]);
  return (
    <React.Fragment>
      <section
        id="my-books"
        className=" sm:w-11/12 md:mr-9 mx-auto max-md:w-[90%] my-5"
      >
        <header>
          <SectionHeader title={"My Request"} />
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
              title="Received Requests"
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
      </section>
    </React.Fragment>
  );
};

export default ReceivedRequests;
