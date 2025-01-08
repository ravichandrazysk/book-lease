/* eslint-disable indent */
/* eslint-disable multiline-ternary */
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface GoogleAdsContainerProps {
  adClient: string;
  adSlot: string;
  format?: "auto" | "fluid";
  responsive?: boolean;
}

export default function GoogleAdsContainer({
  adClient,
  adSlot,
  format = "auto",
  responsive = true,
}: GoogleAdsContainerProps) {
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      // Load Google Ads Script
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => setIsLoaded(true);
      script.onerror = () => setIsError(true);

      // Add your Google Ads client ID
      script.dataset.adClient = adClient;

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
      // eslint-disable-next-line brace-style
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("google add error", error);
      setIsError(true);
    }
  }, [adClient, isError]);

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-r from-blue-300 via-cyan-200 to-emerald-200 p-4 mt-5">
      {isError ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Image
            src="/pngs/google-add text.png"
            alt="google-add"
            width={500}
            height={500}
          />
        </div>
      ) : (
        <div className="min-h-[200px]">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format={format}
            data-full-width-responsive={responsive}
          />
          {isLoaded && (
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          )}
        </div>
      )}
    </Card>
  );
}
