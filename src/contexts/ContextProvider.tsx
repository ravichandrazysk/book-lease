/* eslint-disable camelcase */
"use client";
import React, { useEffect, useState } from "react";
import GlobalContext from "@/contexts/GlobalContext";
import { ProfileDetails } from "@/types/common-types";
import { axiosInstance } from "@/utils/AxiosConfig";
import { isAxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [refreshNotifications, setRefreshNotifications] = useState(false);
  const [changeProfile, setChangeProfile] = useState(false);
  const [myBooksTabActive, setMyBooksTabActive] = useState(true);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>({
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
  });
  useEffect(() => {
    const getProfileDetails = async () => {
      try {
        const response = await axiosInstance.get("/customer/profile");
        if (response.status === 200) setProfileDetails(response.data.data);
        // eslint-disable-next-line brace-style
      } catch (error) {
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
    if (session) getProfileDetails();
  }, [session, changeProfile]);
  return (
    <GlobalContext.Provider
      value={{
        refreshNotifications,
        setRefreshNotifications,
        profileDetails,
        setProfileDetails,
        changeProfile,
        setChangeProfile,
        myBooksTabActive,
        setMyBooksTabActive,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;
