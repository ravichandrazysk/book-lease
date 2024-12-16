"use client";

import { useState } from "react";
import { OTPInput } from "@/components/common/otp-input";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const [email] = useState("User@gmail.com");

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const handleComplete = (otp: string) => {};

  const handleCancel = () => {
    // Redirect back to the previous page or home
    router.push("/");
  };

  const handleResend = () => {
    // Here you would typically call your API to resend the OTP
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <OTPInput
        length={4}
        onComplete={handleComplete}
        onCancel={handleCancel}
        onResend={handleResend}
        email={email}
      />
    </div>
  );
}
