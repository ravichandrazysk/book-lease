"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import MyBooks from "@/components/userProfileComponents/MyBooks";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <div className="sm:max-w-full mx-auto">
          <ProfileLayout>
            <MyBooks />
          </ProfileLayout>
        </div>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
