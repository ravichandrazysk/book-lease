/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable multiline-ternary */
"use client";
import { CategorySection } from "@/components/common/CategorySection";
import CategoryViewSkeleton from "@/components/common/loaders/CategoryViewSkeleton";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import { axiosInstance } from "@/utils/AxiosConfig";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FilterContent } from "@/components/common/FilterContent";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface BookArrayProps {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: string;
  discounted_price: string;
  is_free: boolean;
  category: string;
  slug: string;
  images: { image_path: string }[];
}

interface BookMetaData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [checkedCategories, setCheckedCategories] = useState<string[]>([]);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const [checkedAgeGroups, setCheckedAgeGroups] = useState<string[]>([]);
  const [filteredBookData, setFilteredBookData] = useState<BookArrayProps[]>(
    []
  );
  const [bookMetaData, setBookMetaData] = useState<BookMetaData>({
    current_page: 1,
    last_page: 1,
    per_page: 1,
    total: 1,
  });

  const handleGetBooks = async () => {
    setLoader(true);
    try {
      const categoryQuery =
        checkedCategories && checkedCategories.length > 0
          ? `&${checkedCategories.map((item) => `categories[]=${item}`).join("&")}`
          : "";
      const tagQuery =
        checkedTags.length > 0 && checkedCategories.length > 0
          ? `&${checkedTags.map((item) => `tags[]=${item}`).join("&")}`
          : checkedTags.length > 0
            ? `&${checkedTags.map((item) => `tags[]=${item}`).join("&")}`
            : "";
      const ageQuery =
        checkedTags.length === 0 &&
        checkedCategories.length === 0 &&
        checkedAgeGroups.length > 0
          ? `&${checkedAgeGroups.map((item) => `age[]=${item}`).join("&")}`
          : checkedAgeGroups.length > 0
            ? `&${checkedAgeGroups.map((item) => `age[]=${item}`).join("&")}`
            : "";
      const booksData = await axiosInstance.get(
        `/filtered-books?&paginate=9&page=${currentPage}${categoryQuery}${tagQuery}${ageQuery}`
      );
      if (booksData.status === 200) {
        setFilteredBookData(booksData.data.data || []);
        setBookMetaData(booksData.data.meta);
        setLoader(false);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      setLoader(false);
      // eslint-disable-next-line no-console
      console.log("Error in getting books", error);
    }
  };

  useEffect(() => {
    handleGetBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedCategories, checkedTags, currentPage, checkedAgeGroups]);

  return (
    <React.Fragment>
      <HeaderFooterLayout>
        <div className="flex gap-9 max-sm:min-h-[650px] min-h-screen max-w-sm sm:max-w-7xl px-3 xl:px-0 mx-auto">
          <>
            {/* Responsive filter section */}
            <div className="hidden md:block pt-4">
              <FilterContent
                onCategoryChange={setCheckedCategories}
                onTagChange={setCheckedTags}
                onAgeGroupChange={setCheckedAgeGroups}
                checkedCategories={checkedCategories}
                checkedTags={checkedTags}
                checkedAgeGroups={checkedAgeGroups}
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden z-50 fixed bottom-10 right-4 w-fit h-fit flex items-center justify-end rounded-full p-3  bg-white !shadow-md"
                >
                  <Filter className="!h-9 !w-9" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] min-h-screen"
              >
                <SheetHeader>
                  <SheetTitle className="hidden"></SheetTitle>
                  <SheetDescription className="hidden"></SheetDescription>
                </SheetHeader>
                <FilterContent
                  onCategoryChange={setCheckedCategories}
                  onTagChange={setCheckedTags}
                  onAgeGroupChange={setCheckedAgeGroups}
                  checkedCategories={checkedCategories}
                  checkedTags={checkedTags}
                  checkedAgeGroups={checkedAgeGroups}
                />
              </SheetContent>
            </Sheet>
          </>

          {/* Filtered Books */}
          {loader ? (
            <CategoryViewSkeleton />
          ) : filteredBookData.length > 0 ? (
            <CategorySection
              paginationData={bookMetaData}
              filteredBookData={filteredBookData}
              onPageChange={setCurrentPage}
            />
          ) : (
            <>
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
            </>
          )}
        </div>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
