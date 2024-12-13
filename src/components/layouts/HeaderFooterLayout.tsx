"use client";
import React from "react";
import { ReactNode } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components//common/Footer";

interface HeaderFooterLayoutProps {
  children: ReactNode;
  footerShow?: boolean;
}
const HeaderFooterLayout = ({
  children,
  footerShow = true,
}: HeaderFooterLayoutProps) => {
  return (
    <React.Fragment>
      <Header />
      {children}
      {footerShow && <Footer />}
    </React.Fragment>
  );
};

export default HeaderFooterLayout;
