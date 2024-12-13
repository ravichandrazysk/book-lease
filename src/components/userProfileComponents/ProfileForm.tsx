/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePlacesWidget } from "react-google-autocomplete";
import { axiosInstance } from "@/utils/AxiosConfig";
import { toast } from "@/hooks/use-toast";
import Lottie from "react-lottie-player";
import { Card } from "@/components/ui/card";

// Validation schema
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "Too short")
    .max(50, "Too long")
    .matches(
      /^[a-zA-Z\s.]+$/,
      "First name can only contain letters, spaces, and dots"
    )
    .test(
      "no-only-spaces",
      "First Name cannot be only spaces",
      (value) => value.trim().length > 0
    )
    .trim("First Name cannot contain leading or trailing spaces"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Too short")
    .max(50, "Too long")
    .matches(
      /^[a-zA-Z\s.]+$/,
      "Last name can only contain letters, spaces, and dots"
    )

    .test(
      "no-only-spaces",
      "Last First Name cannot be only spaces",
      (value) => value.trim().length > 0
    )
    .trim("Last First Name cannot contain leading or trailing spaces"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  age: Yup.number()
    .min(1, "Age must be greater than 0")
    .required("Age is required"),
  gender: Yup.string().required("Gender is required"),
  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  profileImage: Yup.mixed().required("Profile image is required"),
});

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  age: string;
  gender: string;
  address: string;
  state: string;
  city: string;
  profileImage: string | null;
}

export function ProfileForm() {
  const [loader, setLoader] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formikRef = useRef<FormikProps<ProfileFormValues>>(null);
  const { ref: addressRef } = usePlacesWidget<HTMLInputElement>({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    onPlaceSelected: (place) => {
      if (place.formatted_address && formikRef.current) {
        const formattedAddress = place.formatted_address;
        const cityComponent = place?.address_components?.find(
          (component) =>
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_2")
        );
        const cityName = cityComponent ? cityComponent.long_name : null;

        const state =
          place?.address_components?.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name || "";
        formikRef.current.setFieldValue("address", formattedAddress);
        formikRef.current.setFieldValue("state", state);
        formikRef.current.setFieldValue("city", cityName);
      }
    },
    options: { types: ["address"] },
  });

  const [initialValues, setInitialValues] = useState<ProfileFormValues>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    age: "",
    gender: "",
    address: "",
    state: "",
    city: "",
    profileImage: null,
  });

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues.profileImage)
      setProfileImageUrl(initialValues.profileImage);
  }, [initialValues.profileImage]);

  const handleSubmit = async (values: ProfileFormValues) => {
    setLoader(true);
    const formData = new FormData();
    if (values.firstName !== initialValues.firstName)
      formData.append("first_name", values.firstName);
    if (values.lastName !== initialValues.lastName)
      formData.append("last_name", values.lastName);
    if (values.phoneNumber !== initialValues.phoneNumber)
      formData.append("phone", values.phoneNumber);
    if (values.email !== initialValues.email)
      formData.append("email", values.email);
    if (values.age !== initialValues.age) formData.append("age", values.age);
    if (values.gender !== initialValues.gender)
      formData.append("gender", values.gender);
    if (values.address !== initialValues.address)
      formData.append("address_line_1", values.address);
    if (values.state !== initialValues.state)
      formData.append("state", values.state);
    if (values.city !== initialValues.city)
      formData.append("city", values.city);
    if (
      values.profileImage !== initialValues.profileImage &&
      values.profileImage
    )
      formData.append("profile_photo", values.profileImage);

    try {
      const response = await axiosInstance.post("/customer/profile", formData);
      if (response.status === 200) {
        toast({
          description: "Profile updated successfully",
          title: "Success",
          variant: "success",
        });
        setLoader(false);
        const profileData = response.data.data;
        setInitialValues((prev) => ({
          ...prev,
          firstName: profileData?.first_name || "",
          lastName: profileData?.last_name || "",
          phoneNumber: profileData?.phone || "",
          email: profileData.email,
          age: profileData?.age || "",
          gender: profileData?.gender || "",
          address: profileData?.address_line_1 || "",
          state: profileData?.state || "",
          city: profileData?.city || "",
          profileImage: profileData.profile_photo,
        }));
        if (profileData.profile_photo)
          setProfileImageUrl(profileData.profile_photo);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      setLoader(false);
      toast({
        variant: "destructive",
        description: "Failed to update profile",
      });
      // eslint-disable-next-line no-console
      console.log("Error whille updating profile:", error);
    }
    setLoader(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/customer/profile");
        if (response.status === 200) {
          const profileData = response.data.data;

          setInitialValues((prev) => ({
            ...prev,
            firstName: profileData?.first_name || "",
            lastName: profileData?.last_name || "",
            phoneNumber: profileData?.phone || "",
            email: profileData.email,
            age: profileData?.age || "",
            gender: profileData?.gender || "",
            address: profileData?.address_line_1 || "",
            state: profileData?.state || "",
            city: profileData?.city || "",
            profileImage: profileData.profile_photo,
          }));
        }
        // eslint-disable-next-line brace-style
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Card className=" my-5 md:mr-9 max-md:mx-auto max-sm:max-w-[345px]">
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={ProfileSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, dirty }) => (
          <Form className="     p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={profileImageUrl || "/svgs/profile-img.svg"}
                  alt="Profile"
                />
                {!profileImageUrl && <AvatarFallback>JD</AvatarFallback>}
              </Avatar>
              <ErrorMessage
                name="profileImage"
                component="div"
                className="text-sm text-red-500"
              />
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) {
                      setFieldValue("profileImage", file.name);
                      setProfileImageUrl(URL.createObjectURL(file));
                    }
                  }}
                />
                <Button
                  variant="outline"
                  type="button"
                  className="border border-[#D1D5DB] shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  🔄 Replace Image
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="border border-[#D1D5DB] shadow-md"
                  onClick={() => {
                    setFieldValue("profileImage", null);
                    setProfileImageUrl(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Field
                  as={Input}
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  className="border border-[#D1D5DB]"
                  value={values.firstName}
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Field
                  as={Input}
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  className="border border-[#D1D5DB]"
                  value={values.lastName}
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <Field
                    as={Input}
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="border border-[#D1D5DB]"
                    value={values.phoneNumber}
                  />
                  {/* <Button variant="outline" type="button">
                  Verify
                </Button> */}
                </div>
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="border border-[#D1D5DB]"
                  value={values.email}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium">
                  Age
                </label>
                <Field
                  as={Input}
                  id="age"
                  name="age"
                  type="text"
                  placeholder="Enter your age"
                  className="border border-[#D1D5DB]"
                  value={values.age}
                />
                <ErrorMessage
                  name="age"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </label>
                <Field name="gender">
                  {({ field, form }: any) => (
                    <Select
                      onValueChange={(value) =>
                        form.setFieldValue("gender", value)
                      }
                      value={field.value}
                    >
                      <SelectTrigger className="border border-[#D1D5DB]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <Field name="address">
                {({ field }: any) => (
                  <Input
                    {...field}
                    ref={addressRef}
                    id="address"
                    type="text"
                    placeholder="Search for area, Street name.."
                    className="border border-[#D1D5DB]"
                    value={values.address}
                  />
                )}
              </Field>
              <ErrorMessage
                name="address"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State
                </label>
                <Field
                  as={Input}
                  id="state"
                  name="state"
                  type="text"
                  placeholder="Enter your state"
                  className="border border-[#D1D5DB]"
                  value={values.state}
                />
                <ErrorMessage
                  name="state"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <Field
                  as={Input}
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  className="border border-[#D1D5DB]"
                  value={values.city}
                />
                <ErrorMessage
                  name="city"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-orange-500 w-full sm:max-w-[100px] hover:bg-orange-600"
                disabled={!dirty || loader}
              >
                {loader ? (
                  <div className="flex justify-center items-center w-full max-h-5">
                    <Lottie
                      loop
                      path="/lotties/button-loader.json"
                      play
                      style={{ width: "100%" }}
                    />
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
