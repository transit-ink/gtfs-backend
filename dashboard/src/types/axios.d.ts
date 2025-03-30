import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    headers?: {
      Authorization?: string;
      'Content-Type'?: string;
    };
  }
}

declare const axiosInstance: AxiosInstance;

export default axiosInstance;
