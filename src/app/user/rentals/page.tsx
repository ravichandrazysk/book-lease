"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import MyRentals from "@/components/userProfileComponents/Rentals";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <ProfileLayout>
          <MyRentals />
        </ProfileLayout>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
