import { Injectable, Optional, SkipSelf } from '@angular/core';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { GroupList, GroupMember } from '@ta/model/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groupList = new BehaviorSubject<GroupList[] | null>(null);
  groupList$ = this.groupList.asObservable();

  private groupMember = new BehaviorSubject<GroupMember | null>(null);
  groupMember$ = this.groupMember.asObservable();

  constructor(
    @SkipSelf()
    @Optional()
    groupSrvc: GroupService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (groupSrvc) {
      throw new Error(
        'You should not import GroupService which is already imported in root!'
      );
    }
  }

  getGroupList() {
    return this.api.get<any>('/group/list').pipe(
      tap({
        next: (response) => {
          this.groupList.next(response.body);
          console.log('in Group service getGroupList', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  createGroup() {
    return this.api.post<any>('/group/new', null).pipe(
      tap({
        next: (response) => {
          // 返回GroupList实例
          console.log('in Group service createGroup', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteGroup(gid: number) {
    return this.api.delete<any>(`/group/${gid}`).pipe(
      tap({
        next: (response) => {
          this.getGroupList().subscribe();
          console.log('in Group service deleteGroup', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteAllGroup() {
    return this.api.post<any>(`/group/clear`, null).pipe(
      tap({
        next: (response) => {
          this.getGroupList().subscribe();
          console.log('in Group service addStudentInGroup', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getMemberInGroup(gid: number) {
    return this.api.get<any>(`/group/${gid}`).pipe(
      tap({
        next: (response) => {
          this.groupMember.next(response.body);
          console.log('in Group service getMemberInGroup', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  addStudentInGroup(gid: number, uid: number) {
    return this.api
      .post<any>(`/group/${gid}/student/add`, {
        studentUid: uid,
      })
      .pipe(
        tap({
          next: (response) => {
            this.getMemberInGroup(gid).subscribe();
            console.log('in Group service addStudentInGroup', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  deleteStudentInGroup(gid: number, uid: number) {
    return this.api.delete<any>(`/group/${gid}/student/${uid}`).pipe(
      tap({
        next: (response) => {
          this.getMemberInGroup(gid).subscribe();
          console.log('in Group service deleteStudentInGroup', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  addTeacherInGroup(gid: number, uid: number) {
    return this.api
      .post<any>(`/group/${gid}/teacher/add`, {
        teacherUid: uid,
      })
      .pipe(
        tap({
          next: (response) => {
            this.getMemberInGroup(gid).subscribe();
            console.log('in Group service addTeacherInGroup', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  deleteTeacherInGroup(gid: number, uid: number) {
    return this.api.delete<any>(`/group/${gid}/teacher/${uid}`).pipe(
      tap({
        next: (response) => {
          this.getMemberInGroup(gid).subscribe();
          console.log('in Group service deleteTeacherInGroup', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  autoGroup() {
    // "successList": [],
    // "failList": []
    return this.api.post<any>(`/group/random`, null).pipe(
      tap({
        next: (response) => {
          console.log('in Group service autoGroup', response);
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
