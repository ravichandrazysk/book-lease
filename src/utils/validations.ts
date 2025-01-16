import * as Yup from "yup";

// File size
export const FILE_SIZE = 2 * 1024 * 1024;
// Supported formats
export const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/jfif",
];

export const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .matches(/^[a-zA-Z]+$/, "First name must contain only alphabets"),
  lastName: Yup.string().matches(
    /^[a-zA-Z]+$/,
    "First name must contain only alphabets"
  ),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .matches(/^[6-9]\d{9}$/, "Invalid phone number"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*@[a-zA-Z]{2,}(?:-[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  password: Yup.string()
    .min(12, "Password must be at least 12 characters")
    .max(22, "Password must be at most 22 characters")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[^\w]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    // eslint-disable-next-line no-undefined
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
  age: Yup.number()
    .min(5, "Age must be greater than 5")
    .required("Age is required"),
  gender: Yup.string().required("Gender is required"),
  address: Yup.string().required("Address is required"),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9]+(?:[._+-][a-zA-Z0-9]+)*@[a-zA-Z]{2,}(?:-[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    ),
  password: Yup.string()
    .required("Password is required")
    .min(12, "Password must be at least 12 characters")
    .max(22, "Password must be at most 22 characters")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[^\w]/, "Password must contain at least one special character"),
});

export const ProfileSchema = Yup.object().shape({
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
    .min(5, "Age must be greater than 5")
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .test("fileSize", "File too large", (value: any) => {
      if (value === null) return true;
      if (typeof value === "string") return true;

      return value && value?.size <= FILE_SIZE;
    })
    .nullable(),
});

export const CustomerSupportValidationSchema = Yup.object({
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

export const BookCreateEditValidationSchema = (isEditing: boolean) =>
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      .max(1000, "Description must be 1000 characters or less")
      .required("Book description is required")
      .matches(
        /^(?=.*[a-zA-Z])[a-zA-Z0-9\s'-:;><@()%&^*#${}_",.!?]{1,1000}$/,
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
