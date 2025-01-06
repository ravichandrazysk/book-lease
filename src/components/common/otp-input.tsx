/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
"use client";

import React, {
  useState,
  useRef,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
} from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Formik, Form, Field, FormikErrors } from "formik";
import * as Yup from "yup";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

export function OTPInput({
  length,
  onComplete,
  onResend,
  loader,
}: {
  length: number;
  // eslint-disable-next-line no-unused-vars
  onComplete: (otp: string) => void;
  onResend: () => void;
  loader: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);

  const otpSchema = Yup.object().shape({
    otp: Yup.array()
      .min(length, `OTP should be ${length} digits`)
      .of(Yup.string().required("OTP is required")),
  });
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled)
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const handleResendClick = () => {
    if (isResendDisabled) return;
    setIsResendDisabled(true);
    setTimer(60);
    onResend();
  };

  const getFirstError = (errors: FormikErrors<{ otp: string[] }>) => {
    if (errors.otp && Array.isArray(errors.otp))
      for (let i = 0; i < errors.otp.length; i++)
        if (errors.otp[i]) return errors.otp[i];

    return null;
  };

  return (
    <Card className="w-full max-w-md mx-3 sm:mx-auto">
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
        <h2 className="text-2xl  font-medium ">Enter verification code</h2>
        <p className="text-sm font-normal text-[#6B7280]">
          We have sent a code to{" "}
          <span className="font-medium text-[#202124]">Phone</span>
        </p>
      </CardHeader>
      <Formik
        initialValues={{ otp: new Array(length).fill("") }}
        validationSchema={otpSchema}
        onSubmit={(values) => onComplete(values.otp.join(""))}
      >
        {({ values, setFieldValue, errors, dirty }) => (
          <Form>
            <CardContent>
              <div className="flex justify-center space-x-2 mb-4">
                {values.otp.map((_, index) => (
                  <Field name={`otp[${index}]`} key={index}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {({ field }: { field: any }) => (
                      <Input
                        {...field}
                        type="text"
                        maxLength={1}
                        value={values.otp[index]}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;
                          if (isNaN(Number(value))) return;
                          setFieldValue(
                            `otp[${index}]`,
                            value.substring(value.length - 1)
                          );
                          if (value && index < length - 1)
                            inputRefs.current[index + 1]?.focus();
                        }}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                          if (
                            e.key === "Backspace" &&
                            !values.otp[index] &&
                            index > 0
                          ) {
                            setFieldValue(`otp[${index - 1}]`, "");
                            inputRefs.current[index - 1]?.focus();
                          }
                        }}
                        ref={(ref) => {
                          inputRefs.current[index] = ref;
                        }}
                        className="w-10 sm:w-12 h-12 text-center text-2xl font-semibold border border-[#D1D5DB]"
                      />
                    )}
                  </Field>
                ))}
              </div>
              {getFirstError(errors) && (
                <div className="text-red-500 text-center">
                  {getFirstError(errors)}
                </div>
              )}
              <div className="text-center">
                <div className="text-center font-normal text-sm mt-6 text-[#6B7280]">
                  {"Didn't get code? "}
                  <Link
                    href="#"
                    className={`text-[#ff851b] font-medium text-base ${
                      isResendDisabled
                        ? "pointer-events-none text-gray-400"
                        : "hover:text-[#ff851b]/90"
                    }`}
                    onClick={handleResendClick}
                    aria-disabled={isResendDisabled}
                  >
                    {isResendDisabled
                      ? `Resend OTP in ${timer}s`
                      : "Click to resend"}
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="w-full">
              <Button
                type="submit"
                className="bg-[#ff851b] w-full hover:bg-[#ff851b]/90 text-white"
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
                  "Verify"
                )}
              </Button>
            </CardFooter>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
