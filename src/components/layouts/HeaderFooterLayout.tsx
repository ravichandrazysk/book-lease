"use client";
import React from "react";
import { ReactNode } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components//common/Footer";

const HeaderFooterLayout = ({
  children,
  footerShow = true,
}: {
  children: ReactNode;
  footerShow?: boolean;
}) => {
  return (
    <React.Fragment>
      <Header />
      {children}
      {footerShow && <Footer />}
    </React.Fragment>
  );
};

export default HeaderFooterLayout;
