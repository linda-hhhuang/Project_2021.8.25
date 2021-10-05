import { Component, OnInit } from '@angular/core';
import { MemberService } from '@ta/services/member.service';
import { Student } from '@ta/model/member';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-admin-member-student',
  templateUrl: './admin-member-student.component.html',
  styleUrls: ['./admin-member-student.component.css'],
})
export class AdminMemberStudentComponent implements OnInit {
  studentList: Student[] | null = [];
  currentDisplayUserList!: Student[] | null;

  currentSelectedUser!: Student;

  studentUid: number = -1;

  passScore: number = 100;

  isVisibleStudent = false;
  isOkLoadingStudent = false;

  isVisiblePass = false;
  isOkLoadingPass = false;

  isVisibleDelete = false;
  isOkLoadingDelete = false;

  searchNameValue = '';
  visibleSearchName = false;

  searchSidValue = '';
  visibleSearchSid = false;

  constructor(
    private memberSrvc: MemberService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.memberSrvc.getStudentList().subscribe((v) => {
      this.currentDisplayUserList = v.body;
      this.studentList = v.body;
    });
  }

  showModalStudent(e: any) {
    this.studentUid = e.uid;
    this.isVisibleStudent = true;
  }
  handleOkStudent(): void {
    this.isVisibleStudent = false;
    this.ngOnInit();
  }

  resetName(): void {
    this.searchNameValue = '';
    this.searchName();
  }
  searchName(): void {
    this.visibleSearchName = false;
    this.currentDisplayUserList = this.studentList!.filter(
      (item: Student) => item.name!.indexOf(this.searchNameValue) !== -1
    );
  }

  resetSid(): void {
    this.searchSidValue = '';
    this.searchSid();
  }
  searchSid(): void {
    this.visibleSearchSid = false;
    this.currentDisplayUserList = this.studentList!.filter(
      (item: Student) => String(item.uid).indexOf(this.searchSidValue) !== -1
    );
  }

  deleteConfirm(user: Student) {
    this.memberSrvc.deleteMember(user.uid).subscribe((_) => {
      this.message.success('删除学生成功!');
      this.ngOnInit();
    });
  }

  passConfirm(user: Student) {
    this.memberSrvc
      .operateStudent(user.uid, {
        pass1: true,
      })
      .subscribe((_) => {
        this.message.success('成功通过学生初试申请!');
        this.ngOnInit();
      });
  }

  //Pass
  showModalPass(): void {
    this.isVisiblePass = true;
    this.passScore = 100;
  }
  handleOkPass(): void {
    this.isOkLoadingPass = true;
    this.memberSrvc.autoPassByScore(this.passScore).subscribe((_) => {
      this.message.success(
        `成功通过所有初试分数大于${this.passScore}的学生的初试申请!`
      );
      this.isOkLoadingPass = false;
      this.isVisiblePass = false;
      this.ngOnInit();
    });
  }
  handleCancelPass(): void {
    this.isOkLoadingPass = false;
    this.isVisiblePass = false;
  }

  //Delete
  showModalDelete(): void {
    this.isVisibleDelete = true;
  }
  handleOkDelete(): void {
    this.isOkLoadingDelete = true;
    this.memberSrvc.clearAllPass().subscribe((_) => {
      this.message.success('成功撤销所有学生的初试申请!');
      this.isOkLoadingDelete = false;
      this.isVisibleDelete = false;
      this.ngOnInit();
    });
  }
  handleCancelDelete(): void {
    this.isOkLoadingDelete = false;
    this.isVisibleDelete = false;
  }

  Cancel() {}
}
