"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PromotionalBannerProps {
  offerDiscount: string;
}
export default function PromotionalBanner({
  offerDiscount,
  // eslint-disable-next-line object-curly-newline
}: PromotionalBannerProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg">
      <div className="relative flex min-h-[400px] w-full items-center bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-200 px-6 py-16 md:px-12">
        <div className="z-10 max-w-xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-white">
            Sale up to {offerDiscount} off
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl">
            Meet Your Next
            <br />
            Favorite Books.
          </h1>
          <Button
            className="group inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50"
            variant="secondary"
          >
            Shop Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 transform md:block">
          <div className="relative h-[300px] w-[400px]">
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Collection of children's books"
              width={400}
              height={300}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
