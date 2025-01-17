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
import { useContext, useEffect, useState } from "react";
import { ExtendRentalDialog } from "@/components/modals/ExtendRentalDialog";
import { axiosInstance } from "@/utils/AxiosConfig";
import CarouselSlider from "@/components/common/CarousalSlider";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { convertDate } from "@/utils/Utilities";

import BookDetailSkeleton from "@/components/common/loaders/BookDetailSkeleton";
import Lottie from "react-lottie-player";
import { BookDetailsType, BookGroupProps } from "@/types/common-types";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ChatBox from "@/components/common/ChatBox";
import GlobalContext from "@/contexts/GlobalContext";
import { isAxiosError } from "axios";
import TextClamper from "@/components/common/TextClamper";
import BookGrid from "../homePageComponents/BookGrid";
import { BooksGridSkeleton } from "../common/loaders/BooksGridSkeleton";
import { Skeleton } from "../ui/skeleton";

export function BookDetails() {
  const { bookId } = useParams();
  const { data: session } = useSession();
  const { profileDetails } = useContext(GlobalContext);
  const { toast } = useToast();
  const router = useRouter();
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [bookImages, setBookImages] = useState<string[]>([]);
  const [isRequested, setIsRequested] = useState(false);
  const [extendsionDuration, setExtensionDuration] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [relatedBookLoading, setRelatedBookLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [ticketId, setTicketId] = useState<number>(0);
  const [relatedBooks, setRelatedBooks] = useState<BookGroupProps>({
    id: 0,
    name: "",
    max_books_count: 0,
    books: [],
  });
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
    ticket_number: "",
    owner_id: null,
    is_expired: false,
  });

  // Function to fetch book details
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
        if (response.data.data.is_requested && !response.data.data.is_leased)
          setIsRequested(true);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      setLoading(false);
      // eslint-disable-next-line no-console
      console.log("Something went wrong", error);
    }
    setLoading(false);
  };

  // Function to handle fresh request to book
  const handleRequest = async () => {
    setButtonLoading(true);
    if (!session) {
      setButtonLoading(false);
      router.push("/login");
      return;
    }
    try {
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
          setIsRequested(true);
          setTicketId(response.data.ticket_number);
          setIsSheetOpen(true);
        }
        // eslint-disable-next-line prettier/prettier, brace-style
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      setButtonLoading(false);
      if (
        isAxiosError(error) &&
        error.status &&
        error.status >= 400 &&
        error.status < 500 &&
        error.response
      )
        toast({
          variant: "destructive",
          description: error.response.data.message,
        });
      else
        toast({ variant: "destructive", description: "Something went wrong" });
    }
  };

  // Function to handle lease extension request
  const handleExtendRequest = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("book_request_id", bookDetails.request_id as string);
      formData.append("days", extendsionDuration.toString());
      const response = await axiosInstance.post(
        `/lease-date-extension`,
        formData
      );
      if (response.status === 200) {
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
        setIsSheetOpen(true);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      setButtonLoading(false);
      if (
        isAxiosError(error) &&
        error.status &&
        error.status >= 400 &&
        error.status < 500 &&
        error.response
      )
        toast({
          variant: "destructive",
          description: error.response.data.message,
        });
      else
        toast({ variant: "destructive", description: "Something went wrong" });
    }
  };

  // Fetch book details on component mount
  useEffect(() => {
    handleGetBookDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRequested]);

  useEffect(() => {
    const handleGetRelatedBooks = async () => {
      setRelatedBookLoading(true);
      try {
        const response = await axiosInstance.get(
          `/book-categories?category=${bookDetails.category}`
        );
        if (response.status === 200) {
          setRelatedBooks(response.data.data[0]);
          setRelatedBookLoading(false);
        }
        // eslint-disable-next-line brace-style
      } catch (error) {
        setRelatedBookLoading(false);
        // eslint-disable-next-line no-console
        console.log(error, "Something went wrong");
        // eslint-disable-next-line brace-style
      } finally {
        setRelatedBookLoading(false);
      }
    };
    if (bookDetails.category) handleGetRelatedBooks();
  }, [bookDetails]);

  // Book category colors
  const categoryColors = {
    "For Sale": "bg-[#e0efff] text-[#007aff] hover:bg-[#e0efff]",
    "For Rent": "bg-[#f1e4ed] text-[#8A226F] hover:bg-[#f1e4ed]",
    "For Free": "bg-[#e6f8eb] text-[#34C759] hover:bg-[#e6f8eb]",
  };

  return loading ? (
    <div className="container mx-auto px-4 py-6">
      <BookDetailSkeleton />
    </div>
  ) : (
    <section id="book-details" className="container mx-auto px-4 py-6">
      <section id="book-card-details" className="grid gap-5 md:grid-cols-2">
        <section id="book-photo" className="max-w-xs w-full mx-auto">
          <CarouselSlider
            sliderData={bookImages}
            width={300}
            height={450}
            isTopBanner={false}
          />
        </section>

        <div className="space-y-5">
          {/* Badge to the book */}
          {bookDetails.availability !== "" && (
            <Badge
              variant="secondary"
              className={`${
                bookDetails.availability === "Sell"
                  ? categoryColors["For Sale"]
                  : categoryColors["For Rent"]
              }min-h-7 text-sm font-medium`}
            >
              {bookDetails.availability === "Sell" ? "For Sale" : "For Rent"}
            </Badge>
          )}

          {/* Book title and author */}
          <section id="book-title-author" className="space-y-2">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {bookDetails.name}
            </h1>
            <p className="text-muted-foreground">
              By(author){" "}
              <span className="font-medium text-black">
                {bookDetails.author}
              </span>
            </p>
          </section>

          {/* Book price details */}
          <section id="book-price" className="flex items-baseline gap-2">
            {!bookDetails.is_free ? (
              <>
                <span className="text-3xl font-bold text-orange-500">
                  {" "}
                  {bookDetails.discounted_price
                    ? `₹${bookDetails.discounted_price}`
                    : !bookDetails.discounted_price && bookDetails.price
                      ? `₹${bookDetails.price}`
                      : "price not available"}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {bookDetails.price &&
                    bookDetails.discounted_price &&
                    `₹${bookDetails.price}`}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-orange-500">
                For free
              </span>
            )}
          </section>

          {/* Book category */}
          <section className="flex items-center gap-2">
            <h3 className="font-medium">Categories:</h3>
            <Badge variant="outline" className="min-h-7">
              {bookDetails.category}
            </Badge>
          </section>

          <TextClamper
            text={bookDetails.description}
            TextContainerClassName="space-y-3"
          />

          {profileDetails.id !== bookDetails.owner_id && (
            <Button
              className="w-full  text-base sm:max-w-sm sm:text-xl bg-orange-500 hover:bg-orange-600 sm:min-h-14"
              onClick={() => {
                if (!bookDetails.is_requested && !bookDetails.is_leased) {
                  handleRequest();
                  return;
                }
                if (
                  (!bookDetails.is_requested && !bookDetails.is_leased) ||
                  ((bookDetails.is_requested || bookDetails.is_leased) &&
                    !bookDetails.is_expired) ||
                  isRequested
                ) {
                  setIsSheetOpen(true);
                  return;
                }
                if (bookDetails.is_leased && bookDetails.is_expired) {
                  setShowExtendModal(true);
                  return;
                }
              }}
              disabled={bookDetails.is_buy && bookDetails.status === "Sold"}
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
                "Login to Talk to the Owner"
              ) : bookDetails.is_buy && bookDetails.status === "Sold" ? (
                "Sold"
              ) : bookDetails.availability !== "Sell" &&
                bookDetails.is_leased &&
                !bookDetails.is_requested &&
                bookDetails.is_expired ? (
                "Extend Request"
              ) : // eslint-disable-next-line no-extra-parens, indent
              (bookDetails.is_requested || bookDetails.is_leased) &&
                !bookDetails.is_expired ? (
                "View Conversation"
              ) : (
                !bookDetails.is_requested &&
                !bookDetails.is_leased &&
                !bookDetails.is_buy &&
                "Talk to the Owner"
              )}
            </Button>
          )}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="hidden">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg p-3 sm:p-6">
              <SheetTitle className="border-gray-300 border-b-2 pb-3">
                {bookDetails.owner}
              </SheetTitle>
              <ChatBox
                owner={bookDetails.owner}
                ticketId={
                  (bookDetails.is_requested && !bookDetails.is_leased) ||
                  (bookDetails.is_leased && !bookDetails.is_expired)
                    ? Number(bookDetails.ticket_number)
                    : ticketId
                }
                isOwner={false}
              />
            </SheetContent>
          </Sheet>
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
              <p className="text-muted-foreground">{bookDetails.tags}</p>
            </div>
            {bookDetails.is_leased && (
              <div>
                <h3 className="font-medium">Max Lease Duration:</h3>
                <p className="text-muted-foreground">21 days</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <section id="related-books">
        {relatedBookLoading ? (
          <div>
            <Skeleton className="min-h-5 rounded-lg w-20 " />
            <BooksGridSkeleton count={5} />
          </div>
        ) : (
          relatedBooks.books &&
          relatedBooks.books.length > 0 && (
            <BookGrid
              name="Related Books"
              books={relatedBooks.books}
              id={relatedBooks.id}
              max_books_count={relatedBooks.max_books_count}
            />
          )
        )}
      </section>

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
    </section>
  );
}
