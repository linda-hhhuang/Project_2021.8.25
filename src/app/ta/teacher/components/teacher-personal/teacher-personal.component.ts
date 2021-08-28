import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MemberService } from '@ta/services/member.service';
import { Teacher } from '@ta/model/member';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'app-teacher-personal',
  templateUrl: './teacher-personal.component.html',
  styleUrls: ['./teacher-personal.component.css'],
})
export class TeacherPersonalComponent implements OnInit {
  // isVisibleUpdateInfo = false;
  // isOkLoadingUpdateInfo = false;

  // currentTeacherInfo!: Teacher;

  constructor() // private memberSrvc: MemberService,
  // private message: NzMessageService
  {}

  // init() {
  //   this.memberSrvc.getTeacherInfo().subscribe((student) => {
  //     this.currentTeacherInfo = student.body;
  //     console.log('in student-personal ngOnInit, data is ', student);
  //   });
  // }
  ngOnInit(): void {
    // this.init();
  }

  // //修改个人信息
  // showModalUpdateInfo(): void {
  //   this.memberSrvc.currentTeacher$
  //     .pipe(filter((v) => v != null))
  //     .subscribe((v) => {
  //       console.log('in showModalUpdateInfo', v);
  //       this.isVisibleUpdateInfo = true;
  //       this.currentTeacherInfo = v!;
  //     });
  // }
  // handleOkUpdateInfo(): void {
  //   this.isOkLoadingUpdateInfo = true;
  //   console.log('in handleOkUpdateInfo, data is ', this.currentTeacherInfo);
  //   this.memberSrvc
  //     .updateTeacherInfo(this.currentTeacherInfo)
  //     .subscribe((response) => {
  //       this.isOkLoadingUpdateInfo = false;
  //       this.message.success(response.msg);
  //       this.isVisibleUpdateInfo = false;
  //     });
  // }
  // handleCancelUpdateInfo(): void {
  //   console.log('Button cancel clicked!');
  //   this.isVisibleUpdateInfo = false;
  // }
}
