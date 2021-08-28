import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';

export interface HttpOptions {
  body?: any;
  headers?: HttpHeaders | { [header: string]: string | string[] };
  observe?: 'body';
  params?: HttpParams | { [param: string]: string | string[] };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

export interface HttpOptionsWithFile {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'text';
  withCredentials?: boolean;
}

const CONNECTION_TIMEOUT = 8000;
const PREFIX = '/api';
export function api(url: string): string {
  return `${PREFIX}/${url.replace(/^\//, '')}`;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: HttpOptions) {
    return this.http.get<T>(api(url), options);
  }

  post<T>(url: string, payload: any, options?: HttpOptions) {
    return this.http.post<T>(api(url), payload, options);
  }

  put<T>(url: string, payload: any, options?: HttpOptions) {
    return this.http.put<T>(api(url), payload, options);
  }

  delete<T>(url: string, options?: HttpOptions) {
    return this.http.delete<T>(api(url), options);
  }
}
