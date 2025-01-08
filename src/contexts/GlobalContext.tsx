/* eslint-disable camelcase */
"use client";
import { ContextTypes } from "@/types/common-types";
import { createContext } from "react";
const GlobalContext = createContext<ContextTypes>({
  refreshNotifications: false,
  setRefreshNotifications: () => {},
  changeProfile: false,
  setChangeProfile: () => {},
  profileDetails: {
    address_line_1: "",
    age: null,
    city: "",
    coins: 0,
    email: "",
    email_verified: false,
    first_name: "",
    gender: "",
    id: 0,
    last_name: "",
    notification_counts: {
      my_requests: 0,
      received_requests: 0,
    },
    phone: null,
    phone_verified_at: "",
    pincode: 0,
    profile_photo: "",
    state: "",
  },
  setProfileDetails: () => {},
});
export default GlobalContext;
