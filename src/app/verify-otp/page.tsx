"use client";

import { useState } from "react";
import { OTPInput } from "@/components/common/otp-input";
import { isAxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { axiosInstance } from "@/utils/AxiosConfig";
import { CustomSession } from "@/types/next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const { data: session } = useSession() as { data: CustomSession };
  const router = useRouter();
  const [otpLoader, setOtpLoader] = useState(false);

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const handleComplete = async (otp: string) => {
    if (session && session.user?.id) {
      setOtpLoader(true);
      try {
        const formData = new FormData();
        formData.append("customer_id", session.user?.id?.toString() || "");
        formData.append("otp_type", "phone");
        formData.append("otp", otp);
        const response = await axiosInstance.post(
          "/customer/verify-otp",
          formData
        );
        if (response.status === 200) {
          toast({
            variant: "success",
            title: "Success",
            description: response.data.message,
          });
          router.replace("/user/profile");
          setOtpLoader(false);
        }
        // eslint-disable-next-line brace-style
      } catch (error) {
        setOtpLoader(false);
        if (
          isAxiosError(error) &&
          error.status &&
          error.status >= 400 &&
          error.status < 500 &&
          error.response
        )
          toast({
            title: "Error",
            variant: "destructive",
            description: error.response.data.message,
          });
        else
          toast({
            title: "Error",
            variant: "destructive",
            description: "Something went wrong",
          });
      }
    }
  };

  const handleResend = async () => {
    if (session && session.user?.id)
      try {
        // eslint-disable-next-line object-curly-newline
        const formData = new FormData();
        formData.append("customer_id", session.user?.id?.toString() || "");
        formData.append("otp_type", "phone");
        const response = await axiosInstance.post(
          "/customer/resend-otp",
          formData
        );

        if (response.status === 200)
          toast({
            description: response.data.message,
            title: "Success",
            variant: "success",
          });

        // eslint-disable-next-line brace-style
      } catch (error) {
        if (
          isAxiosError(error) &&
          error.status &&
          error.status >= 400 &&
          error.status < 500 &&
          error.response
        )
          toast({
            title: "Error",
            variant: "destructive",
            description: error.response.data.message,
          });
        else
          toast({
            title: "Error",
            variant: "destructive",
            description: "Something went wrong",
          });
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-specific-bg">
      <OTPInput
        length={6}
        onComplete={handleComplete}
        onResend={handleResend}
        loader={otpLoader}
      />
    </div>
  );
}
