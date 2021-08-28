import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '@core/service/api.service';
import { tap, map } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class PrintRequestService {
  private requestList = new BehaviorSubject<any[] | null>(null);
  requestList$ = this.requestList.asObservable();

  constructor(
    @SkipSelf()
    @Optional()
    requestSrvc: PrintRequestService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (requestSrvc) {
      throw new Error(
        'You should not import requestSrvc which is already imported in root!'
      );
    }
  }

  //学生
  getRequestInfo(rid: number) {
    return this.api.get<any>(`/request/${rid}`).pipe(
      tap({
        next: (response) => {
          this.requestList.next([response.body]);
          console.log('in print-request service getRequest', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  //教务
  getRequestInfoList() {
    return this.api.get<any>(`/request/eduadmin`).pipe(
      tap({
        next: (response) => {
          this.requestList.next(response.body);
          console.log('in print-request service getRequestInfoList', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
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
