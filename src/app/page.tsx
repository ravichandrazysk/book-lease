"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import HomePage from "@/components/pages-ui/HomePage";
import React from "react";
export default function Home() {
  return (
    <React.Fragment>
      <HeaderFooterLayout>
        <HomePage />
      </HeaderFooterLayout>
    </React.Fragment>
  );
}
