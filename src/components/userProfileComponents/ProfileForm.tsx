/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-extra-parens */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikProps,
  FieldInputProps,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { axiosInstance } from "@/utils/AxiosConfig";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { LocationTypes, ProfileFormValues } from "@/types/common-types";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/types/next-auth";
import { isAxiosError } from "axios";
import { MdLocationSearching } from "react-icons/md";

const FILE_SIZE = 2 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/jfif",
];
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
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*@[a-zA-Z]{2,}(?:-[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .max(320, "Email must not exceed 320 characters"),
  age: Yup.number()
    .min(18, "Age must be greater than 18")
    .required("Age is required"),
  gender: Yup.string().required("Gender is required"),
  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  profileImage: Yup.mixed()
    .test(
      "fileFormat",
      "Unsupported Format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value: any) => {
        if (value === null) return true;
        if (typeof value === "string") {
          const urlPattern = /\.(jpg|jpeg|png|jfif)$/i;
          return urlPattern.test(value);
        }
        return value && SUPPORTED_FORMATS.includes(value?.type);
      }
    )
    .test("fileSize", "File too large", (value: any) => {
      if (value === null) return true;
      if (typeof value === "string") return true;

      return value && value?.size <= FILE_SIZE;
    })
    .nullable(),
});

export function ProfileForm() {
  const [loader, setLoader] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formikRef = useRef<FormikProps<ProfileFormValues>>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const route = useRouter();
  const { data: session } = useSession() as { data: CustomSession };
  const [otpLoader, setOtpLoader] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationValues, setLocationValues] = useState<LocationTypes>({
    address: "",
    city: "",
    state: "",
    pincode: "",
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

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.formatted_address && formikRef.current) {
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
      const postalCodeComponent = place?.address_components?.find((component) =>
        component.types.includes("postal_code")
      );
      const postalCode = postalCodeComponent
        ? postalCodeComponent.long_name
        : null;
      setLocationValues({
        address: formattedAddress,
        city: cityName || "",
        state: state,
        pincode: postalCode || "",
      });
      formikRef.current.setFieldValue("address", formattedAddress);
      formikRef.current.setFieldValue("state", state);
      formikRef.current.setFieldValue("city", cityName);
      // FormikRef.current.setFieldError("address", "");
      // eslint-disable-next-line brace-style
    }
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

  const handleOtpVerification = async () => {
    if (session && session.user?.id) {
      setOtpLoader(true);
      try {
        // eslint-disable-next-line object-curly-newline
        const formData = new FormData();
        formData.append("customer_id", session.user?.id?.toString() || "");
        formData.append("otp_type", "phone");
        const response = await axiosInstance.post(
          "/customer/generate-otp",
          formData
        );

        if (response.status === 200) {
          toast({
            description: response.data.message,
            title: "Success",
            variant: "success",
          });
          route.push("/verify-otp");
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
    if (values.profileImage !== initialValues.profileImage)
      formData.append("profile_photo", values.profileImage || "");

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
        setPhoneVerified(profileData.phone_verified_at);
        setInitialValues({
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
        });
        if (profileData.profile_photo)
          setProfileImageUrl(profileData.profile_photo);
      }
      // eslint-disable-next-line brace-style
    } catch (error) {
      setLoader(false);
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/customer/profile");
        if (response.status === 200) {
          const profileData = response.data.data;
          setPhoneVerified(profileData.phone_verified_at);
          setInitialValues({
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
          });
        }
        // eslint-disable-next-line brace-style
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      if (SUPPORTED_FORMATS.includes(file.type))
        if (file.size <= FILE_SIZE && formikRef.current) {
          formikRef.current.setFieldValue("profileImage", file.name);
          setProfileImageUrl(URL.createObjectURL(file));
          // eslint-disable-next-line brace-style
        } else
          toast({
            title: "Error",
            variant: "destructive",
            description:
              "File too large. Please upload a file smaller than 2MB.",
          });
      else
        toast({
          title: "Error",
          variant: "destructive",
          description:
            "Unsupported file format. Please upload a JPG, JPEG or PNG file.",
        });

      event.currentTarget.value = "";
    }
  };

  return (
    <Card className=" my-5 md:mr-9 mx-auto max-w-3xl">
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={ProfileSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, dirty }) => (
          <Form className="   p-3  md:p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24 border">
                <AvatarImage
                  src={profileImageUrl || "/pngs/profile-img.png"}
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
                  accept={SUPPORTED_FORMATS.join(",")}
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  type="button"
                  className="border border-[#D1D5DB] shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  🔄 Add or Replace Profile photo
                </Button>
                {profileImageUrl && (
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
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name&nbsp;
                  <span className="text-red-500">*</span>
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
                  Last Name&nbsp;
                  <span className="text-red-500">*</span>
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
                  Phone Number&nbsp;
                  <span className="text-red-500">*</span>
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
                    disabled
                  />
                  <Button
                    variant="outline"
                    type="button"
                    disabled={
                      otpLoader ||
                      (phoneVerified &&
                      initialValues.phoneNumber === values.phoneNumber
                        ? true
                        : false ||
                          values.phoneNumber.length !== 10 ||
                          values.phoneNumber === "")
                    }
                    className="bg-orange-500 text-white font-medium hover:text-white hover:bg-orange-600"
                    onClick={handleOtpVerification}
                  >
                    {otpLoader ? (
                      <div className="flex justify-center items-center w-full max-h-5">
                        <Lottie
                          loop
                          path="/lotties/button-loader.json"
                          play
                          style={{ width: "100%" }}
                        />
                      </div>
                    ) : phoneVerified &&
                      values.phoneNumber === initialValues.phoneNumber ? (
                      "Verified"
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email&nbsp;
                  <span className="text-red-500">*</span>
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
                  Age&nbsp;
                  <span className="text-red-500">*</span>
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
                Address&nbsp;
                <span className="text-red-500">*</span>
              </label>
              <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                libraries={["places"]}
              >
                <Field name="address">
                  {({
                    field,
                    form,
                  }: {
                    field: FieldInputProps<string>;
                    form: any;
                  }) => (
                    <Autocomplete
                      onLoad={(autocomplete) =>
                        (autocompleteRef.current = autocomplete)
                      }
                      onPlaceChanged={handlePlaceChanged}
                    >
                      <Input
                        {...field}
                        id="address"
                        type="text"
                        placeholder="Search for area, Street name.."
                        className="border border-[#D1D5DB]"
                        value={values.address}
                        // OnBlur={() => {
                        //   If (!locationValues.address)
                        //     Form.setFieldError(
                        //       "Address",
                        //       "Select a valid address"
                        //     );
                        // }}
                        onChange={(e) => {
                          form.setFieldValue("address", e.target.value);
                          setLocationValues({
                            ...locationValues,
                            address: "",
                          });
                        }}
                      />
                    </Autocomplete>
                  )}
                </Field>
              </LoadScript>
              <ErrorMessage
                name="address"
                component="div"
                className="text-sm text-red-500"
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
                <p className="font-normal text-sm text-[#7A7977]">Using GPS</p>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State&nbsp;
                  <span className="text-red-500">*</span>
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
                  City&nbsp;
                  <span className="text-red-500">*</span>
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
