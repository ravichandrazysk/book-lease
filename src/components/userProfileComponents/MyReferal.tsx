/* eslint-disable camelcase */
/* eslint-disable multiline-ternary */
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "@/utils/AxiosConfig";
import { toast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";

interface ReferralTypes {
  id: 1;
  invitee_email: string;
  status: string;
}
const MyReferral = () => {
  const [refferrals, setReferrals] = useState<ReferralTypes[]>([]);
  const [referralSent, setReferralSent] = useState<boolean>(false);
  const initialValues = { email: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (
    values: { email: string },
    { resetForm }: FormikHelpers<{ email: string }>
  ) => {
    try {
      const formData = new FormData();
      formData.append("invitee_email", values.email);
      const response = await axiosInstance.post(
        "/send-referral-invitation",
        formData
      );
      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Success",
          description: response.data.message,
        });
        resetForm();
        setReferralSent(!referralSent);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.status &&
        error.status >= 400 &&
        error.response
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
        // eslint-disable-next-line no-console
        console.log(error, "error in invite");
      }
    }
  };

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await axiosInstance.get("/list-referral-invitations");
        if (response && response.status && response.status === 200)
          setReferrals(response.data);
        // eslint-disable-next-line brace-style
      } catch (error) {
        if (
          isAxiosError(error) &&
          error.status &&
          error.status >= 400 &&
          error.response
        ) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response.data.message,
          });
          // eslint-disable-next-line no-console
          console.log(error, "error in invite");
        }
      }
    };
    fetchReferrals();
  }, [referralSent]);
  return (
    <section
      id="referral"
      className="flex flex-col gap-6 md:mr-9 2xl:max-w-5xl my-4 mx-auto max-w-3xl"
    >
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-2xl">
            Refer a Friend and Earn Coins!
          </CardTitle>
          <CardDescription>
            Invite your friends to join and get rewarded with coins for each
            successful referral.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-medium text-xl">
            Invite via email
          </CardTitle>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex gap-[10px]">
                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Add your friends email id"
                    className="w-full h-full sm:min-w-96 sm:max-w-2xl text-sm font-normal text-black placholder:text-[#6B7280]"
                    as={Input}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-[#FF851B] text-xs font-medium w-[180px] h-[44px] hover:bg-[#FF851B]"
                  disabled={isSubmitting}
                >
                  Send Email
                </Button>
              </Form>
            )}
          </Formik>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-medium mb-4">Your Referrals</p>
          <div className="  flex flex-col gap-6">
            {refferrals &&
              refferrals.length > 0 &&
              refferrals.map((item) => {
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={`/pngs/referral.png`} />
                      <AvatarFallback>{`img${item.id + 1}`}</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-16 sm:gap-20">
                      <p className="text-[#6B7280] max-sm:max-w-36 max-w-44 max-sm:min-w-36 min-w-44 break-words">
                        {item.invitee_email}
                      </p>
                      <p className="text-[#FFA912]">{item.status}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default MyReferral;
