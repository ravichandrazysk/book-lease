/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
/* eslint-disable indent */
"use client";
import React, { useEffect, useState } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StockDetailsCard } from "@/components/common/StockDetailsCard";
import StockCardLoader from "../common/loaders/StockCardLoader";
import Image from "next/image";
import { axiosInstance } from "@/utils/AxiosConfig";
import { toast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { PaginationDataTypes, RentalBookProps } from "@/types/common-types";

const MyRentals = () => {
  const [rentalBooks, setRentalBooks] = useState<RentalBookProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState("/pngs/Image-not-available.png");
  const [paginationData, setPaginationData] = useState<PaginationDataTypes>({
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const getRentals = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/customer/my-rentals?paginate=10&page=${currentPage}`
        );
        if (response.status === 200 && response.data.data) {
          setRentalBooks(response.data.data);
          if (response.data.data[0].images.length > 0)
            setImgSrc(response.data.data[0].images[0]);
          setPaginationData(response.data?.meta);
          setLoading(false);
        }
        // eslint-disable-next-line brace-style
      } catch (error) {
        setLoading(false);
        if (
          isAxiosError(error) &&
          error.status &&
          error.status >= 400 &&
          error.response
        )
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong!",
          });
      }
    };
    getRentals();
  }, [currentPage]);
  return (
    <React.Fragment>
      <section id="my-rentals" className=" sm:w-11/12  my-5 mx-auto max-w-3xl">
        <header>
          <SectionHeader title="My Rental Library" />
        </header>

        <>
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <StockCardLoader key={index} variant="rental" />
            ))
          ) : rentalBooks && rentalBooks.length > 0 ? (
            rentalBooks.map((item) => (
              <StockDetailsCard
                key={item.id}
                slug={item.slug}
                bookId={item.id}
                variant="rental"
                title={item.book}
                author={item.author}
                imageUrl={imgSrc}
                date={item.lease_end_date}
                imageError={() => setImgSrc("/pngs/Image-not-available.png")}
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
                No rentals found!
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
        </>
      </section>
    </React.Fragment>
  );
};

export default MyRentals;
