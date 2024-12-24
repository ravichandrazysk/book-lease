"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import SoldBooks from "@/components/userProfileComponents/SoldBooks";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <ProfileLayout>
          <SoldBooks />
        </ProfileLayout>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
