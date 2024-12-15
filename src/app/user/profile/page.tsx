"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
// Import ProfileLayout from "@/components/layouts/ProfileLayout";
// Import { ProfileForm } from "@/components/userProfileComponents/ProfileForm";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <div className="sm:max-w-full mx-auto">
          {/* <ProfileLayout>
            <ProfileForm />
          </ProfileLayout> */}
        </div>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
