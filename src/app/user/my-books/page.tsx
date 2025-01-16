"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import MyBooks from "@/components/userProfileComponents/MyBooks";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <section id="my-books" className="sm:max-w-full mx-auto bg-specific-bg">
          <ProfileLayout>
            <MyBooks />
          </ProfileLayout>
        </section>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
