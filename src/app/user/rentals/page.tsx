"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import MyRentals from "@/components/userProfileComponents/Rentals";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <section id="my-rentals" className="bg-specific-bg">
          <ProfileLayout>
            <MyRentals />
          </ProfileLayout>
        </section>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
