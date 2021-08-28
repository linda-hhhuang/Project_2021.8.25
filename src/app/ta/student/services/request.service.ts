import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ApiService } from '@core/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FileList } from '@ta/model/request';
import { Student } from '@ta/model/member';
@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private fileList = new BehaviorSubject<FileList[] | null>(null);
  fileList$ = this.fileList.asObservable();

  private currentStudent = new BehaviorSubject<Student | null>(null);
  currentStudent$ = this.currentStudent.asObservable();

  constructor(
    @SkipSelf()
    @Optional()
    requestSrvc: RequestService,
    private api: ApiService,
    private notify: NzNotificationService
  ) {
    if (requestSrvc) {
      throw new Error(
        'You should not import requestSrvc which is already imported in root!'
      );
    }
  }

  //学生端
  getStudentInfo() {
    return this.api.get<any>('/member/student/me').pipe(
      tap({
        next: (response) => {
          console.log('in request service getStudentInfo', response);
          this.currentStudent.next(response.body);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  updateStudentInfo(update: Student) {
    return this.api
      .put<any>('signup/me', {
        name: update.name,
        sex: update.sex,
        birth: update.birth,
        nation: update.nation,
        politic: update.politic,
        id: update.id,
        sid: update.sid,
        university: update.university,
        department: update.department,
        major: update.major,
        enrollmentTime: update.enrollmentTime,
        phone: update.phone,
        email: update.email,
        address: update.address,
        emergencyPhone: update.emergencyPhone,
        examFree: update.examFree,
        description: update.description,
        reward: update.reward,
        achievements: update.achievements,
        score: update.score,
        englishScore: update.englishScore,
      })
      .pipe(
        tap({
          next: (response) => {
            this.currentStudent.next(response.body);
            console.log('in request service updateStudentInfo ok', response);
          },
          error: (err) => {
            this.handleError(err.error.msg);
          },
        })
      );
  }

  uploadFile(data: FormData) {
    return this.api.post<any>('/filer/me/files', data).pipe(
      tap({
        next: (response) => {
          this.getUploadFileList().subscribe();
          console.log('in request service updateStudentInfo ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  getUploadFileList() {
    return this.api.get<any>('filer/me/files').pipe(
      tap({
        next: (response) => {
          this.fileList.next(response.body);
          console.log('in request service getUploadFileList ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  deleteUpload(fid: string) {
    return this.api.delete<any>(`/filer/me/files/${fid}`).pipe(
      tap({
        next: (response) => {
          this.getUploadFileList().subscribe();
          console.log('in request service deleteUpload ok', response);
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  studentdownloadUpload(fid: string) {
    window.location.href = `/api/filer/me/files/${fid}`;
  }

  ACKScore2() {
    return this.api.post<any>('/member/doublecheck', null).pipe(
      tap({
        next: (response) => {
          this.getStudentInfo().subscribe();
          console.log('in request service updateStudentInfo ok', response);
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
