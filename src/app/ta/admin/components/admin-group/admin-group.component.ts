import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Teacher, Student } from '@ta/model/member';
import { MemberService } from '@ta/services/member.service';
import { GroupList, AutoGroupSuccessList } from '@ta/model/group';
import { GroupService } from '@ta/admin/services/group.service';
@Component({
  selector: 'app-admin-group',
  templateUrl: './admin-group.component.html',
  styleUrls: ['./admin-group.component.css'],
})
export class AdminGroupComponent implements OnInit {
  groupList: GroupList[] = [];
  currentDisplayGroupList: GroupList[] = [];

  studentList: Student[] = [];
  currentDisplayStudentList: Student[] = [];

  teacherList: Teacher[] = [];
  currentDisplayTeacherList: Teacher[] = [];

  autoGroupSuccessList: AutoGroupSuccessList[] = [];
  autoGroupFailList: AutoGroupSuccessList[] = [];

  Gid: number = -1;
  studentUid: number = -1;

  isVisibleStudent = false;
  isOkLoadingStudent = false;

  isVisibleDeleteAllGroup = false;
  isOkLoadingDeleteAllGroup = false;

  isVisibleAddStudent = false;
  isOkLoadingAddStudent = false;
  addStudentUid: number = -1;

  isVisibleAddTeacher = false;
  isOkLoadingAddTeacher = false;
  addTeacherUid: number = -1;

  isVisibleAutoGroup = false;

  isVisibleMember = false;

  searchGidValue = '';
  visibleSearchGid = false;

  status = [
    '等待教务审核',
    '材料已被审核,请等待结果',
    '材料已被审核,请等待结果',
    '本人已通过夏令营成绩审核',
  ];

  constructor(
    private memberSrvc: MemberService,
    private message: NzMessageService,
    private groupSrvc: GroupService
  ) {}

  ngOnInit() {
    this.groupSrvc.getGroupList().subscribe((v) => {
      this.groupList = v.body;
      this.currentDisplayGroupList = v.body;
    });
  }

  //查看成员
  showModalMember(e: GroupList) {
    console.log('in showModalMember ', e);
    this.groupSrvc.getMemberInGroup(e.gid).subscribe((v) => {
      this.isVisibleMember = true;
      this.teacherList = this.currentDisplayTeacherList = v.body.Teachers;
      this.studentList = this.currentDisplayStudentList = v.body.Students;
      this.Gid = v.body.gid;
    });
  }
  handleOkMember(): void {
    this.isVisibleMember = false;
  }

  //查看申请信息
  showModalStudent(e: Student) {
    console.log('in Student ', e);
    this.studentUid = e.uid;
    this.isVisibleStudent = true;
  }
  handleOkStudent(): void {
    this.isVisibleStudent = false;
  }

  //Delete
  showModalDeleteAllGroup(): void {
    this.isVisibleDeleteAllGroup = true;
  }
  handleOkDeleteAllGroup(): void {
    this.isOkLoadingDeleteAllGroup = true;
    this.memberSrvc.clearAllPass().subscribe((_) => {
      this.message.success('成功撤销所有学生的初试申请!');
      this.isOkLoadingDeleteAllGroup = false;
      this.isVisibleDeleteAllGroup = false;
    });
  }
  handleCancelDeleteAllGroup(): void {
    console.log('Button cancel clicked!');
    this.isOkLoadingDeleteAllGroup = false;
    this.isVisibleDeleteAllGroup = false;
  }

  //AddTeacher
  showModalAddTeacher(data: GroupList): void {
    this.isVisibleAddTeacher = true;
    this.Gid = data.gid;
  }
  handleOkAddTeacher(): void {
    this.isOkLoadingAddTeacher = true;
    this.groupSrvc
      .addTeacherInGroup(this.Gid, this.addTeacherUid)
      .subscribe((_) => {
        this.message.success('成功添加老师到此组中!');
        this.isOkLoadingAddTeacher = false;
        this.isVisibleAddTeacher = false;
      });
  }
  handleCancelAddTeacher(): void {
    console.log('Button cancel clicked!');
    this.isOkLoadingAddTeacher = false;
    this.isVisibleAddTeacher = false;
  }

  //AddStudent
  showModalAddStudent(data: GroupList): void {
    this.isVisibleAddStudent = true;
    this.Gid = data.gid;
  }
  handleOkAddStudent(): void {
    this.isOkLoadingAddStudent = true;
    this.groupSrvc
      .addStudentInGroup(this.Gid, this.addStudentUid)
      .subscribe((_) => {
        this.message.success('成功添加学生到此组中!');
        this.isOkLoadingAddStudent = false;
        this.isVisibleAddStudent = false;
      });
  }
  handleCancelAddStudent(): void {
    console.log('Button cancel clicked!');
    this.isOkLoadingAddStudent = false;
    this.isVisibleAddStudent = false;
  }

  resetGid(): void {
    this.searchGidValue = '';
    this.searchGid();
  }
  searchGid(): void {
    this.visibleSearchGid = false;
    this.currentDisplayGroupList = this.groupList!.filter(
      (item: GroupList) => String(item.gid).indexOf(this.searchGidValue) !== -1
    );
  }

  Cancel() {}

  createNewGroupConfirm() {
    this.groupSrvc.createGroup().subscribe((v) => {
      this.message.success(`成功创建一个新租,组号为${v.body.gid}`);
      this.ngOnInit();
    });
  }
  deleteGroupConfirm(v: GroupList) {
    this.groupSrvc.deleteGroup(v.gid).subscribe((_) => {
      this.message.success(`成功删除组 ${v.gid}`);
    });
  }

  AutoGroupConfirm() {
    this.groupSrvc.autoGroup().subscribe((v) => {
      this.autoGroupSuccessList = v.body.successList;
      this.autoGroupFailList = v.body.failList;
      this.isVisibleAutoGroup = true;
    });
  }
  handleOkAutoGroup(): void {
    this.isVisibleAutoGroup = true;
  }

  deleteTeacherFromGroup(data: Teacher) {
    this.groupSrvc
      .deleteTeacherInGroup(data.groupGid, data.uid)
      .subscribe((_) => {
        this.message.success(
          `成功把教师${data.name}从组 ${data.groupGid} 中删除`
        );
      });
  }

  deleteStudentFromGroup(data: Student) {
    this.groupSrvc
      .deleteStudentInGroup(data.groupGid, data.uid)
      .subscribe((_) => {
        this.message.success(
          `成功把学生${data.name}从组 ${data.groupGid} 中删除`
        );
      });
  }
}