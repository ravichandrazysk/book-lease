"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import Support from "@/components/userProfileComponents/Support";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <ProfileLayout>
          <Support />
        </ProfileLayout>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
