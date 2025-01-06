/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "@/utils/AxiosConfig";
import { AxiosResponse, AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

interface FormValuesTypes {
  email: string;
  password: string;
}
export default function LoginPage() {
  const { toast } = useToast();
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values: FormValuesTypes) => {
    setLoader(true);
    try {
      const response: AxiosResponse = await axiosInstance.post(
        "/customer/login",
        {
          email: values.email,
          password: values.password,
        }
      );
      if (response?.status === 200) {
        signIn("credentials", {
          isToken: true,
          data: JSON.stringify(response.data),
          redirect: true,
          callbackUrl: "/",
        });
        toast({
          title: "Success",
          variant: "success",
          description: response.data.message,
        });
      }
      setLoader(false);
      // eslint-disable-next-line brace-style
    } catch (error: unknown) {
      setLoader(false);
      if (error instanceof AxiosError && error.response)
        toast({
          variant: "destructive",
          title: "Error!",
          description: error.response.data.message,
        });
      else
        // eslint-disable-next-line no-console
        console.error(error);
    }
  };
  const initialValues = {
    email: "",
    password: "",
  };
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*@[a-zA-Z]{2,}(?:-[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      ),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[^\w]/, "Password must contain at least one special character"),
  });

  const onSubmit = (values: FormValuesTypes) => {
    handleLogin(values);
  };
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Card className="w-full sm:max-h-max max-w-md mx-4 border border-[#E5E6E8]">
        <CardHeader className=" text-center">
          <div className="flex justify-center ">
            <Image
              src="/svgs/app-logo.svg"
              alt="CITIBOOKS.CO.IN"
              width={300}
              height={300}
              className="h-10 object-contain"
            />
          </div>
          <h1 className="text-2xl font-medium text-[#202124]">Welcome Back!</h1>
          <p className="text-muted-foreground">
            Log in to continue where you left off.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Formik
            initialValues={initialValues}
            validationSchema={loginValidationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form>
                <div className="">
                  <Label htmlFor="email" className="font-medium">
                    Email or Phone number&nbsp;
                    <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    name="email"
                    as={Input}
                    id="email"
                    placeholder="Enter your email or phone"
                    type="text"
                    className="h-14 mt-2 font-normal text-base border border-[#D1D5DB]"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="min-h-16 mt-6">
                  <Label htmlFor="password" className="font-medium">
                    Password&nbsp;
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      placeholder="Enter Your Password"
                      type={showPassword ? "text" : "password"}
                      className="h-14 mt-2 font-normal text-base border border-[#D1D5DB] pr-10"
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </span>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <Link
                      href="/forgot-password"
                      className="text-base mt-3 font-medium text-[#ff851b] hover:text-[#ff851b]/90"
                    >
                      Forgot Password ?
                    </Link>
                  </div>
                </div>
                <Button className="w-full h-12 mt-8 font-semibold text-base bg-[#ff851b] hover:bg-[#ff851b]/90 text-white">
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
                    "Log in"
                  )}
                </Button>
                <div className="text-center font-normal text-sm mt-6">
                  {"Don't have an account? "}
                  <Link
                    href="/register"
                    className="text-[#ff851b] font-semibold text-base hover:text-[#ff851b]/90"
                  >
                    Sign up
                  </Link>
                </div>
                <div className="text-center font-normal text-sm mt-3">
                  <Link
                    href="/"
                    className="text-[#ff851b] font-semibold text-base hover:text-[#ff851b]/90"
                  >
                    Return home
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
