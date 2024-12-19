"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <React.Fragment>
      <section
        id="email-verified"
        className=" min-h-screen bg-slate-500 flex flex-col  h-full items-center justify-center"
      >
        <Card className="flex min-h-96 max-w-lg items-center justify-center  flex-col">
          <p className="text-xl font-medium">Email verified successfully!</p>
          <Button
            className="max-w-sm w-full font-semibold text-base bg-[#ff851b] hover:bg-[#ff851b]/90 !mt-8 h-12"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </Card>
      </section>
    </React.Fragment>
  );
};

export default Page;
