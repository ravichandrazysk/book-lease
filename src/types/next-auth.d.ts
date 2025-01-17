import { AxiosResponse, AxiosError } from "axios";
export interface AxiosResponseTypes<T> extends AxiosResponse {
  data: T;
  status: number;
}
export interface AxiosErrorTypes extends AxiosError {
  response: {
    data: {
      message: string;
    };
  };
  status: number;
}

export interface CustomUser extends User {
  id?: number;
  coins?: number;
  profile_photo?: string | null;
  notification_counts?: {
    my_requests: number;
    received_requests: number;
  };
}
export interface CustomSession extends Session {
  accessToken?: string;
  user?: CustomUser;
}

export interface CredentialsDataTypes {
  isToken: boolean;
  data: string;
}
