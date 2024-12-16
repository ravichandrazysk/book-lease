/* eslint-disable no-nested-ternary */
"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ComicCardProps {
  id: number;
  name: string;
  author: string;
  availability: string;
  price: string;
  discounted_price: string;
  is_free: boolean;
  category: string;
  images: { image_path: string }[];
  className?: string;
}

export function BookCard(props: ComicCardProps) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(
    props.images?.length > 0
      ? props.images[0]?.image_path
      : "/pngs/Image-not-available.png"
  );
  const categoryColors = {
    "For Sale": "bg-[#e0efff] text-[#007aff] hover:bg-[#e0efff]",
    "For Rent": "bg-[#f1e4ed] text-[#8A226F] hover:bg-[#f1e4ed]",
    "For Free": "bg-[#e6f8eb] text-[#34C759] hover:bg-[#e6f8eb]",
  };

  return (
    <Card
      className={`overflow-hidden shadow-none border-none rounded-none ${props.className}`}
    >
      <div
        className="relative aspect-[2/3] shadow-md rounded-sm border cursor-pointer overflow-hidden"
        onClick={() => {
          router.push(`/book-details/${props.id}`);
        }}
      >
        <Image
          src={imgSrc}
          alt={props.name}
          fill
          sizes="100%"
          className="object-scale-fill rounded-sm transition-transform hover:scale-105"
          priority
          onError={() => setImgSrc("/pngs/book-cover-img.png")}
        />
      </div>
      <CardContent className="py-4 px-0 flex gap-2">
        <Badge
          className={`${
            props.availability === "Sell"
              ? categoryColors["For Sale"]
              : props.is_free
                ? categoryColors["For Free"]
                : categoryColors["For Rent"]
          } rounded-[8px] font-medium px-3 py-1 text-sm `}
        >
          {props.availability === "Sell"
            ? "For Sale"
            : props.is_free
              ? "For Free"
              : "For Rent"}
        </Badge>
        <Badge
          className={`${
            props.availability === "Sell"
              ? categoryColors["For Sale"]
              : props.is_free
                ? categoryColors["For Free"]
                : categoryColors["For Rent"]
          } rounded-[8px] font-medium px-3 py-1 text-sm `}
        >
          {props.category && props.category}
        </Badge>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p  px-0 t-0">
        <p className="font-medium sm:text-lg">{props.name}</p>
        <div className="text-sm text-gray-400">By {props.author}</div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium text-[#FF851B]">
            {props.discounted_price
              ? `₹${props.discounted_price}`
              : "price not available"}
          </span>
          <span className="text-base font-normal text-[#D0CCCB] line-through">
            {props.price && `₹${props.price}`}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
