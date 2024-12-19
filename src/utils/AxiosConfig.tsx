"use client";
import axios from "axios";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import { useEffect } from "react";

interface CustomSession extends Session {
  accessToken?: string;
}
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json, multipart/form-data",
    Authorization: "",
  },
});
const AxiosConfig = () => {
  useEffect(() => {
    axiosInstance.interceptors.request.use(
      async (request) => {
        const session = await getSession({ req: request });
        if (session) {
          const customSession: CustomSession = session;
          request.headers.Authorization = `Bearer ${customSession.accessToken}`;
        }
        return request;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) signOut({ callbackUrl: "/login" });
        return Promise.reject(error);
      }
    );
  }, []);

  return "";
};

export default AxiosConfig;
