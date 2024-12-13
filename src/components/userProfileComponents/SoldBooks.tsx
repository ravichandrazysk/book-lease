/* eslint-disable no-nested-ternary */
/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
"use client";
import React, { useEffect, useState } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StockDetailsCard } from "@/components/common/StockDetailsCard";
import StockCardLoader from "../common/loaders/StockCardLoader";
import { axiosInstance } from "@/utils/AxiosConfig";
import { isAxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

interface SoldBookProps {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: string;
  discounted_price: string;
  is_free: boolean;
  category: string;
  images: string[];
}
const SoldBooks = () => {
  const [soldBooks, setSoldBooks] = useState<SoldBookProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState("/pngs/Image-not-available.png");

  useEffect(() => {
    const getSoldBooks = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/sold-books");
        if (response.status === 200 && response.data.data) {
          setSoldBooks(response.data.data);
          if (response.data.data[0].images.length > 0)
            setImgSrc(response.data.data[0].images[0]);
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
    getSoldBooks();
  }, []);
  return (
    <React.Fragment>
      <section id="sold" className=" sm:w-11/12  my-5">
        <header>
          <SectionHeader title="Sold Books" />
        </header>

        <>
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <StockCardLoader key={index} variant="sold" />
            ))
          ) : soldBooks && soldBooks.length > 0 ? (
            soldBooks.map((item) => (
              <StockDetailsCard
                key={item.id}
                bookId={item.id}
                variant="sold"
                title={item.name}
                author={item.author}
                imageUrl={imgSrc}
                date="22-10-2024"
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
                No sold books found!
              </p>
            </div>
          )}
        </>
      </section>
    </React.Fragment>
  );
};

export default SoldBooks;
