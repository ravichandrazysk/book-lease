"use client";
import { ChevronRight } from "lucide-react";
import { BookCard } from "@/components/common/BookCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
interface BookProps {
  id: 1;
  categoryName: string;
  maxBookCount?: number;
  books: BookArrayProps[];
}

export default function BookGrid({ categoryName, books }: BookProps) {
  const router = useRouter();
  const handleViewMore = () => {
    router.push(`/filtered-books`);
  };
  return (
    <div className="space-y-4 mt-12 ">
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] font-medium text-black">{categoryName}</h2>
        {books && books.length > 10 && (
          <Button
            variant="link"
            className=" font-medium text-[#0070C4] hover:text-blue-400"
            onClick={handleViewMore}
          >
            View more <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {books &&
          books.length > 0 &&
          books.map((comic, index) => {
            if (index > 9) return;
            else return <BookCard key={index} {...comic} />;
          })}
      </div>
    </div>
  );
}
