import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Teacher, Student } from '@ta/model/member';
import { MemberService } from '@ta/services/member.service';

@Component({
  selector: 'app-teacher-apply',
  templateUrl: './teacher-apply.component.html',
  styleUrls: ['./teacher-apply.component.css'],
})
export class TeacherApplyComponent implements OnInit {
  studentList: Student[] = [];
  currentDisplayStudentList: Student[] = [];

  teacherList: Teacher[] = [];
  currentDisplayTeacherList: Teacher[] = [];

  Gid: number = -1;
  studentUid: number = -1;

  isVisibleStudent = false;
  isOkLoadingStudent = false;

  status = [
    '等待教务审核',
    '材料已被审核,请等待结果',
    '材料已被审核,请等待结果',
    '本人已通过夏令营成绩审核',
  ];

  constructor(
    private memberSrvc: MemberService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.memberSrvc.GetTeacherGroup().subscribe((v) => {
      this.studentList = v.body.Students;
      this.currentDisplayStudentList = v.body.Students;
      this.teacherList = v.body.Teacher;
      this.currentDisplayTeacherList = v.body.Teachers;
      this.Gid = v.body.gid;
    });
  }

  //查看申请信息
  showModalStudent(e: Student) {
    this.studentUid = e.uid;
    this.isVisibleStudent = true;
  }
  handleOkStudent(): void {
    this.ngOnInit();
    this.isVisibleStudent = false;
  }
}
