import HeaderFooterLayout from "@/components/layouts/HeaderFooterLayout";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import ReceivedRequests from "@/components/userProfileComponents/ReceivedRequest";
import React from "react";

const Page = () => {
  return (
    <React.Fragment>
      <HeaderFooterLayout footerShow={false}>
        <section id="my-received-request" className="bg-specific-bg">
          <ProfileLayout>
            <ReceivedRequests />
          </ProfileLayout>
        </section>
      </HeaderFooterLayout>
    </React.Fragment>
  );
};

export default Page;
