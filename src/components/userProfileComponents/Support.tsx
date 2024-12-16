/* eslint-disable no-extra-parens */
/* eslint-disable camelcase */
/* eslint-disable multiline-ternary */
"use client";
import React, { useState } from "react";
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
const Lottie = dynamic(() => import("react-lottie-player"));

const Support = () => {
  const [loading, setLoading] = useState(false);
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    requestType: "",
    comments: "",
  };

  type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    requestType: string;
    comments: string;
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^\d+$/, "Only numbers are allowed")
      .required("Phone number is required"),
    requestType: Yup.string().required("Request type is required"),
  });

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
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

  return (
    <section
      id="support"
      className="  sm:w-11/12 my-5 flex flex-col gap-5 mx-auto max-md:w-[90%]"
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
                    First Name
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
                    Last Name
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
                    Email
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
                    Phone Number
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
                  Request Type
                </label>
                <Field name="requestType">
                  {({
                    field,
                    form,
                  }: FieldProps & { form: FormikProps<FormValues> }) => (
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
                        <SelectItem value="Optionreason 1">
                          Optionreason 1
                        </SelectItem>
                        <SelectItem value="Optionreason 2">
                          Optionreason 2
                        </SelectItem>
                        <SelectItem value="Optionreason 3">
                          Optionreason 3
                        </SelectItem>
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
                  Comment
                </label>
                <Field
                  id="comments"
                  name="comments"
                  as="textarea"
                  rows={4}
                  placeholder="Comment some Additional Details"
                  className="w-full border-2 rounded px-2 py-1"
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
