import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { get } from 'lodash';
import { getAccessToken, getUserInfo, revokeUser } from 'utils/cookie';
import { getLocalStorage } from 'utils/store';
import { DEFAULT_LANGUAGE } from 'config/constants';
import { StatusCode } from 'enums/app';
import { windowRedirect } from 'utils/helpers';

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
};

const AxiosRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  try {
    const token = getAccessToken();
    const language = getLocalStorage('language') || DEFAULT_LANGUAGE;

    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.Language = language;

    return config;
  } catch (error) {
    throw new Error(error as string);
  }
};

class HttpRequest {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    if (this.instance) {
      return this.instance;
    }
    return this.init();
  }

  init(): AxiosInstance {
    const http = axios.create({
      baseURL: API_URL,
      headers,
    });

    http.interceptors.request.use(AxiosRequest, (error) =>
      Promise.reject(error),
    );

    http.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const status = get(error, 'response.status');
        const errorData = get(error, 'response.data');
        switch (status) {
          case StatusCode.Unauthorized: {
            const userInfo = getUserInfo();
            if (userInfo) {
              this.logout();
            }
            break;
          }
          case StatusCode.BadRequest: {
            return Promise.reject({ ...errorData, status });
          }
          case StatusCode.Forbidden: {
            break;
          }
          case StatusCode.InternalServerError: {
            break;
          }
          case StatusCode.TooManyRequests: {
            break;
          }
        }
        return Promise.reject(errorData);
      },
    );

    this.instance = http;
    return http;
  }

  request<T, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.http.request(config);
  }

  get<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  delete<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }

  logout(): void {
    revokeUser();
    windowRedirect(`/sign-in`);
  }
}

export default new HttpRequest();
