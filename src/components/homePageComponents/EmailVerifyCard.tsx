"use client";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmailVerifyCard({
  className,
  onVerify,
}: {
  className?: string;
  onVerify?: () => void;
}) {
  return (
    <Card className={`bg-white shadow-lg ${className} max-w-xl bg-[#fff7e1]`}>
      <CardContent className="flex items-center gap-5 justify-between p-3">
        <div className="flex items-center gap-5">
          <div className="rounded-full bg-[#FFC107]/20 p-2">
            <AlertCircle className="h-6 w-6 text-[#FFC107]" />
          </div>
          <p className="text-base font-medium text-[#ffca2d]">
            Please verify your account to continue
          </p>
        </div>
        <Button
          className="bg-[#ffc107] hover:bg-[#FFB300] text-white font-medium"
          onClick={onVerify}
        >
          Verify Now
        </Button>
      </CardContent>
    </Card>
  );
}
