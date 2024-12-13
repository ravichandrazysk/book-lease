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

export interface CredentialsDataTypes {
  isToken: boolean;
  data: string;
}
