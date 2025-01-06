/* eslint-disable no-extra-parens */
/* eslint-disable camelcase */
/* eslint-disable multiline-ternary */
"use client";
import React, { useEffect, useState } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/card";
import {
  Formik,
  Field,
  ErrorMessage,
  Form,
  FormikHelpers,
  FieldProps,
  FormikProps,
} from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/utils/AxiosConfig";
import { toast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import dynamic from "next/dynamic";
import { SupportFormValues } from "@/types/common-types";
const Lottie = dynamic(() => import("react-lottie-player"));

const Support = () => {
  const [loading, setLoading] = useState(false);
  const [reasonTypes, setReasonTypes] = useState<
    { label: string; value: string }[]
  >([]);
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    requestType: "",
    comments: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*@[a-zA-Z]{2,}(?:-[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      ),
    phoneNumber: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .required("Phone number is required")
      .matches(/^[6-9]\d{9}$/, "Invalid phone number")
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits"),
    requestType: Yup.string().required("Request type is required"),
    comments: Yup.string().required("Comments are required"),
  });

  const handleSubmit = async (
    values: SupportFormValues,
    { resetForm }: FormikHelpers<SupportFormValues>
  ) => {
    try {
      setLoading(true);
      const payload = {
        customer_name: values.firstName + " " + values.lastName,
        email: values.email,
        phone_number: values.phoneNumber,
        message: values.comments,
        reason_type: values.requestType,
      };

      const res = await axiosInstance.post("/customer-support", payload);

      if (res.status === 200) {
        toast({
          variant: "success",
          title: "Success",
          description: res.data.message,
        });
        resetForm();
        setLoading(false);
        // eslint-disable-next-line brace-style
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.status &&
        error.status >= 400 &&
        error.status < 500 &&
        error.response
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
        setLoading(false);
        // eslint-disable-next-line brace-style
      } else
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong",
        });
      setLoading(false);
    }
  };

  const getReasonTypes = async () => {
    try {
      const res = await axiosInstance.get("/customer-support/reason-types");
      if (
        res.status === 200 &&
        res.data.reason_types &&
        typeof res.data.reason_types === "object"
      ) {
        const reasonTypesArray = Object.entries(res.data.reason_types).map(
          ([value, label]) => ({
            label: label as string,
            value,
          })
        );
        setReasonTypes(reasonTypesArray);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Error in getting reason types", error);
    }
  };

  useEffect(() => {
    getReasonTypes();
  }, []);

  return (
    <section
      id="support"
      className="  sm:w-11/12 my-5 flex flex-col gap-5 mx-auto max-w-3xl"
    >
      <header>
        <SectionHeader title="Submit a Request" />
      </header>
      <Card className="sm:max-w-3xl p-8 sm:p-[52px] mb-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block py-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    as={Input}
                    placeholder="Enter your first name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block py-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    as={Input}
                    placeholder="Enter your last name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block py-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="email"
                    name="email"
                    as={Input}
                    type="email"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block py-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="phoneNumber"
                    name="phoneNumber"
                    as={Input}
                    placeholder="Enter your phone number"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="requestType" className="block py-2">
                  Request Type <span className="text-red-500">*</span>
                </label>
                <Field name="requestType">
                  {({
                    field,
                    form,
                  }: FieldProps & { form: FormikProps<SupportFormValues> }) => (
                    <Select
                      {...field}
                      onValueChange={(value) =>
                        form.setFieldValue("requestType", value)
                      }
                      value={field.value}
                    >
                      <SelectTrigger className="w-full border-2 rounded px-2 py-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasonTypes && reasonTypes.length > 0 ? (
                          reasonTypes.map((reason, index) => (
                            <SelectItem key={index} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="text-center text-gray-500">
                            No reason types found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="requestType"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="comments" className="block py-2">
                  Comment <span className="text-red-500">*</span>
                </label>
                <Field
                  id="comments"
                  name="comments"
                  as="textarea"
                  rows={4}
                  placeholder="Comment some additional details"
                  className="w-full border-2 rounded px-2 py-1"
                />
                <ErrorMessage
                  name="comments"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="flex sm:justify-end">
                <Button
                  type="submit"
                  className="bg-[#FF851B] text-lg font-semibold w-full sm:w-[257px] h-[53px] hover:bg-[#FF851B]"
                >
                  {loading ? (
                    <div className="flex justify-center items-center w-full max-h-5">
                      <Lottie
                        loop
                        path="/lotties/button-loader.json"
                        play
                        style={{ width: "100%" }}
                      />
                    </div>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </section>
  );
};

export default Support;
