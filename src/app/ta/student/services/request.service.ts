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
        uid: update.SignupTemplate.uid,
        name: update.SignupTemplate.name,
        sex: update.SignupTemplate.sex,
        birth: update.SignupTemplate.birth,
        nation: update.SignupTemplate.nation,
        politic: update.SignupTemplate.politic,
        sid: update.SignupTemplate.sid,
        birthPlace: update.SignupTemplate.birthPlace,
        id: update.SignupTemplate.id,
        university: update.SignupTemplate.university,
        department: update.SignupTemplate.department,

        major: update.SignupTemplate.major,
        enrollmentTime: update.SignupTemplate.enrollmentTime,
        phone: update.SignupTemplate.phone,
        email: update.SignupTemplate.email,
        qq: update.SignupTemplate.qq,
        address: update.SignupTemplate.address,
        emergencyPhone: update.SignupTemplate.emergencyPhone,
        examFree: update.SignupTemplate.examFree,
        description: update.SignupTemplate.description,
        reward: update.SignupTemplate.reward,
        achievements: update.SignupTemplate.achievements,

        photo: update.SignupTemplate.photo,
        sign: update.SignupTemplate.sign,
        tutor: update.SignupTemplate.tutor,
        date: update.SignupTemplate.date,

        scoreDate: update.SignupTemplate.scoreDate,
        getScore: update.SignupTemplate.getScore,
        maxScore: update.SignupTemplate.maxScore,
        getRank: update.SignupTemplate.getRank,
        maxRank: update.SignupTemplate.maxRank,
        cet4Score: update.SignupTemplate.cet4Score,
        cet6Score: update.SignupTemplate.cet6Score,
        otherEnglishScore: update.SignupTemplate.otherEnglishScore,

        volunteer1: update.SignupTemplate.volunteer1,
        volunteer2: update.SignupTemplate.volunteer2,
      })
      .pipe(
        tap({
          next: (response) => {
            this.currentStudent.next(response.body);
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
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  studentdownloadUpload(fid: string, attach: string) {
    window.open(`/fushi/api/filer/me/files/${fid}` + attach);
  }

  ACKScore2() {
    return this.api.post<any>('/member/doublecheck', null).pipe(
      tap({
        next: (response) => {
          this.getStudentInfo().subscribe();
        },
        error: (err) => {
          this.handleError(err.error.msg);
        },
      })
    );
  }

  confirmAttend(n: number) {
    return this.api.post<any>('/member/confirm', { confirm: n }).pipe(
      tap({
        next: (response) => {
          this.getStudentInfo().subscribe();
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
