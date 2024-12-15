/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
"use client";

import { useState, useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikProps,
  FieldInputProps,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { usePlacesWidget } from "react-google-autocomplete";
import { axiosInstance } from "@/utils/AxiosConfig";
import { AxiosError } from "axios";
import Link from "next/link";

import { MdLocationSearching } from "react-icons/md";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    // eslint-disable-next-line no-undefined
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
  address: Yup.string().required("Address is required"),
});

interface LocationTypes {
  address: string;
  city: string;
  state: string;
  pincode: string;
}
interface FormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
}
export default function SignUpForm() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loader, setLoader] = useState(false);
  const [locationValues, setLocationValues] = useState<LocationTypes>({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const router = useRouter();

  const { toast } = useToast();

  const formikRef = useRef<FormikProps<FormValues>>(null);

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
        const postalCodeComponent = place?.address_components?.find(
          (component) => component.types.includes("postal_code")
        );
        const postalCode = postalCodeComponent
          ? postalCodeComponent.long_name
          : null;
        const state =
          place?.address_components?.find((component) =>
            component.types.includes("administrative_area_level_1")
          )?.long_name || "";
        setLocationValues({
          address: formattedAddress,
          city: cityName || "",
          state: state,
          pincode: postalCode || "",
        });
        formikRef.current.setFieldValue("address", formattedAddress);
      }
    },
    options: { types: ["address"] },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);
    formData.append("email", values.email);
    formData.append("phone", values.phoneNumber);
    formData.append("password", values.password);
    formData.append("address_line_1", values.address);
    formData.append("pincode", locationValues.pincode);
    formData.append("city", locationValues.city);
    formData.append("state", locationValues.state);
    try {
      const response = await axiosInstance.post("/customer/register", formData);
      if (response.status === 201) {
        toast({
          variant: "success",
          title: "Success",
          description: response.data.message,
        });
        resetForm();
        router.push("/login");
      }
      setLoader(false);
      // eslint-disable-next-line brace-style
    } catch (error: unknown) {
      setLoader(false);

      if (error instanceof AxiosError)
        if (error?.status === 422)
          toast({
            variant: "destructive",
            title: "Error",
            description: error?.response?.data.message,
          });
        else
          toast({
            variant: "destructive",
            title: "Error",
            description: "Registration failed, internal server error",
          });
    }
    setLoader(false);
  };
  useEffect(() => {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          toast({
            variant: "destructive",
            description: "Unable to retrieve your location",
          });
        }
      );
    else
      toast({
        variant: "destructive",
        description: "Geolocation is not supported by your browser",
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetCurrentLocation = async () => {
    if (location && formikRef.current)
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        if (data.results.length > 0) {
          const result = data.results[0];
          const formattedAddress = result.formatted_address;
          if (formikRef.current) {
            const cityComponent:
              | google.maps.GeocoderAddressComponent
              | undefined = result?.address_components?.find(
              // eslint-disable-next-line indent
              (component: google.maps.GeocoderAddressComponent) =>
                // eslint-disable-next-line indent
                component.types.includes("locality") ||
                component.types.includes("administrative_area_level_2")
              // eslint-disable-next-line indent
            );
            const cityName = cityComponent ? cityComponent.long_name : null;
            const postalCodeComponent = result?.address_components?.find(
              (component: google.maps.GeocoderAddressComponent) =>
                component.types.includes("postal_code")
            );
            const postalCode = postalCodeComponent
              ? postalCodeComponent.long_name
              : null;
            const state =
              result?.address_components?.find(
                (component: google.maps.GeocoderAddressComponent) =>
                  component.types.includes("administrative_area_level_1")
              )?.long_name || "";
            setLocationValues({
              address: formattedAddress,
              city: cityName || "",
              state: state,
              pincode: postalCode || "",
            });
            formikRef.current.setFieldValue("address", formattedAddress);
          }
          // eslint-disable-next-line brace-style
        } else
          toast({
            variant: "destructive",
            description: "No address found for the given coordinates.",
          });
        // eslint-disable-next-line brace-style
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("location", error);
        toast({
          variant: "destructive",
          description: "Error fetching address",
        });
      }
  };

  return (
    <>
      <Card className="w-full max-w-[340px] sm:max-w-md mx-auto mt-10 mb-10">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <Image
              src="/svgs/app-logo.svg"
              alt="CITIBOOKS.CO.IN"
              width={300}
              height={300}
              className="h-10 object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-[#202124] font-medium">
            Sign up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            innerRef={formikRef}
            initialValues={{
              firstName: "",
              lastName: "",
              phoneNumber: "",
              email: "",
              password: "",
              confirmPassword: "",
              address: "",
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="font-medium text-sm">
                    First Name
                  </Label>
                  <Field
                    name="firstName"
                    as={Input}
                    className="border border-[#D1D5DB] h-12 placeholder:text-[#7A7977] placeholder:font-normal text-[#1F2937] font-normal"
                    placeholder="Enter your first name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="font-medium text-sm">
                    Last Name
                  </Label>
                  <Field
                    name="lastName"
                    as={Input}
                    className="border border-[#D1D5DB] h-12 placeholder:text-[#7A7977] placeholder:font-normal text-[#1F2937] font-normal"
                    placeholder="Enter your last name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="font-medium text-sm">
                  Phone Number
                </Label>
                <Field
                  name="phoneNumber"
                  as={Input}
                  className="border border-[#D1D5DB] h-12 placeholder:text-[#7A7977] placeholder:font-normal text-[#1F2937] font-normal"
                  placeholder="Enter your phone number"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="email" className="font-medium text-sm">
                  Email
                </Label>
                <Field
                  name="email"
                  type="email"
                  as={Input}
                  className="border border-[#D1D5DB] h-12 placeholder:text-[#7A7977] placeholder:font-normal text-[#1F2937] font-normal"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="password" className="font-medium text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    as={Input}
                    className="border border-[#D1D5DB] h-12 placeholder:text-[#7A7977] placeholder:font-normal text-[#1F2937] font-normal"
                    placeholder="Enter a secure password"
                  />
                  <span
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="font-medium text-sm"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    as={Input}
                    className="border border-[#D1D5DB] h-12 placeholder:text-[#7A7977] placeholder:font-normal text-[#1F2937] font-normal"
                    placeholder="Enter your password again"
                  />
                  <span
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </span>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="address" className="font-medium text-sm">
                  Address
                </Label>
                <Field name="address">
                  {({ field }: { field: FieldInputProps<string> }) => (
                    <Input
                      {...field}
                      ref={addressRef}
                      className="border border-[#D1D5DB] h-12 placeholder:text-[#7A7977] placeholder:font-normal text-[#1F2937] font-normal"
                      placeholder="Search for area, Street name.."
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full p-8 shadow-md h-14 flex flex-col items-start"
                  onClick={handleGetCurrentLocation}
                >
                  <div className="flex items-center">
                    <MdLocationSearching className="w-4 h-4 mr-2" />
                    <p className="font-normal text-base text-[#202124]">
                      Get Current location
                    </p>
                  </div>
                  <p className="font-normal text-sm text-[#7A7977]">
                    Using GPS
                  </p>
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full font-semibold text-base bg-[#ff851b] hover:bg-[#ff851b]/90 !mt-8 h-12"
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
                  "Continue"
                )}
              </Button>
            </Form>
          </Formik>
          <p className="text-center mt-4 font-normal">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#ff851b] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </>
  );
}
