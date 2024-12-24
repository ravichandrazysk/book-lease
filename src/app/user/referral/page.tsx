"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import MyReferral from "@/components/userProfileComponents/MyReferal";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <ProfileLayout>
          <MyReferral />
        </ProfileLayout>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
