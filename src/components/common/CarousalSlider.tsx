/* eslint-disable no-extra-parens */ /* eslint-disable multiline-ternary */ import React, {
  useEffect,
  useState,
} from "react";
import Slider from "react-slick";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
const DEFAULT_IMAGE = "/path/to/default-image.jpg";
interface CarousalSliderProps {
  sliderData: string[];
  width: number;
  height: number;
  isTopBanner: boolean;
}
export default function CarousalSlider({
  sliderData,
  width,
  height,
  isTopBanner,
}: CarousalSliderProps) {
  const [imgArr, setImgArr] = useState<string[]>(sliderData);
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
  const CustomArrow = ({
    direction,
    onClick,
  }: {
    direction: "left" | "right";
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`hidden sm:flex absolute top-1/2 transform -translate-y-1/2 z-10 p-2 ${direction === "left" ? "-left-12" : "-right-12"}`}
    >
      {" "}
      {direction === "left" ? (
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      ) : (
        <ChevronRight className="h-6 w-6 text-gray-700" />
      )}{" "}
    </button>
  );
  const settings = {
    dots: true,
    infinite: imgArr.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
  };
  return (
    <Slider {...settings}>
      {" "}
      {imgArr.length === 0 ? (
        <div>
          {" "}
          <Card>
            {" "}
            <CardContent className="p-0">
              {" "}
              <Image
                src={DEFAULT_IMAGE}
                alt="default-banner"
                width={width}
                height={height}
                className={`rounded-lg object-cover w-full ${isTopBanner ? "aspect-[3/1]" : "aspect-[2/3]"}`}
              />{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>
      ) : (
        imgArr.map((img, index) => (
          <div key={index}>
            {" "}
            <Card>
              {" "}
              <CardContent className="p-0">
                {" "}
                <Image
                  src={img}
                  alt={`carousel-image-${index}`}
                  width={width}
                  height={height}
                  onError={() => handleImageError(index)}
                  className={`rounded-lg object-cover w-full ${isTopBanner ? "aspect-[3/1]" : "aspect-[2/3]"}`}
                />{" "}
              </CardContent>{" "}
            </Card>{" "}
          </div>
        ))
      )}{" "}
    </Slider>
  );
}
