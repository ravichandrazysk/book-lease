"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import MyReferral from "@/components/userProfileComponents/MyReferal";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <section id="my-refferal" className="bg-specific-bg">
          <ProfileLayout>
            <MyReferral />
          </ProfileLayout>
        </section>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
