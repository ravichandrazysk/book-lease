"use client";
import { NavigationTabs } from "@/components/common/NavigationTabs";
import React from "react";
export default function ProfileLayout({
  children,
  // eslint-disable-next-line object-curly-newline
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <div className="flex max-w-7xl mx-auto ">
        <section
          id="navigation-panel"
          className="sm:min-w-[450px] flex-shrink-0 hidden md:block"
        >
          <NavigationTabs />
        </section>
        <main className="flex-1  max-h-[calc(100vh-85px)] sm:overflow-y-auto">
          <div className="max-w-3xl px-3 md:px-0">{children}</div>
        </main>
      </div>
    </React.Fragment>
  );
}
