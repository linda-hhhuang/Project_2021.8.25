import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from './api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

//做有关用户操作的函数以及用户和夏令营活动成员验证

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<any | null>(null);
  user$ = this.user.asObservable();
  private userList = new BehaviorSubject<any | null>(null);
  userList$ = this.userList.asObservable();
  private isLogin = new BehaviorSubject<number>(-1);
  isLogin$ = this.isLogin.asObservable();
  private isLoading = new BehaviorSubject(false);
  isLoading$ = this.isLoading.asObservable();

  private member = new BehaviorSubject<any | null>(null);
  member$ = this.member.asObservable();
  private memberlist = new BehaviorSubject<any | null>(null);
  memberlist$ = this.memberlist.asObservable();
  private memberRole = new BehaviorSubject<number>(-1);
  memberRole$ = this.memberRole.asObservable();
  hasmember = -1;
  // 留个小坑
  //如果服务器请求超时了现在的系统没有等待提示也没有超时挽回(比如超过了8秒就取消重来这种)
  constructor(
    @SkipSelf()
    @Optional()
    userserv: UserService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (userserv) {
      throw new Error(
        'You should not import UserService which is already imported in root!'
      );
    }
    this.init().subscribe();
  }

  init() {
    console.log('a init');
    this.isLoading.next(true);
    return this.api.get<any>('/user/login').pipe(
      tap({
        next: (response) => {
          this.user.next(response.body);
          this.isLogin.next(Number(response.body != null));
          console.log('in user service init', response.body != null);
          console.log('in user service init', response);
        },
        error: (err) => {
          this.user.next(null);
          this.isLogin.next(0);
        },
      }),
      finalize(() => this.isLoading.next(false))
    );
  }

  memberInit() {
    console.log('a member init');
    this.isLoading.next(true);

    if (this.user.value.role == 0 || this.user.value.role == 1) {
      return this.api.get<any>('/user/login').pipe(
        tap({
          next: (response) => {
            // this.memberlist.next(response.body);
            console.log('in user member init 01', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        }),
        finalize(() => {
          this.isLoading.next(false);
          this.memberRole.next(this.user.value.role);
        })
      );
    } else if (this.user.value.role == 2) {
      return this.api.get<any>('/user/login').pipe(
        tap({
          next: (response) => {
            // this.member.next(response.body);
            console.log('in user member init 2', response);
            this.hasmember = 1;
          },
          error: (err) => {
            this.hasmember = 0;
            this.handleError(err.error.msg);
          },
        }),
        finalize(() => {
          this.isLoading.next(false);
          this.memberRole.next(this.user.value.role);
        })
      );
    } else if (this.user.value.role == 3) {
      return this.api.get<any>('/member/student/me').pipe(
        tap({
          next: (response) => {
            this.member.next(response.body);
            this.hasmember = 1;
            console.log('in user member init 3', response);
          },
          error: (err) => {
            this.hasmember = 0;
            this.handleError(err.error.msg);
          },
        }),
        finalize(() => {
          this.isLoading.next(false);
          this.memberRole.next(this.user.value.role);
        })
      );
    }

    console.log('member null error!!');
    return new Observable<any>();
  }

  login(username: number, password: string) {
    this.isLoading.next(true);
    return this.api.get<any>(`user/fakelogin/${username}`).pipe(
      tap({
        next: (response) => {
          this.user.next(response.body);
          this.isLogin.next(Number(response.body != null));
          this.memberInit().subscribe();
          console.log('in user service login ok', response);
        },
        error: (err) => {
          this.user.next(null);
          this.isLogin.next(0);
          this.handleError(err.error.msg);
        },
      }),
      finalize(() => this.isLoading.next(false))
    );
  }

  logout() {
    this.isLoading.next(true);
    return this.api.get<any>('/user/logout').pipe(
      tap((response) => {
        this.init().subscribe();
        console.log('in user service logout', response);
      }),
      finalize(() => this.isLoading.next(false))
    );
  }

  getUserList() {
    this.isLoading.next(true);
    return this.api.get<any>('/user/list').pipe(
      tap({
        next: (response) => {
          this.userList.next(response.body);
          console.log('in user geruserlist ', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      }),
      finalize(() => {
        this.isLoading.next(false);
      })
    );
  }

  importUser(importUserData: any) {
    this.isLoading.next(true);
    return this.api.post<any>('/user/import', importUserData).pipe(
      tap({
        next: (response) => {
          this.getUserList().subscribe();
          console.log('in user service importUser ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      }),
      finalize(() => this.isLoading.next(false))
    );
  }

  deleteUser(uid: number) {
    this.isLoading.next(true);
    return this.api.delete<any>(`/user/${uid}`).pipe(
      tap({
        next: (response) => {
          this.getUserList().subscribe();
          console.log('in user service deleteUser ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      }),
      finalize(() => this.isLoading.next(false))
    );
  }
  resetPassword(resetPassword: string, uid?: number) {
    this.isLoading.next(true);
    return this.api
      .post<any>('/user/password', {
        uid: uid,
        password: resetPassword,
      })
      .pipe(
        tap({
          next: (response) => {
            console.log('in user service resetPassword ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        }),
        finalize(() => this.isLoading.next(false))
      );
  }

  resetRole(resetRole: number, uid: number) {
    this.isLoading.next(true);
    return this.api
      .post<any>(`/user/${uid}/role`, {
        userRole: resetRole,
      })
      .pipe(
        tap({
          next: (response) => {
            this.getUserList().subscribe();
            console.log('in user service resetRole ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        }),
        finalize(() => this.isLoading.next(false))
      );
  }

  private handleError(error: string) {
    this.notify.error('错误', error);
    if (error == '未登录') {
      location.reload();
    }
  }
}
