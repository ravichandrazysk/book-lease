import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SessionProviderWrapper from "@/utils/SessionProviderWrapper";
import AxiosConfig from "@/utils/AxiosConfig";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Citi Books",
  description: "Citi Books",
  icons: ["/pngs/citibook-favicon.png"],
};

export default function RootLayout({
  children,
  // eslint-disable-next-line object-curly-newline
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <Suspense fallback={<p>loading...</p>}>
          <SessionProviderWrapper>
            <AxiosConfig />
            <Toaster />
            {children}
          </SessionProviderWrapper>
        </Suspense>
      </body>
    </html>
  );
}
