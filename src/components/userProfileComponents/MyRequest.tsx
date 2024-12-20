/* eslint-disable multiline-ternary */
/* eslint-disable no-extra-parens */
/* eslint-disable no-nested-ternary */
"use client";
import React, { useEffect, useState } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import StockCardLoader from "@/components/common/loaders/StockCardLoader";
import { StockDetailsCard } from "@/components/common/StockDetailsCard";
import { axiosInstance } from "@/utils/AxiosConfig";
import { isAxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

interface MyRequestTypes {
  id: 4;
  book_name: string;
  requested_at: string;
  status: string;
  images: string[];
}
const MyRequest = () => {
  const [loading, setLoading] = useState(false);
  const [myRequests, setMyRequests] = useState<MyRequestTypes[]>([]);

  useEffect(() => {
    const receiveRequests = async () => {
      try {
        const response = await axiosInstance.get("/my-requests");
        if (response.status === 200) {
          setMyRequests(response.data.data);
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
        }
      }
    };
    receiveRequests();
  }, []);
  return (
    <React.Fragment>
      <section
        id="my-books"
        className=" sm:w-11/12 md:mr-9 mx-auto max-md:w-[90%] my-5"
      >
        <header>
          <SectionHeader title={"My Requests"} />
        </header>

        {loading ? (
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <StockCardLoader key={index} variant="sent" />
            ))}
          </>
        ) : myRequests && myRequests.length > 0 ? (
          myRequests.map((item: MyRequestTypes) => (
            <StockDetailsCard
              key={item.id}
              variant="sent"
              title={item.book_name}
              imageUrl={item.images[0]}
              status={item.status}
              date={item.requested_at}
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

export default MyRequest;
