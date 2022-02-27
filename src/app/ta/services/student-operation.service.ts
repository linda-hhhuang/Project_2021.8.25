import { Injectable, Optional, SkipSelf } from '@angular/core';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { MemberService } from '@ta/services/member.service';
import { Teacher, Student } from '@ta/model/member';
import { StudentStatus, FileList } from '@ta/model/request';

@Injectable({
  providedIn: 'root',
})
export class StudentOperationService {
  private fileList = new BehaviorSubject<FileList[] | null>(null);
  fileList$ = this.fileList.asObservable();

  constructor(
    @SkipSelf()
    @Optional()
    operationSrvc: StudentOperationService,
    private api: ApiService,
    private notify: NzNotificationService,
    private memberSrvc: MemberService
  ) {
    if (operationSrvc) {
      throw new Error(
        'You should not import StudentOperationService which is already imported in root!'
      );
    }
  }

  getStudentInfo(uid: number) {
    return this.api.get<any>(`/member/student/${uid}`).pipe(
      tap({
        next: (response) => {},
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  operateStudent(uid: number, studentInfo: Partial<Student>) {
    return this.api.put<any>(`/member/student/${uid}`, studentInfo).pipe(
      tap({
        next: (response) => {
          this.getStudentInfo(uid).subscribe();
          // this.memberSrvc.getStudentList().subscribe();
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  operateStudentScore1(uid: number, score1: number) {
    return this.api
      .put<any>(`/member/student/${uid}/score1`, {
        score: score1,
      })
      .pipe(
        tap({
          next: (response) => {
            this.getStudentInfo(uid).subscribe();
            // this.memberSrvc.getStudentList().subscribe();
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  operateStudentScore2(uid: number, score2: number) {
    return this.api
      .put<any>(`/member/student/${uid}/score2`, {
        score: score2,
      })
      .pipe(
        tap({
          next: (response) => {
            this.getStudentInfo(uid).subscribe();
            // this.memberSrvc.getStudentList().subscribe();
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  getUploadList(uid: number) {
    return this.api.get<any>(`/filer/${uid}/files`).pipe(
      tap({
        next: (response) => {
          this.fileList.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getUploadFile(sid: number, fid: string, attach: string) {
    window.open(`/api/filer/${sid}/files/${fid}` + attach);
  }

  private handleError(error: string) {
    this.notify.error('错误', error);
    if (error == '未登录') {
      location.reload();
    }
  }
}
