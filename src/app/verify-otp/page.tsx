"use client";

import { useState } from "react";
import { OTPInput } from "@/components/common/otp-input";

export default function VerifyPage() {
  const [email] = useState("User@gmail.com");

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const handleComplete = () => {};

  const handleResend = () => {
    // Here you would typically call your API to resend the OTP
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <OTPInput
        length={4}
        onComplete={handleComplete}
        onResend={handleResend}
        email={email}
      />
    </div>
  );
}
