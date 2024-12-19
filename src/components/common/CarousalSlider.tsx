"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const DEFAULT_IMAGE = "/pngs/image-not-available.png";

export function CarouselSlider({
  sliderData,
  width,
  height,
}: {
  sliderData: string[];
  width?: number;
  height?: number;
}) {
  const [imgArr, setImgArr] = useState<string[]>(sliderData);
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );

  const handleImageError = (index: number) => {
    setImgArr((prev) => {
      const newArr = [...prev];
      newArr[index] = DEFAULT_IMAGE;
      return newArr;
    });
  };

  useEffect(() => {
    setImgArr(sliderData);
  }, [sliderData]);

  const renderCarouselItems = () => {
    if (imgArr.length === 0)
      return (
        <CarouselItem>
          <div className="p-1">
            <Card>
              <CardContent className=" p-0 aspect-auto ">
                <Image
                  src={DEFAULT_IMAGE}
                  alt="default-banner"
                  width={width}
                  height={height}
                  className=" rounded-lg object-contain"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      );

    return imgArr.map((item, index) => (
      <CarouselItem key={index}>
        <div className="p-1">
          <Card>
            <CardContent className=" p-0 aspect-auto ">
              <Image
                src={item}
                alt="promotional-banner"
                width={width}
                height={height}
                className="w-full max-h-[464px] rounded-lg object-fill"
                onError={() => handleImageError(index)}
              />
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    ));
  };

  return (
    <Carousel
      plugins={imgArr.length > 1 ? [plugin.current] : []}
      className="w-full "
      onMouseEnter={imgArr.length > 1 ? plugin.current.stop : () => {}}
      onMouseLeave={imgArr.length > 1 ? plugin.current.reset : () => {}}
    >
      <CarouselContent>{renderCarouselItems()}</CarouselContent>
      {imgArr.length > 1 && <CarouselPrevious />}
      {imgArr.length > 1 && <CarouselNext />}
    </Carousel>
  );
}
