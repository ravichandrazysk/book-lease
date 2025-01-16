"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import { ProfileForm } from "@/components/userProfileComponents/ProfileForm";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <section
          id="my-profile"
          className="sm:max-w-full mx-auto bg-specific-bg"
        >
          <ProfileLayout>
            <ProfileForm />
          </ProfileLayout>
        </section>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
