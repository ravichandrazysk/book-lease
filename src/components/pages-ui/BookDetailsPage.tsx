/* eslint-disable no-extra-parens */
/* eslint-disable indent */
/* eslint-disable multiline-ternary */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CustomToast } from "@/components/common/CustomToast";
import { useEffect, useState } from "react";
import { ExtendRentalDialog } from "@/components/bookDetails.tsx/ExtendRentalDialog";
import { axiosInstance } from "@/utils/AxiosConfig";
import { CarouselSlider } from "../common/CarousalSlider";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { convertDate } from "@/utils/Utilities";

import BookDetailSkeleton from "@/components/common/loaders/BookDetailSkeleton";
import Lottie from "react-lottie-player";
import { BookDetailsType } from "@/types/common-types";

export function BookDetails() {
  const { bookId } = useParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [bookImages, setBookImages] = useState<string[]>([]);
  const [bookDetails, setBookDetails] = useState<BookDetailsType>({
    id: 0,
    owner: "",
    category: "",
    name: "",
    author: "",
    description: "",
    price: "",
    discounted_price: "",
    is_free: "",
    availability: "",
    slug: "",
    status: "",
    condition: "",
    approved_at: "",
    is_active: false,
    tags: "",
    is_requested: false,
    request_id: null,
    is_leased: false,
    is_buy: false,
    images: [],
    can_extend_lease: false,
  });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [extendsionDuration, setExtensionDuration] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const handleGetBookDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/books/${bookId}`);
      if (response.status === 200) {
        setBookDetails(response.data.data);
        const imgArr = response.data.data.images.map(
          (item: { image_path: string }) => item.image_path
        );
        setBookImages(imgArr);
        setLoading(false);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      setLoading(false);
      // eslint-disable-next-line no-console
      console.log("Something went wrong", error);
    }
    setLoading(false);
  };

  const handleRequest = async () => {
    setButtonLoading(true);
    if (!session) {
      setButtonLoading(false);
      router.push("/login");
      return;
    }
    if (
      !bookDetails.is_leased &&
      !bookDetails.is_requested &&
      !bookDetails.is_buy
    ) {
      const formData = new FormData();

      formData.append(
        "type",
        bookDetails.availability === "Sell" ? "Buy" : "Lease"
      );
      const response = await axiosInstance.post(
        `/request-book/${bookId}`,
        formData
      );
      if (response.status === 201) {
        setButtonLoading(false);
        toast({
          duration: 5000,
          className: "p-0 bg-transparent border-none",
          action: (
            <CustomToast
              title={response.data.message}
              description="You'll receive a notification once your request is accepted."
            />
          ),
        });
        setIsRequested(true);
      }
      // eslint-disable-next-line prettier/prettier, brace-style
    }
  };

  const handleExtendRequest = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("book_request_id", bookDetails.id.toString());
      formData.append("days", extendsionDuration.toString());
      const response = await axiosInstance.post(
        `/lease-date-extension`,
        formData
      );

      toast({
        duration: 5000,
        className: "p-0 bg-transparent border-none",
        action: (
          <CustomToast
            title={response.data.message}
            description="You'll receive a notification once your request is accepted."
          />
        ),
      });
      // eslint-disable-next-line brace-style
    } catch (error) {
      toast({ variant: "destructive", description: "Something went wrong" });
      // eslint-disable-next-line no-console
      console.log("Something went wrong", error);
    }
  };
  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
    handleGetBookDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRequested]);

  useEffect(() => {
    if (bookDetails.description) {
      const lineCount = bookDetails.description.split("\n").length;
      setIsDescriptionLong(lineCount > 2);
    }
  }, [bookDetails.description]);

  const categoryColors = {
    "For Sale": "bg-[#e0efff] text-[#007aff] hover:bg-[#e0efff]",
    "For Rent": "bg-[#f1e4ed] text-[#8A226F] hover:bg-[#f1e4ed]",
    "For Free": "bg-[#e6f8eb] text-[#34C759] hover:bg-[#e6f8eb]",
  };
  return loading ? (
    <div className="max-w-6xl mx-auto ">
      <BookDetailSkeleton />
    </div>
  ) : (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="max-w-xs sm:max-w-xl w-full mx-auto">
          <CarouselSlider sliderData={bookImages} width={400} height={400} />
        </div>
        <div className="space-y-5">
          <Badge
            variant="secondary"
            className={`${
              bookDetails.availability === "Sell"
                ? categoryColors["For Sale"]
                : bookDetails.is_free
                  ? categoryColors["For Free"]
                  : categoryColors["For Rent"]
            }min-h-7 text-sm font-medium`}
          >
            {bookDetails.availability === "Sell"
              ? "For Sale"
              : bookDetails.is_free
                ? "For Free"
                : "For Rent"}
          </Badge>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {bookDetails.name}
            </h1>
            <p className="text-muted-foreground">
              By(author){" "}
              <span className="font-medium text-black">
                {bookDetails.author}
              </span>
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-500">
              {" "}
              {bookDetails.discounted_price
                ? `₹${bookDetails.discounted_price}`
                : "price not available"}
            </span>
            <span className="text-lg text-muted-foreground line-through">
              {bookDetails.price && `₹${bookDetails.price}`}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Categories:</h3>
            <Badge variant="outline" className="min-h-7">
              {bookDetails.category}
            </Badge>
          </div>

          {bookDetails.description && (
            <div className="space-y-3">
              <p
                className={`text-muted-foreground ${showFullDescription ? "" : "line-clamp-2"}`}
              >
                {bookDetails.description}
              </p>
              {isDescriptionLong && (
                <Button
                  variant="link"
                  className="h-auto p-0 text-primary"
                  onClick={handleToggleDescription}
                >
                  {showFullDescription ? "See less" : "See more"}
                </Button>
              )}
            </div>
          )}

          <Button
            className="w-full sm:max-w-sm text-xl bg-orange-500 hover:bg-orange-600 sm:min-h-14"
            onClick={() => {
              if (!bookDetails.is_requested && !bookDetails.is_leased) {
                handleRequest();
                return;
              }
              if (bookDetails.is_leased && !bookDetails.is_requested) {
                setShowExtendModal(true);
                return;
              }
            }}
            disabled={
              // eslint-disable-next-line no-extra-parens
              (bookDetails.is_requested && !bookDetails.is_leased) ||
              // eslint-disable-next-line no-extra-parens
              (bookDetails.is_requested && bookDetails.is_leased) ||
              // eslint-disable-next-line no-extra-parens
              (!bookDetails.can_extend_lease &&
                !bookDetails.is_requested &&
                bookDetails.is_leased) ||
              bookDetails.is_buy ||
              // eslint-disable-next-line no-extra-parens
              isRequested
            }
          >
            {buttonLoading ? (
              <div className="flex justify-center items-center w-full max-h-5">
                <Lottie
                  loop
                  path="/lotties/button-loader.json"
                  play
                  style={{ width: "50%" }}
                />
              </div>
            ) : !session ? (
              "Login to request book"
            ) : bookDetails.availability === "Sell" && bookDetails.is_buy ? (
              "Sold out"
            ) : !bookDetails.can_extend_lease &&
              !bookDetails.is_requested &&
              bookDetails.is_leased ? (
              "Leased"
            ) : bookDetails.availability !== "Sell" &&
              bookDetails.is_leased &&
              !bookDetails.is_requested &&
              bookDetails.can_extend_lease ? (
              "Extend Request"
            ) : // eslint-disable-next-line no-extra-parens, indent
            (bookDetails.is_requested && !bookDetails.is_leased) ||
              // eslint-disable-next-line no-extra-parens
              (bookDetails.is_requested && bookDetails.is_leased) ||
              // eslint-disable-next-line no-extra-parens
              isRequested ? (
              "Waiting for Approval"
            ) : (
              !bookDetails.is_requested &&
              !bookDetails.is_leased &&
              !bookDetails.is_buy &&
              "Send Request"
            )}
          </Button>
          {bookDetails.is_leased &&
            bookDetails?.lease_details?.lease_end_date && (
              <p className="text-lg font-normal">
                Lease Due Date:
                <span className="font-medium">
                  {convertDate(bookDetails?.lease_details?.lease_end_date)}
                </span>
              </p>
            )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-medium">Tags:</h3>
              <p className="text-muted-foreground">
                First Edition, Space, Fantasy
              </p>
            </div>
            {bookDetails.is_leased && (
              <div>
                <h3 className="font-medium">Lease Duration:</h3>
                <p className="text-muted-foreground">21 days</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ExtendRentalDialog
        open={showExtendModal}
        onOpenChange={setShowExtendModal}
        extendDays={setExtensionDuration}
        currentDueDate={
          bookDetails.is_leased && bookDetails?.lease_details?.lease_end_date
            ? new Date(bookDetails.lease_details.lease_end_date)
            : null
        }
        onConfirm={() => {
          handleExtendRequest();
        }}
      />
    </div>
  );
}
