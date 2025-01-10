/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/utils/AxiosConfig";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[^\w]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function CreatePasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const fd = new FormData();
      fd.append("email", email);
      fd.append("password", values.password);
      const response = await axiosInstance.post("/customer/reset-password", fd);
      if (response.status === 200) {
        setLoader(false);
        toast({
          variant: "success",
          title: "Success",
          description: response.data.message,
        });
        router.push("/login");
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/svgs/app-logo.svg"
              alt="CITIBOOKS.CO.IN"
              width={300}
              height={300}
              className="h-10 object-contain"
            />
          </div>
          <h1 className="text-2xl font-medium tracking-tight">
            Create your password
          </h1>
          <p className="text-[#6B7280] font-normal text-base">
            Enter a unique password to secure your information.
          </p>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter a secure password"
                      className={`pr-10 ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : ""
                      } h-12 mt-2 font-normal border border-[#D1D5DB]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative mt-6">
                    <Field
                      as={Input}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className={`pr-10 ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500"
                          : ""
                      } h-12 mt-2 font-normal border border-[#D1D5DB]`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword
                          ? "Hide password"
                          : "Show password"}
                      </span>
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#ff851b] mt-8 h-12 hover:bg-[#ff851b]/90 text-white"
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
