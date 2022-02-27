import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';

import { timeout, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { NzNotificationService } from 'ng-zorro-antd/notification';

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
  constructor(
    private http: HttpClient,
    private notify: NzNotificationService
  ) {}

  get<T>(url: string, options?: HttpOptions) {
    return this.http.get<T>(api(url), options).pipe(
      timeout(8000),
      tap({
        next: (response) => {
          return response;
        },
        error: (err) => {
          if (err.name == 'TimeoutError') {
            this.handleError('网络超时,请刷新');
          }
        },
      })
    );
  }

  post<T>(url: string, payload: any, options?: HttpOptions) {
    return this.http.post<T>(api(url), payload, options).pipe(
      timeout(8000),
      tap({
        next: (response) => {
          return response;
        },
        error: (err) => {
          if (err.name == 'TimeoutError') {
            this.handleError('网络超时,请刷新');
          }
        },
      })
    );
  }

  put<T>(url: string, payload: any, options?: HttpOptions) {
    return this.http.put<T>(api(url), payload, options).pipe(
      timeout(8000),
      tap({
        next: (response) => {
          return response;
        },
        error: (err) => {
          if (err.name == 'TimeoutError') {
            this.handleError('网络超时,请刷新');
          }
        },
      })
    );
  }

  delete<T>(url: string, options?: HttpOptions) {
    return this.http.delete<T>(api(url), options).pipe(
      timeout(8000),
      tap({
        next: (response) => {
          return response;
        },
        error: (err) => {
          if (err.name == 'TimeoutError') {
            this.handleError('网络超时,请刷新');
          }
        },
      })
    );
  }

  private handleError(error: string) {
    this.notify.error('错误', error);
    if (error == '未登录') {
      location.reload();
    }
  }
}
