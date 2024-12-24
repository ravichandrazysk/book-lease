/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable multiline-ternary */
"use client";

import { useCallback, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const FILE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

const validationSchema = Yup.object().shape({
  coverImage: Yup.mixed()
    .required("Cover image is required")
    .test(
      "fileSize",
      "File too large",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value: any) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (value: any) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
  title: Yup.string().required("Book title is required"),
  author: Yup.string().required("Author name is required"),
  description: Yup.string()
    .max(650, "Description must be 650 characters or less")
    .required("Book description is required"),
  category: Yup.string().required("Category is required"),
  tags: Yup.string().required("Tags are required"),
  condition: Yup.string().required("Book condition is required"),
  age: Yup.string().required("Book age is required"),
  availabilityType: Yup.string().required("Please select availability type"),
  rentPrice: Yup.number().when("availabilityType", {
    is: "rent",
    then: (schema) =>
      schema
        .required("Rent price is required")
        .min(0, "Price must be positive"),
    otherwise: (schema) => schema.notRequired(),
  }),
  discountedRentPrice: Yup.number().when("availabilityType", {
    is: "rent",
    then: (schema) =>
      schema
        .min(0, "Price must be positive")
        .max(
          Yup.ref("rentPrice"),
          "Discounted price must be less than rent price"
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface FormValues {
  coverImage: File | null;
  title: string;
  author: string;
  description: string;
  category: string;
  tags: string;
  condition: string;
  age: string;
  availabilityType: "sell" | "rent" | "free";
  rentPrice: string;
  discountedRentPrice: string;
  editingReason?: string;
}

export function BookCreateForm({
  onAction,
  isEditing,
}: {
  onAction: () => void;
  isEditing: boolean;
}) {
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (formikRef.current)
      formikRef.current.setFieldValue("coverImage", acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
  });

  const initialValues: FormValues = {
    coverImage: null,
    title: "",
    author: "",
    description: "",
    category: "",
    tags: "",
    condition: "",
    age: "",
    availabilityType: "rent",
    rentPrice: "",
    discountedRentPrice: "",
    editingReason: "",
  };

  const handleSubmit = (values: FormValues) => {
    alert(values);
    onAction();
    // Handle form submission
  };

  return (
    <Card className=" mx-auto mt-5">
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => {
          return (
            <Form className="space-y-6 p-6 ">
              <div className="space-y-2">
                <Label className="text-base font-normal">Cover Image</Label>
                <p className="text-sm font-normal text-[#6B7280]">
                  Upload your book cover image from here. Dimensions should be
                  960 x 340 px.
                </p>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
                >
                  <input {...getInputProps()} />
                  {values.coverImage ? (
                    <div className="relative">
                      <Image
                        src={URL.createObjectURL(values.coverImage)}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="sm:max-h-[340px] min-w-max min-h-max mx-auto"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
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
                        (.png, .jpg)
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
                    Book Title
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
                  <Label htmlFor="author">Author</Label>
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
                <Label htmlFor="description">Book Description</Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Add some description of the book ( maximum 650 characters )"
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
                  <Label htmlFor="category">Category</Label>
                  <Field name="category">
                    {({ field, form }: any) => (
                      <Select
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
                          <SelectItem value="fiction">Fiction</SelectItem>
                          <SelectItem value="non-fiction">
                            Non-Fiction
                          </SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Field name="tags">
                    {({ field, form }: any) => (
                      <Select
                        onValueChange={(value) =>
                          form.setFieldValue("tags", value)
                        }
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bestseller">Bestseller</SelectItem>
                          <SelectItem value="classic">Classic</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="tags"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition of the Book</Label>
                  <Field name="condition">
                    {({ field, form }: any) => (
                      <Select
                        onValueChange={(value) =>
                          form.setFieldValue("condition", value)
                        }
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like-new">Like New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="condition"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Field name="age">
                    {({ field, form }: any) => (
                      <Select
                        onValueChange={(value) =>
                          form.setFieldValue("age", value)
                        }
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="2-5">2-5 years</SelectItem>
                          <SelectItem value="5+">5+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="age"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Choose Availability Type</Label>
                <Field name="availabilityType">
                  {({ field, form }: any) => (
                    <RadioGroup
                      defaultValue="rent"
                      value={field.value}
                      onValueChange={(value) =>
                        form.setFieldValue("availabilityType", value)
                      }
                      className="flex gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sell" id="sell" />
                        <Label htmlFor="sell">Sell</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rent" id="rent" />
                        <Label htmlFor="rent">Rent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free" id="free" />
                        <Label htmlFor="free">Free</Label>
                      </div>
                    </RadioGroup>
                  )}
                </Field>
                <ErrorMessage
                  name="availabilityType"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              {values.availabilityType === "rent" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="rentPrice">Rent Price</Label>
                    <Field
                      as={Input}
                      id="rentPrice"
                      name="rentPrice"
                      type="number"
                      placeholder="Enter amount per day"
                    />
                    <ErrorMessage
                      name="rentPrice"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountedRentPrice">
                      Discounted Rent Price
                    </Label>
                    <Field
                      as={Input}
                      id="discountedRentPrice"
                      name="discountedRentPrice"
                      type="number"
                      placeholder="Enter discounted amount per day"
                    />
                    <ErrorMessage
                      name="discountedRentPrice"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>
              )}
              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Why are you editing this information?
                  </Label>
                  <Field
                    as={Textarea}
                    id="editingReason"
                    name="editingReason"
                    placeholder="Describe the reason for editing this book’s details"
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
                  className="bg-orange-500 hover:bg-orange-600 max-sm:w-36"
                >
                  Add Book
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
}
