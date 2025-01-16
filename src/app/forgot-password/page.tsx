/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
"use client";

import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/utils/AxiosConfig";
import { toast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { useState } from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*@[a-zA-Z]{2,}(?:-[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  // eslint-disable-next-line object-curly-newline
});

export default function ForgotPasswordPage() {
  const [loader, setLoader] = useState(false);
  const handleSubmit = async (values: { email: string }) => {
    const fd = new FormData();
    fd.append("email", values.email);
    try {
      setLoader(true);
      const response = await axiosInstance.post("customer/forgot-password", fd);
      if (response.status === 200) {
        setLoader(false);
        toast({
          variant: "success",
          title: "Success",
          description: response.data.message,
        });
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      setLoader(false);
      if (
        isAxiosError(error) &&
        error.status &&
        error.status >= 400 &&
        error.status < 500 &&
        error.response
      )
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
      else
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong",
        });
    }
    // Handle password reset logic here
    // eslint-disable-next-line no-console
  };

  return (
    <div className=" min-h-screen flex items-center justify-center bg-specific-bg">
      <Card className="w-full max-w-xs sm:max-w-md mx-auto">
        <CardHeader className="space-y-6">
          <div className="flex justify-center">
            <Image
              src="/svgs/app-logo.svg"
              alt="CitiBooks.co.in"
              width={200}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-medium text-[#202124]">
              Forgot Your Password?
            </h1>
            <p className="text-base text-[#6B7280] font-normal">
              Enter your email address to continue
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ dirty }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-base">
                    Email
                  </Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="border border-[#D1D5DB] h-12 placeholder:text-[#7A7977] placeholder:font-normal text-[#1F2937] font-normal"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-semibold text-base bg-[#ff851b] hover:bg-[#ff851b]/90 !mt-8 h-12"
                  disabled={!dirty}
                >
                  {loader ? (
                    <div className="flex justify-center items-center w-full max-h-5">
                      <Lottie
                        loop
                        path="/lotties/button-loader.json"
                        play
                        style={{ width: "50%" }}
                      />
                    </div>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
