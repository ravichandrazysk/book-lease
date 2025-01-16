"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import MyRequest from "@/components/userProfileComponents/MyRequest";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <section id="my-request" className="bg-specific-bg">
          <ProfileLayout>
            <MyRequest />
          </ProfileLayout>
        </section>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
