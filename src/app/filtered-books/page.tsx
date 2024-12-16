/* eslint-disable no-nested-ternary */
/* eslint-disable multiline-ternary */
"use client";
import { FilterSection } from "@/components/common/BookFilters";
import { CategorySection } from "@/components/common/CategorySection";
import CategoryViewSkeleton from "@/components/common/loaders/CategoryViewSkeleton";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import { axiosInstance } from "@/utils/AxiosConfig";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface BookArrayProps {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: string;
  discounted_price: string;
  is_free: boolean;
  category: string;
  images: { image_path: string }[];
}
interface BookProps {
  id: 1;
  name: string;
  max_books_count: number;
  books: BookArrayProps[];
}
const Page = () => {
  const [loader, setLoader] = useState(false);
  const [filteredBookData, setFilteredBookData] = useState<BookArrayProps[]>(
    []
  );
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined")
      setCategory(localStorage.getItem("category"));
  }, []);

  const handleGetBooks = async () => {
    setLoader(true);
    try {
      const booksData = await axiosInstance.get("/book-groups");
      if (booksData.status === 200 && category) {
        if (category === "All Books") {
          const allBooks = booksData.data.data.flatMap(
            (item: BookProps) => item.books
          );
          setFilteredBookData(allBooks || []);
          setLoader(false);
          return;
        }
        const filtredBooks = booksData.data.data.filter(
          (book: BookProps) => book.name === category
        );
        setFilteredBookData(filtredBooks[0]?.books || []);
      }
      setLoader(false);
      // eslint-disable-next-line brace-style
    } catch (error) {
      setLoader(false);
      // eslint-disable-next-line no-console
      console.log("Error in getting books", error);
    }
  };

  useEffect(() => {
    if (category) handleGetBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <React.Fragment>
      <HeaderFooterLayout>
        <div className="flex gap-9 max-sm:min-h-[650px] min-h-screen max-w-sm sm:max-w-7xl mx-auto">
          {loader ? (
            <CategoryViewSkeleton />
          ) : filteredBookData.length > 0 ? (
            <>
              <FilterSection />
              <CategorySection
                filteredBookData={filteredBookData}
                title={category || ""}
              />
            </>
          ) : (
            <div className="w-full mx-auto my-auto">
              <Image
                src="/pngs/books-not-found.png"
                alt="books-not-found"
                width={700}
                height={700}
                className=" mx-auto max-h-96 "
              />
              <p className="text-3xl text-center text-red-500 font-medium">
                No books found!
              </p>
            </div>
          )}
        </div>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
