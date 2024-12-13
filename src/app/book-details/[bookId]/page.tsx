"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import { BookDetails } from "@/components/pages-ui/BookDetailsPage";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout>
        <BookDetails />
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
