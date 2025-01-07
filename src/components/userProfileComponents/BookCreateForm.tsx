/* eslint-disable indent */
/* eslint-disable no-extra-parens */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable multiline-ternary */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { axiosInstance } from "@/utils/AxiosConfig";
import { isAxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import {
  BooCreateEditFormTypes,
  BookConditionTypes,
  CategoryTypes,
  LanguagesTypes,
  MyBookTypes,
  TagsTypes,
} from "@/types/common-types";
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });
const Select = dynamic(() => import("react-select"), { ssr: false });

const FILE_SIZE = 2 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/jfif",
];

const validationSchema = (isEditing: boolean) =>
  Yup.object().shape({
    coverImage: Yup.mixed()
      .required("Cover image is required")
      .test(
        "fileFormat",
        "Unsupported Format",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (value: any) => {
          if (typeof value === "string") {
            const urlPattern = /\.(jpg|jpeg|png|jfif)$/i;
            return urlPattern.test(value);
          }
          return value && SUPPORTED_FORMATS.includes(value?.type);
        }
      )
      .test("fileSize", "File too large", (value: any) => {
        if (typeof value === "string") return true;
        return value && value?.size <= FILE_SIZE;
      }),
    title: Yup.string()
      .trim()
      .min(1, "Title is required.")
      .max(100, "Max 100 characters allowed.")
      .matches(
        /^[a-zA-Z0-9\s'-:,.!?]+$/,
        "Invalid characters  are not allowed."
      )
      .matches(
        /^(?![0-9]*$)(?![!@#$%^&*(),.?":{}|<>]*$).{1,100}$/,
        "Title must contain at least one letter."
      )
      .required("Title is required."),
    author: Yup.string().required("Author name is required"),
    description: Yup.string()
      .min(1, "Description must be 1 character or more")
      .max(500, "Description must be 500 characters or less")
      .required("Book description is required")
      .matches(
        /^(?=.*[a-zA-Z])[a-zA-Z0-9\s'-:;><@()%&^*#${}_",.!?]{1,500}$/,
        "Input must not be only numbers or only special characters."
      ),
    category: Yup.string().required("Category is required"),
    tags: Yup.string().required("Tags are required"),
    condition: Yup.string().required("Book condition is required"),
    age: Yup.string().required("Age is required"),
    availabilityType: Yup.string().required("Please select availability type"),
    rentPrice: Yup.number().when("availabilityType", {
      is: "rent",
      then: (schema) =>
        schema
          .required("Original price is required")
          .min(0, "Price must be positive"),
      otherwise: (schema) => schema.notRequired(),
    }),
    sellPrice: Yup.number().when("availabilityType", {
      is: "sell",
      then: (schema) =>
        schema
          .required("Original price is required")
          .min(0, "Price must be positive"),
      otherwise: (schema) => schema.notRequired(),
    }),
    discountedSellPrice: Yup.number().when("availabilityType", {
      is: "sell",
      then: (schema) =>
        schema
          .min(0, "Price must be positive")
          .max(
            Yup.ref("sellPrice"),
            "Listing price must be less than original price"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    discountedRentPrice: Yup.number().when("availabilityType", {
      is: "rent",
      then: (schema) =>
        schema
          .min(0, "Price must be positive")
          .max(
            Yup.ref("rentPrice"),
            "Listing price must be less than original price"
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    editingReason: Yup.string().when([], {
      is: () => isEditing,
      then: (schema) =>
        schema
          .max(650, "Editing reason must be 650 characters or less")
          .required("Editing reason is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

export function BookCreateForm({
  onAction,
  isEditing,
  existingBookDetails,
  refetchBooks,
}: {
  onAction: () => void;
  isEditing: boolean;
  existingBookDetails?: MyBookTypes;
  refetchBooks: () => void;
}) {
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [tags, setTags] = useState<TagsTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<LanguagesTypes[]>([]);
  const [conditions, setConditions] = useState<BookConditionTypes[]>([]);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const initialValues = {
    coverImage:
      (isEditing &&
        existingBookDetails &&
        existingBookDetails.images &&
        existingBookDetails?.images[0]?.image_path) ||
      null,
    title: (isEditing && existingBookDetails?.name) || "",
    author: (isEditing && existingBookDetails?.author) || "",
    description: (isEditing && existingBookDetails?.description) || "",
    category:
      (isEditing && existingBookDetails?.category?.id?.toString()) || "",
    tags: (isEditing && existingBookDetails?.tags[0].id.toString()) || "",
    condition: (isEditing && existingBookDetails?.condition) || "",
    age: (isEditing && existingBookDetails?.age_group) || "",
    availabilityType:
      (isEditing &&
        (existingBookDetails?.availability?.toLowerCase() as
          | "sell"
          | "rent"
          | "free")) ||
      "rent",
    rentPrice: (isEditing && existingBookDetails?.price?.toString()) || "",
    sellPrice: (isEditing && existingBookDetails?.price?.toString()) || "",
    discountedRentPrice:
      (isEditing && existingBookDetails?.discounted_price) || "",
    discountedSellPrice:
      (isEditing && existingBookDetails?.discounted_price) || "",
    editingReason: "",
    languages: [],
  };

  const formikRef = useRef<FormikProps<BooCreateEditFormTypes>>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (formikRef.current)
      formikRef.current.setFieldValue("coverImage", acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/jfif": [".jfif"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: FILE_SIZE,
    validator: (file) => {
      if (!SUPPORTED_FORMATS.includes(file.type))
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unsupported Format",
        });

      if (file.size > FILE_SIZE)
        toast({
          variant: "destructive",
          title: "Error",
          description: "File too large",
        });

      return null;
    },
  });

  // Handle edit or create book
  const handleSubmit = async (values: BooCreateEditFormTypes) => {
    const formData = new FormData();
    if (values.coverImage instanceof File)
      formData.append("cover_image", values.coverImage as File);
    formData.append("name", values.title);
    formData.append("author", values.author);
    formData.append("description", values.description);
    formData.append("category_id", values.category);
    formData.append("tag_id", values.tags);
    formData.append("condition", values.condition);
    formData.append("age", values.age);
    formData.append(
      "availability_type",
      values.availabilityType === "free" || values.availabilityType === "sell"
        ? "Sell"
        : "Lease"
    );
    formData.append("is_free", values.availabilityType === "free" ? "1" : "0");
    if (values.availabilityType !== "free") {
      formData.append(
        "price",
        values.availabilityType === "rent"
          ? values.rentPrice || ""
          : values.sellPrice || ""
      );
      formData.append(
        "discounted_price",
        values.availabilityType === "rent"
          ? values.discountedRentPrice || ""
          : values.discountedSellPrice || ""
      );
    }
    values.languages.forEach((item) => {
      formData.append("languages_id[]", item.value);
    });
    try {
      setLoading(true);
      if (isEditing && existingBookDetails?.slug) {
        formData.append("update_reason", values.editingReason || "");
        const response = await axiosInstance.post(
          `/book-update/${existingBookDetails.slug}`,
          formData
        );
        if (response.status === 200) {
          toast({
            variant: "success",
            title: "Success",
            description: response.data.message,
          });
          setLoading(false);
        }
        // eslint-disable-next-line brace-style
      } else {
        const response = await axiosInstance.post(`/books`, formData);
        if (response.status === 200) {
          toast({
            variant: "success",
            title: "Success",
            description: response.data.message,
          });
          setLoading(false);
        }
      }
      onAction();
      refetchBooks();
      // eslint-disable-next-line brace-style
    } catch (error) {
      setLoading(false);
      if (
        isAxiosError(error) &&
        error.status &&
        error.status >= 400 &&
        error.status < 500 &&
        error.response
      )
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
      else
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong",
        });
    }
  };

  // Categories List
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        if (response.status === 200) setCategories(response.data.data);
        // eslint-disable-next-line brace-style
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("categories fetch error", error);
      }
    };
    fetchCategories();
  }, []);
  // Tags List
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get("/tags");
        if (response.status === 200) setTags(response.data.data);
        // eslint-disable-next-line brace-style
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("categories fetch error", error);
      }
    };
    fetchTags();
  }, []);
  // Conditions List
  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await axiosInstance.get("/book-condition");
        if (response.status === 200)
          setConditions(response.data.book_condition);
        // eslint-disable-next-line brace-style
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("categories fetch error", error);
      }
    };
    fetchConditions();
  }, []);
  // Languages List
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axiosInstance.get("/languages");
        if (response.status === 200) setLanguages(response.data.data);
        // eslint-disable-next-line brace-style
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("categories fetch error", error);
      }
    };
    fetchLanguages();
  }, []);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "0.375rem",
      borderColor: "#D1D5DB",
      "&:hover": { borderColor: "#D1D5DB" },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#E5E7EB",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#374151",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#374151",
      "&:hover": {
        backgroundColor: "#FF851B",
        color: "#111827",
      },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor:
        state.isFocused || state.isSelected
          ? "#FAFAFA"
          : provided.backgroundColor,
      color: state.isFocused || state.isSelected ? "#111827" : provided.color,
    }),
  };

  return (
    <Card className=" mx-auto mt-5">
      <Formik
        enableReinitialize
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema(isEditing)}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, dirty }) => {
          return (
            <Form className="space-y-6 p-6 ">
              <div className="space-y-2">
                <Label className="text-base font-normal">
                  Cover Image <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm font-normal text-[#6B7280]">
                  Upload your book cover image from here. (Max file size should
                  be 2MB).
                </p>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-lg min-h-28 p-8 text-center cursor-pointer hover:border-primary"
                >
                  <input {...getInputProps()} />
                  {values.coverImage && isEditing ? (
                    <div className="relative flex items-center justify-center">
                      <div className="max-w-2xl max-h-72">
                        <Image
                          src={
                            values.coverImage instanceof File
                              ? URL.createObjectURL(values.coverImage)
                              : values.coverImage || "/default-image-path.jpg"
                          }
                          alt="Preview"
                          width={100}
                          height={100}
                          className="sm:max-h-[340px] aspect-3/4 max-w-2xl min-h-max mx-auto"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFieldValue("coverImage", null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <span className="text-blue-600">upload an image</span>{" "}
                        or drag and drop
                      </div>
                      <p className="text-xs text-muted-foreground">
                        (.png, .jpg, .jpeg)
                      </p>
                    </div>
                  )}
                </div>
                <ErrorMessage
                  name="coverImage"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-normal">
                    Book Title&nbsp;
                    <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="Add your book's title here"
                    className="placeholder:text-[#6B7280] font-normal"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="author"
                    className="text-base font-normal text-[#202124]"
                  >
                    Author&nbsp;
                    <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="author"
                    name="author"
                    placeholder="Add your book's author name here"
                    className="placeholder:text-[#6B7280] font-normal"
                  />
                  <ErrorMessage
                    name="author"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-base font-normal text-[#202124]"
                >
                  Book Description&nbsp;
                  <span className="text-red-500">*</span>
                </Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Add some description of the book ( maximum 500 characters )"
                  className="placeholder:text-[#6B7280] font-normal"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-base font-normal text-[#202124]"
                  >
                    Category&nbsp;
                    <span className="text-red-500">*</span>
                  </Label>
                  <Field name="category">
                    {({ field, form }: any) => (
                      <UiSelect
                        onValueChange={(value) =>
                          form.setFieldValue("category", value)
                        }
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select"
                            className="placeholder:text-[#6B7280] font-normal"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories && categories.length > 0 ? (
                            categories.map((category: CategoryTypes) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-gray-500 text-center">
                              No categories found
                            </div>
                          )}
                        </SelectContent>
                      </UiSelect>
                    )}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="tags"
                    className="text-base font-normal text-[#202124]"
                  >
                    Tags&nbsp;
                    <span className="text-red-500">*</span>
                  </Label>
                  <Field name="tags">
                    {({ field, form }: any) => (
                      <UiSelect
                        onValueChange={(value) =>
                          form.setFieldValue("tags", value)
                        }
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select"
                            className="placeholder:text-[#6B7280] font-normal"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {tags && tags.length > 0 ? (
                            tags.map((tag: TagsTypes) => (
                              <SelectItem
                                key={tag.id}
                                value={tag.id.toString()}
                              >
                                {tag.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-gray-500 text-center">
                              No tags found
                            </div>
                          )}
                        </SelectContent>
                      </UiSelect>
                    )}
                  </Field>
                  <ErrorMessage
                    name="tags"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="condition"
                    className="text-base font-normal text-[#202124]"
                  >
                    Condition of the Book&nbsp;
                    <span className="text-red-500">*</span>
                  </Label>
                  <Field name="condition">
                    {({ field, form }: any) => (
                      <UiSelect
                        onValueChange={(value) =>
                          form.setFieldValue("condition", value)
                        }
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select"
                            className="placeholder:text-[#6B7280] font-normal"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions && conditions.length > 0 ? (
                            conditions.map((condition: BookConditionTypes) => (
                              <SelectItem
                                key={condition.value}
                                value={condition.value}
                              >
                                {condition.label}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-gray-500 text-center">
                              No conditions found
                            </div>
                          )}
                        </SelectContent>
                      </UiSelect>
                    )}
                  </Field>
                  <ErrorMessage
                    name="condition"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="age"
                    className="text-base font-normal text-[#202124]"
                  >
                    Age&nbsp;
                    <span className="text-red-500">*</span>
                  </Label>
                  <Field name="age">
                    {({ field, form }: any) => (
                      <UiSelect
                        onValueChange={(value) =>
                          form.setFieldValue("age", value)
                        }
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select"
                            className="placeholder:text-[#6B7280] font-normal"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories && categories.length > 0 ? (
                            categories.map((category: CategoryTypes) => (
                              <SelectItem
                                key={category.id}
                                value={category.age}
                              >
                                {category.age}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-gray-500 text-center">
                              No age ranges found
                            </div>
                          )}
                        </SelectContent>
                      </UiSelect>
                    )}
                  </Field>
                  <ErrorMessage
                    name="age"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
                {!isEditing && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="languages"
                      className="text-base font-normal text-[#202124]"
                    >
                      Languages&nbsp;
                      <span className="text-red-500">*</span>
                    </Label>
                    <Field name="languages">
                      {({ field, form }: any) => (
                        <Select
                          isMulti
                          styles={customStyles}
                          options={languages.map((language) => ({
                            label: language.name,
                            value: language.id.toString(),
                          }))}
                          onChange={(newValue: any) =>
                            form.setFieldValue("languages", newValue)
                          }
                          value={field.value}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="languages"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-normal text-[#202124]">
                  Choose Availability Type&nbsp;
                  <span className="text-red-500">*</span>
                </Label>
                <Field name="availabilityType">
                  {({ field, form }: any) => (
                    <RadioGroup
                      defaultValue="rent"
                      value={field.value}
                      onValueChange={(value) =>
                        form.setFieldValue("availabilityType", value)
                      }
                      className="flex gap-8"
                    >
                      {["Sell", "Rent", "Free"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={type.toLowerCase()}
                            id={type.toLowerCase()}
                          />
                          <Label
                            htmlFor={type.toLowerCase()}
                            className="text-base font-normal leading-none text-gray-900"
                          >
                            {type}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </Field>
                <ErrorMessage
                  name="availabilityType"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              {(values.availabilityType === "rent" ||
                values.availabilityType === "sell") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="rentPrice"
                      className="text-base font-normal text-[#202124]"
                    >
                      Original price &nbsp;
                      <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id={
                        values.availabilityType === "rent"
                          ? "rentPrice"
                          : "sellPrice"
                      }
                      name={
                        values.availabilityType === "rent"
                          ? "rentPrice"
                          : "sellPrice"
                      }
                      type="number"
                      placeholder={
                        values.availabilityType === "rent"
                          ? "Enter rent amount"
                          : "Enter the amount"
                      }
                      className="placeholder:text-[#6B7280] font-normal"
                    />
                    <ErrorMessage
                      name={
                        values.availabilityType === "rent"
                          ? "rentPrice"
                          : "sellPrice"
                      }
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="discountedRentPrice"
                      className="text-base font-normal text-[#202124]"
                    >
                      Listing Price
                    </Label>
                    <Field
                      as={Input}
                      id={
                        values.availabilityType === "rent"
                          ? "discountedRentPrice"
                          : "discountedSellPrice"
                      }
                      name={
                        values.availabilityType === "rent"
                          ? "discountedRentPrice"
                          : "discountedSellPrice"
                      }
                      type="number"
                      placeholder={
                        values.availabilityType === "rent"
                          ? "Enter listing amount"
                          : "Enter discount amount"
                      }
                      className="placeholder:text-[#6B7280] font-normal"
                    />
                    <ErrorMessage
                      name={
                        values.availabilityType === "rent"
                          ? "discountedRentPrice"
                          : "discountedSellPrice"
                      }
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>
              )}
              {isEditing && (
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-base font-normal text-[#202124]"
                  >
                    Why are you editing this information?&nbsp;
                    <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as={Textarea}
                    id="editingReason"
                    name="editingReason"
                    placeholder="Describe the reason for editing this book’s details"
                    className="placeholder:text-[#6B7280] font-normal"
                  />
                  <ErrorMessage
                    name="editingReason"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
              )}

              <div className="flex justify-between sm:justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="max-sm:w-36"
                  onClick={onAction}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 w-full flex-shrink-0 max-w-32 max-sm:w-36"
                  disabled={!dirty || loading}
                >
                  {loading ? (
                    <div className="flex justify-center w-full items-center ">
                      <Lottie
                        loop
                        path="/lotties/button-loader.json"
                        play
                        style={{ width: "70%" }}
                      />
                    </div>
                  ) : isEditing ? (
                    "Update Book"
                  ) : (
                    "Add Book"
                  )}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
}
