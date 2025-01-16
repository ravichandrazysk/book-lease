/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { axiosInstance } from "@/utils/AxiosConfig";
import { AxiosError } from "axios";
import Link from "next/link";
import { MdLocationSearching } from "react-icons/md";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { LocationTypes, RegisterFormValues } from "@/types/common-types";
import { registerValidationSchema } from "@/utils/validations";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

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

  const formikRef = useRef<FormikProps<RegisterFormValues>>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autoC: google.maps.places.Autocomplete) => {
    setAutocomplete(autoC);
  };

  const onPlaceChanged = () => {
    if (autocomplete && formikRef.current) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
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
        // FormikRef.current.setFieldError("address", "");
        // eslint-disable-next-line brace-style
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (
    values: RegisterFormValues,
    { resetForm }: FormikHelpers<RegisterFormValues>
  ) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);
    formData.append("email", values.email);
    formData.append("phone", values.phoneNumber);
    formData.append("password", values.password);
    formData.append("age", values.age);
    formData.append("gender", values.gender);
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
        if (
          error.status &&
          error?.status >= 400 &&
          error?.status < 500 &&
          error?.response
        )
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
        const geocoder = new google.maps.Geocoder();
        const latlng = {
          lat: location.latitude,
          lng: location.longitude,
        };
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const result = results[0];
            const formattedAddress = result.formatted_address;
            const cityComponent = result.address_components.find(
              (component) =>
                component.types.includes("locality") ||
                component.types.includes("administrative_area_level_2")
            );
            const cityName = cityComponent ? cityComponent.long_name : null;
            const postalCodeComponent = result.address_components.find(
              (component) => component.types.includes("postal_code")
            );
            const postalCode = postalCodeComponent
              ? postalCodeComponent.long_name
              : null;
            const state =
              result.address_components.find((component) =>
                component.types.includes("administrative_area_level_1")
              )?.long_name || "";
            setLocationValues({
              address: formattedAddress,
              city: cityName || "",
              state: state,
              pincode: postalCode || "",
            });
            if (formikRef.current) {
              formikRef.current.setFieldValue("address", formattedAddress);
              formikRef.current.setFieldError("address", "");
            }
            // eslint-disable-next-line brace-style
          } else
            toast({
              variant: "destructive",
              description: "No address found for the given coordinates.",
            });
        });
        // eslint-disable-next-line brace-style
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("location", error);
        toast({
          variant: "destructive",
          description: "Error fetching address",
        });
      }
  };

  return (
    <section id="register-page" className="bg-specific-bg py-10">
      <Card className="w-full max-w-[340px] sm:max-w-md mx-auto">
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
              age: "",
              gender: "",
              address: "",
            }}
            validationSchema={registerValidationSchema}
            onSubmit={onSubmit}
          >
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="font-medium text-sm">
                    First Name&nbsp;
                    <span className="text-red-500">*</span>
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
                    Last Name&nbsp;
                    <span className="text-red-500">*</span>
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
                  Phone Number&nbsp;
                  <span className="text-red-500">*</span>
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
                  Email&nbsp;
                  <span className="text-red-500">*</span>
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
                  Password&nbsp;
                  <span className="text-red-500">*</span>
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
                  Confirm Password&nbsp;
                  <span className="text-red-500">*</span>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium">
                    Age&nbsp;
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as={Input}
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    className="border border-[#D1D5DB]"
                  />
                  <ErrorMessage
                    name="age"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="gender" className="text-sm font-medium">
                    Gender&nbsp;
                    <span className="text-red-500">*</span>
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
                          <SelectItem value="Others">Others</SelectItem>
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
              <div>
                <Label htmlFor="address" className="font-medium text-sm">
                  Address&nbsp;
                  <span className="text-red-500">*</span>
                </Label>
                {isLoaded && (
                  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <Field name="address">
                      {({
                        field,
                        form,
                      }: {
                        field: FieldInputProps<string>;
                        form: any;
                      }) => (
                        <Input
                          {...field}
                          className="border border-[#D1D5DB] h-12 placeholder:text-[#7A7977] placeholder:font-normal text-[#1F2937] font-normal"
                          placeholder="Search for area, Street name.."
                          onBlur={() => {
                            // If (!locationValues.address)
                            //   Form.setFieldError(
                            //     "Address",
                            //     "Select a valid address"
                            //   );
                          }}
                          onChange={(e) => {
                            form.setFieldValue("address", e.target.value);
                            setLocationValues({
                              ...locationValues,
                              address: "",
                            });
                          }}
                        />
                      )}
                    </Field>
                  </Autocomplete>
                )}
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 w-full p-8  h-14 flex flex-col items-start"
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
              <section id="register-buttons">
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
                    "Verify email and continue"
                  )}
                </Button>
                <p className="text-lg font-medium text-center space-y-5">or</p>
                <Button
                  type="button"
                  className="transition hover:scale-[1.03] hover:bg-white duration-300 ease-linear w-full h-12
               flex item-center justify-center gap-3 font-semibold text-base bg-white text-black shadow-lg border-[#ff851b] border-2"
                  // OnClick={() => signIn("google", { callbackUrl: "/" })}
                  onClick={() => router.push("/")}
                >
                  <Image
                    src="/svgs/google-icon.svg"
                    alt="Google"
                    width={100}
                    height={100}
                    className="w-fit h-fit"
                  />
                  Continue with Google
                </Button>
              </section>
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
          <div className="text-center font-normal text-sm mt-3">
            <Link
              href="/"
              className="text-[#ff851b] font-semibold text-base hover:text-[#ff851b]/90"
            >
              Return home
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
