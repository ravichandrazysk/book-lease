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
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  // eslint-disable-next-line no-extra-parens
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if current field is filled
    if (value && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

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
      <CardContent>
        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((_, index) => (
            <Input
              key={index}
              type="text"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              className="w-10 sm:w-12 h-12 text-center text-2xl font-semibold border border-[#D1D5DB]"
            />
          ))}
        </div>
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
              {isResendDisabled ? `Resend OTP in ${timer}s` : "Click to resend"}
            </Link>
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full">
        <Button
          className="bg-[#ff851b] w-full hover:bg-[#ff851b]/90 text-white"
          onClick={() => onComplete(otp.join(""))}
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
    </Card>
  );
}
