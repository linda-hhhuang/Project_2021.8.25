import { Injectable, Optional, SkipSelf } from '@angular/core';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { Teacher, Student } from '@ta/model/member';
import { GroupMember } from '@ta/model/group';
import { StudentStatus } from '@ta/model/request';
@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private teacherList = new BehaviorSubject<Teacher[] | null>(null);
  teacherList$ = this.teacherList.asObservable();

  private studentList = new BehaviorSubject<Student[] | null>(null);
  studentList$ = this.studentList.asObservable();

  private teacher = new BehaviorSubject<Teacher | null>(null);
  teacher$ = this.teacher.asObservable();

  private student = new BehaviorSubject<Student | null>(null);
  student$ = this.student.asObservable();

  private teacherGroup = new BehaviorSubject<GroupMember | null>(null);
  teacherGroup$ = this.teacherGroup.asObservable();

  constructor(
    @SkipSelf()
    @Optional()
    memberSrvc: MemberService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (memberSrvc) {
      throw new Error(
        'You should not import MemberService which is already imported in root!'
      );
    }
  }

  //教务
  getTeacherList() {
    return this.api.get<any>('/member/teacher/list').pipe(
      tap({
        next: (response) => {
          this.teacherList.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }
  getTeacherInfo(uid: number) {
    return this.api.get<any>(`/member/teacher/${uid}`).pipe(
      tap({
        next: (response) => {
          this.teacher.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getStudentList() {
    return this.api.get<any>('/member/student/list').pipe(
      tap({
        next: (response) => {
          this.studentList.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteMember(uid: number) {
    return this.api.delete<any>(`/member/${uid}`).pipe(
      tap({
        next: (response) => {
          this.getTeacherList().subscribe();
          this.getStudentList().subscribe();
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  //操作

  autoPassByScore(threhold: number) {
    return this.api
      .post<any>(`/member/autopass`, {
        threhold: threhold,
      })
      .pipe(
        tap({
          next: (response) => {
            this.getStudentList().subscribe();
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  clearAllPass() {
    return this.api.post<any>(`/member/clearpass`, null).pipe(
      tap({
        next: (response) => {
          this.getStudentList().subscribe();
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  //教师
  GetTeacherGroup() {
    return this.api.get<any>(`/group/me`).pipe(
      tap({
        next: (response) => {
          this.teacherGroup.next(response.body);
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

  //多余
  operateStudent(uid: number, status: any) {
    return this.api.put<any>(`/member/student/${uid}`, status).pipe(
      tap({
        next: (response) => {
          this.getStudentList().subscribe();
          this.getStudentInfo(uid).subscribe();
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  //多余
  getStudentInfo(uid: number) {
    return this.api.get<any>(`/member/student/${uid}`).pipe(
      tap({
        next: (response) => {
          this.student.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }
}
