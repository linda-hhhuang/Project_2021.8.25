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

  operateStudent(uid: number, status: any) {
    return this.api.put<any>(`/member/student/${uid}`, status).pipe(
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

  getUploadFile(uid: number, fid: string) {
    window.location.href = `/api/filer/${uid}/files/${fid}`;
  }

  private handleError(error: string) {
    this.notify.error('错误', error);
    if (error == '未登录') {
      location.reload();
    }
  }
}
