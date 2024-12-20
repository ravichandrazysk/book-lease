/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable multiline-ternary */
"use client";
import React, { useEffect, useState } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StockDetailsCard } from "@/components/common/StockDetailsCard";
import { BookCreateForm } from "./BookCreateForm";
import StockCardLoader from "@/components/common/loaders/StockCardLoader";
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

interface MyBookTypes {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: number | null;
  discounted_price: string;
  is_free: boolean;
  active: boolean;
  category: string;
  images: { image_path: string }[];
}
interface PaginationDataTypes {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
const MyBooks = () => {
  const [createNewBook, setCreateNewBook] = useState(false);
  const [editBook, setEditBook] = useState(false);
  const [myBooks, setMyBooks] = useState<MyBookTypes[]>([]);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [updatedBooks, setUpdatedBooks] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginationDataTypes>({
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: 1,
  });
  const [editBoookDetails, setEditBookDetails] = useState<MyBookTypes>({
    id: 0,
    name: "",
    author: "",
    availability: "",
    price: 0,
    discounted_price: "",
    is_free: false,
    active: false,
    category: "",
    images: [],
  });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const handleGetBooks = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/my-books?paginate=10&page=${currentPage}`
        );
        if (response.status === 200) {
          setMyBooks(response.data.data);
          setPaginationData(response.data.meta);
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
            title: "Error!",
            description: error.response.data.message,
          });
          setLoading(false);
          // eslint-disable-next-line no-console
          console.log(error.response?.data.message);
          // eslint-disable-next-line brace-style
        } else
          toast({
            variant: "destructive",
            title: "Error!",
            description: "Something went wrong",
          });
      }
    };
    handleGetBooks();
  }, [updatedBooks, currentPage]);

  const handleAvailibility = async (availability: boolean, bookId: number) => {
    try {
      const response = await axiosInstance.patch(
        `/update-book-available-status/${bookId}?is_active=${availability ? 1 : 0}`
      );
      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Success!",
          description: response.data.message,
        });
        setUpdatedBooks(!updatedBooks);
      }
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
          title: "Error!",
          description: error.response.data.message,
        });
      else
        toast({
          variant: "destructive",
          title: "Error!",
          description: "Something went wrong",
        });
    }
  };

  return (
    <section id="my-books" className=" sm:w-11/12  mx-auto  my-5">
      <header>
        <SectionHeader
          title={
            createNewBook
              ? "Add a New Book Listing"
              : editBook
                ? "Edit Book Details"
                : "My Books"
          }
          showListButton={!createNewBook && !editBook}
          onListClick={() => {
            setCreateNewBook(true);
            setEditBook(false);
          }}
        />
      </header>
      {loading ? (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <StockCardLoader key={index} variant="books" />
          ))}
        </>
      ) : createNewBook || editBook ? (
        <BookCreateForm
          isEditing={editBook}
          onAction={() => {
            setCreateNewBook(false);
            setEditBook(false);
          }}
          existingBookDetails={editBoookDetails}
          refetchBooks={() => setUpdatedBooks(!updatedBooks)}
        />
      ) : myBooks && myBooks.length > 0 ? (
        <>
          {myBooks.map((item, index) => (
            <StockDetailsCard
              key={index}
              variant="books"
              title={item.name}
              author={item.author}
              imageUrl={
                item.images && item.images.length > 0
                  ? item.images[0]?.image_path
                  : "/pngs/Image-not-available.png"
              }
              isAvailable={item.active}
              status={item.availability === "Sell" ? "For Sale" : "For Rent"}
              onEdit={() => {
                setEditBook(true);
                setEditBookDetails(item);
              }}
              onToggle={() => handleAvailibility(!item.active, item.id)}
            />
          ))}
        </>
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
      {!createNewBook && !editBook && paginationData.last_page > 1 && (
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
                  handlePageChange(paginationData.current_page - 1)
                }
              />
            </PaginationItem>
            {[...Array(paginationData.last_page)].map((_, pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  className={`cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => handlePageChange(pageIndex + 1)}
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
                  handlePageChange(currentPage + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};

export default MyBooks;
