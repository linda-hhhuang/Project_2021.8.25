import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Injectable({
  providedIn: 'root',
})
export class TimeService {
  private currentTimeFrom = new BehaviorSubject<number | null>(null);
  currentTimeFrom$ = this.currentTimeFrom.asObservable();

  private currentTimeTo = new BehaviorSubject<number | null>(null);
  currentTimeTo$ = this.currentTimeTo.asObservable();

  private currentStatus = new BehaviorSubject<number>(0); //0-未开始,1-进行中,2-已结束
  currentStatus$ = this.currentStatus.asObservable();

  constructor(
    @SkipSelf()
    @Optional()
    timeSrvc: TimeService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (timeSrvc) {
      throw new Error(
        'You should not import TimeService which is already imported in root!'
      );
    }
    this.getTime().subscribe();
  }

  getTime() {
    return this.api.get<any>('/timerange').pipe(
      tap({
        next: (response) => {
          this.currentTimeFrom.next(Number(response.body.start));
          this.currentTimeTo.next(Number(response.body.end));
          console.log('in user service getTime ok', response);
          const now = Date.now();
          if (now < Number(response.body.start)) this.currentStatus.next(0);
          else if (now > Number(response.body.end)) this.currentStatus.next(2);
          else this.currentStatus.next(1);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  setTime(from: number, to: number) {
    return this.api
      .post<any>('/timerange', {
        start: from,
        end: to,
      })
      .pipe(
        tap({
          next: (response) => {
            this.currentTimeFrom.next(Number(response.body.start));
            this.currentTimeTo.next(Number(response.body.end));
            const now = Date.now();
            if (now < Number(response.body.start)) this.currentStatus.next(0);
            else if (now > Number(response.body.end))
              this.currentStatus.next(2);
            else this.currentStatus.next(1);
            console.log('in user service setTime ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  formatDateTime(date: Date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let mm = m < 10 ? '0' + m : m;
    let d = date.getDate();
    let dd = d < 10 ? '0' + d : d;
    let h = date.getHours();
    let hh = h < 10 ? '0' + h : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let minuteS = minute < 10 ? '0' + minute : minute;
    let secondS = second < 10 ? '0' + second : second;
    return y + '-' + mm + '-' + dd + ' ' + hh + ':' + minuteS + ':' + secondS;
  }

  private handleError(error: string) {
    this.notify.error('错误', error);
    if (error == '未登录') {
      location.reload();
    }
  }
}
