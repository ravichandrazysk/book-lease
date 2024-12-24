/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockDetailsCard } from "@/components/common/StockDetailsCard";
import StockCardLoader from "@/components/common/loaders/StockCardLoader";

const MyEnquiries = () => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  return (
    <React.Fragment>
      <Tabs
        defaultValue="my-request"
        className="max-w-3xl mt-5 max-md:mx-auto max-sm:max-w-[345px] md:mr-9"
      >
        <TabsList className="w-full py-1">
          <TabsTrigger value="my-request" className="w-full">
            My Request
          </TabsTrigger>
          <TabsTrigger value="received-request" className="w-full">
            Received Request
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-request">
          {loading ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <StockCardLoader key={index} variant="sent" />
              ))}
            </>
          ) : (
            Array.from({ length: 10 }).map((_, index) => (
              <StockDetailsCard
                key={index}
                variant="received"
                title="My Books"
                author="books"
                imageUrl="/pngs/book-cover-img.png"
                status="Cancelled"
                date="2021-09-12"
              />
            ))
          )}
        </TabsContent>
        <TabsContent value="received-request">
          {loading ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <StockCardLoader key={index} variant="received" />
              ))}
            </>
          ) : (
            Array.from({ length: 10 }).map((_, index) => (
              <StockDetailsCard
                key={index}
                variant="sent"
                title="My Books"
                author="books"
                imageUrl="/pngs/book-cover-img.png"
                status="Cancelled"
                date="2021-09-12"
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </React.Fragment>
  );
};

export default MyEnquiries;
