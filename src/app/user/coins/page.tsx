"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import MyCoins from "@/components/userProfileComponents/MyCoins";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <ProfileLayout>
          <MyCoins />
        </ProfileLayout>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
