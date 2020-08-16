import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RequestConfig extends AxiosRequestConfig {}

export type Response<T = any> = AxiosResponse<T>;

export class Request {
  constructor(private request = axios) {}

  public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config);
  }

  public static isRequestError(error: AxiosError): boolean {
    return !!(error.response && error.response.status);
  }
}
