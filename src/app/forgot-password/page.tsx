"use client";

import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const handleSubmit = (
    values: { email: string },
    // eslint-disable-next-line no-unused-vars
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    // Handle password reset logic here
    // eslint-disable-next-line no-console
    console.log("Password reset requested for:", values.email);
    setSubmitting(false);
  };

  return (
    <div className=" min-h-screen flex items-center justify-center ">
      <Card className="w-full max-w-md mx-auto">
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
            {({ isSubmitting }) => (
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Continue"}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
