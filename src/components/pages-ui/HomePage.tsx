/* eslint-disable multiline-ternary */
/* eslint-disable no-extra-parens */
/* eslint-disable no-nested-ternary */
"use client";
import React, { useEffect, useState } from "react";
import BookGrid from "@/components/homePageComponents/BookGrid";
// Import { EmailVerifyCard } from "@/components/homePageComponents/EmailVerifyCard";
import Image from "next/image";
import { BooksGridSkeleton } from "@/components/common/loaders/BooksGridSkeleton";
import { axiosInstance } from "@/utils/AxiosConfig";
import CarouselSlider from "@/components/common/CarousalSlider";
import { BookGroupProps } from "@/types/common-types";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage = () => {
  const [loader, setLoader] = useState(true);
  const [bookData, setBookData] = useState([]);
  const [topBannerAdds, setTopBannerAdds] = useState([]);

  const handleGetBooks = async () => {
    setLoader(true);
    try {
      const booksData = await axiosInstance.get("/book-groups");
      if (booksData.status === 200) setBookData(booksData.data.data);
      setLoader(false);
      // eslint-disable-next-line brace-style, @typescript-eslint/no-unused-vars
    } catch (error) {
      setLoader(false);
    }
  };
  const handleGetTopBannerAdds = async () => {
    try {
      const topBannerAdds = await axiosInstance.get(
        "/featured-contents?section=Home Page Top&type=Banner"
      );
      if (topBannerAdds.status === 200) {
        const imgArr =
          topBannerAdds.data &&
          topBannerAdds.data.data &&
          topBannerAdds.data.data.length > 0 &&
          topBannerAdds.data.data.map(
            (item: { banner_image: string }) => item.banner_image
          );
        setTopBannerAdds(imgArr);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Error in getting top banner adds data", error);
    }
  };

  useEffect(() => {
    handleGetBooks();
    handleGetTopBannerAdds();
  }, []);
  // Const handleEamilVerify = () => {};
  return (
    <React.Fragment>
      <div className="max-w-7xl mx-auto px-3 xl:px-0">
        {/* <section id="email-verify-button" className="mt-2">
          <EmailVerifyCard onVerify={handleEamilVerify} />
        </section> */}
        {topBannerAdds && topBannerAdds.length > 0 && (
          <section
            id="promotion-banner"
            className="sm:max-w-7xl mx-auto sm:mx-12 mt-2"
          >
            <CarouselSlider
              sliderData={topBannerAdds}
              width={1440}
              height={600}
              isTopBanner={true}
            />
          </section>
        )}
        <section id="categorised-books" className="mt-8">
          {loader ? (
            <div>
              <Skeleton className="min-h-5 rounded-lg w-20 " />
              <BooksGridSkeleton count={5} />
            </div>
          ) : bookData && bookData?.length > 0 ? (
            bookData?.map((category: BookGroupProps, index) => (
              <React.Fragment key={index}>
                {category.books && category.books.length > 0 && (
                  <BookGrid {...category} />
                )}
              </React.Fragment>
            ))
          ) : (
            <div className=" ">
              <div className="">
                <Image
                  src="/pngs/books-not-found.png"
                  alt="books-not-found"
                  width={240}
                  height={800}
                  className=" w-full max-w-5xl mx-auto h-96 max-h-96 max-sm:max-w-sm"
                />
                <p className="text-3xl text-center text-red-500 font-medium">
                  No books found!
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </React.Fragment>
  );
};

export default HomePage;
