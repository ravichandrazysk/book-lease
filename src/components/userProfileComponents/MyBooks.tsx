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

interface MyBookTypes {
  id: number;
  name: string;
  author: string;
  availability: "Sell" | "Lease";
  price: number;
  discounted_price: string;
  is_free: boolean;
  category: string;
  images: { image_path: string }[];
}
const MyBooks = () => {
  const [createNewBook, setCreateNewBook] = useState(false);
  const [editBook, setEditBook] = useState(false);
  const [myBooks, setMyBooks] = useState<MyBookTypes[]>([]);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleGetBooks = async () => {
      try {
        const response = await axiosInstance.get("/my-books");
        if (response.status === 200) {
          setMyBooks(response.data.data);
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
  }, []);

  return (
    <section
      id="my-books"
      className=" sm:w-11/12 md:mr-9 max-md:mx-auto max-sm:max-w-[345px] my-5"
    >
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
          onListClick={() => setCreateNewBook(true)}
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
        />
      ) : myBooks && myBooks.length > 0 ? (
        <>
          {myBooks.map((item, index) => (
            <StockDetailsCard
              key={index}
              variant="books"
              title="My Books"
              author={item.author}
              imageUrl={item.images[0].image_path}
              isAvailable={item.availability === "Sell"}
              status={item.availability === "Sell" ? "For Sale" : "For Rent"}
              onEdit={() => setEditBook(true)}
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
    </section>
  );
};

export default MyBooks;
