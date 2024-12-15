"use client";
import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import { ProfileForm } from "@/components/userProfileComponents/ProfileForm";

import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <div className="sm:max-w-full mx-auto">
          <ProfileLayout>
            <ProfileForm />
          </ProfileLayout>
        </div>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
