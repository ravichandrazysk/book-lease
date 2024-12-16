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
import { CarouselSlider } from "@/components/common/CarousalSlider";

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
        const imgArr = topBannerAdds.data.data.map(
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
      <div className="max-sm:max-w-[345px]  sm:max-w-7xl mx-auto">
        {/* <section id="email-verify-button" className="mt-2">
          <EmailVerifyCard onVerify={handleEamilVerify} />
        </section> */}
        {topBannerAdds && topBannerAdds.length > 0 && (
          <section id="promotion-banner" className="sm:max-w-7xl mx-auto mt-2">
            <CarouselSlider
              sliderData={topBannerAdds}
              width={100}
              height={100}
            />
          </section>
        )}
        <section id="categorised-books" className="mt-8">
          {loader ? (
            <BooksGridSkeleton count={5} />
          ) : bookData && bookData.length > 0 ? (
            bookData.map((category: BookProps, index) => (
              <React.Fragment key={index}>
                {category.books && category.books.length > 0 && (
                  <BookGrid
                    id={category.id}
                    categoryName={category.name}
                    books={category.books}
                    maxBookCount={category.max_books_count}
                  />
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
