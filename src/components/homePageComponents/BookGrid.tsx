"use client";
import { ChevronRight } from "lucide-react";
import { BookCard } from "@/components/common/BookCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { BookGroupProps, BookDataType } from "@/types/common-types";

export default function BookGrid({ books, name }: BookGroupProps) {
  const router = useRouter();
  const handleViewMore = () => {
    router.push(`/filtered-books`);
  };
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="space-y-4 mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] font-medium text-black">{name}</h2>
        {books && books.length > 10 && (
          <Button
            variant="link"
            className="font-medium text-[#0070C4] hover:text-blue-400"
            onClick={handleViewMore}
          >
            View more <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="md:grid gap-4 md:grid-cols-3 lg:grid-cols-5 hidden">
        {books &&
          books.length > 0 &&
          books
            .slice(0, 10)
            .map((book: BookDataType) => (
              <BookCard
                key={book.id}
                id={book.id}
                name={book.name}
                author={book.author}
                availability={book.availability}
                price={book.price}
                discounted_price={book.discounted_price}
                is_free={book.is_free}
                category={book.category.name}
                slug={book.slug}
                images={book.images}
              />
            ))}
      </div>

      <div className="md:hidden">
        <Slider {...sliderSettings}>
          {books &&
            books.length > 0 &&
            books.slice(0, 10).map((book: BookDataType) => (
              <div key={book.id} className="px-1">
                <BookCard
                  id={book.id}
                  name={book.name}
                  author={book.author}
                  availability={book.availability}
                  price={book.price}
                  discounted_price={book.discounted_price}
                  is_free={book.is_free}
                  category={book.category.name}
                  slug={book.slug}
                  images={book.images}
                />
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
}
