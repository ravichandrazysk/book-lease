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
import { MyBookTypes, PaginationDataTypes } from "@/types/common-types";
import ConfirmationModal from "../modals/ConfirmationModel";

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
    description: "",
    condition: "",
    price: 0,
    discounted_price: "",
    is_free: false,
    active: false,
    category: { id: 0, name: "" },
    age_group: "",
    status: "",
    tags: [
      {
        id: 0,
        name: "",
      },
    ],
    slug: "",
    images: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<{
    active: boolean;
    slug: string;
  }>({ active: false, slug: "" });
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

  const handleAvailibility = async (
    availability: boolean,
    bookSlug: string
  ) => {
    try {
      const response = await axiosInstance.patch(
        `/update-book-available-status/${bookSlug}?available_status=${availability ? 1 : 0}`
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

  const handleToggleConfirmation = (
    availability: boolean,
    bookSlug: string
  ) => {
    setSelectedBook({ active: availability, slug: bookSlug });
    setShowModal(true);
  };

  const handleConfirmToggle = () => {
    handleAvailibility(selectedBook.active, selectedBook.slug);
    setShowModal(false);
    setSelectedBook({ active: false, slug: "" });
  };

  const handleCancelToggle = () => {
    setShowModal(false);
    setSelectedBook({ active: false, slug: "" });
  };

  return (
    <section id="my-books" className=" sm:w-11/12  mx-auto max-w-3xl my-5">
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
              slug={item.slug}
              author={item.author}
              imageUrl={
                item.images && item.images.length > 0
                  ? item.images[0]?.image_path
                  : "/pngs/Image-not-available.png"
              }
              isAvailable={item.status === "Available" ? true : false}
              status={item.availability === "Sell" ? "For Sale" : "For Rent"}
              onEdit={() => {
                setEditBook(true);
                setEditBookDetails(item);
              }}
              onToggle={() =>
                handleToggleConfirmation(
                  item.status === "Available" ? false : true,
                  item.slug
                )
              }
            />
          ))}
          {showModal && (
            <ConfirmationModal
              isOpen={showModal}
              onOpenChange={setShowModal}
              onConfirm={handleConfirmToggle}
              onCancel={handleCancelToggle}
              title="Confirm Action"
              body="Are you sure you want to change the availability of this book?"
            />
          )}
        </>
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
