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

  isVisibleAutoGroupConfirm1 = false;
  isOkLoadingAutoGroupConfirm1 = false;

  isVisibleAutoGroupConfirm2 = false;
  isOkLoadingAutoGroupConfirm2 = false;

  autoGroupTPG = 1;
  autoGroupNum = 10000;

  autoGroupTPG2 = 1;
  autoGroupNum2 = 10000;

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
    '材料已被审核,请留意成绩',
    '材料已被审核,请留意成绩',
    '本人已确认夏令营面试成绩',
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
    this.groupSrvc.deleteAllGroup().subscribe((_) => {
      this.message.success('成功解散所有组!');
      this.isOkLoadingDeleteAllGroup = false;
      this.isVisibleDeleteAllGroup = false;
    });
  }
  handleCancelDeleteAllGroup(): void {
    this.isOkLoadingDeleteAllGroup = false;
    this.isVisibleDeleteAllGroup = false;
  }

  //autogroupconfirm
  showModalAutoGroupConfirm1(): void {
    this.isVisibleAutoGroupConfirm1 = true;
  }
  handleOkAutoGroupConfirm1(): void {
    this.isOkLoadingAutoGroupConfirm1 = true;
    this.groupSrvc
      .autoGroup(this.autoGroupTPG, this.autoGroupNum)
      .subscribe((v) => {
        this.autoGroupSuccessList = v.body.successList;
        this.autoGroupFailList = v.body.failList;
        this.isVisibleAutoGroup = true;
        this.isVisibleAutoGroupConfirm1 = false;
        this.isOkLoadingAutoGroupConfirm1 = false;

        this.autoGroupTPG = 0;
      });
  }
  handleCancelAutoGroupConfirm1(): void {
    this.isOkLoadingAutoGroupConfirm1 = false;
    this.isVisibleAutoGroupConfirm1 = false;
  }

  //autogroupconfirm
  showModalAutoGroupConfirm2(): void {
    this.isVisibleAutoGroupConfirm2 = true;
  }
  handleOkAutoGroupConfirm2(): void {
    this.isOkLoadingAutoGroupConfirm2 = true;
    this.groupSrvc
      .autoGroup2(this.autoGroupTPG2, this.autoGroupNum2)
      .subscribe((v) => {
        this.autoGroupSuccessList = v.body.successList;
        this.autoGroupFailList = v.body.failList;
        this.isVisibleAutoGroup = true;
        this.isVisibleAutoGroupConfirm2 = false;
        this.isOkLoadingAutoGroupConfirm2 = false;

        this.autoGroupTPG2 = 0;
      });
  }
  handleCancelAutoGroupConfirm2(): void {
    this.isOkLoadingAutoGroupConfirm2 = false;
    this.isVisibleAutoGroupConfirm2 = false;
  }
  LockConfirm() {
    this.groupSrvc.LockConfirm().subscribe((_) => {
      this.message.success('成功锁住最终成绩!');
    });
  }
  UnLockConfirm() {
    this.groupSrvc.UnLockConfirm().subscribe((_) => {
      this.message.success('成功解锁最终成绩!');
    });
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
      this.message.success(`成功创建一个新组,组号为${v.body.gid}`);
      this.ngOnInit();
    });
  }
  deleteGroupConfirm(v: GroupList) {
    this.groupSrvc.deleteGroup(v.gid).subscribe((_) => {
      this.message.success(`成功删除组 ${v.gid}`);
      this.ngOnInit();
    });
  }

  handleOkAutoGroup(): void {
    this.isVisibleAutoGroup = false;
  }

  deleteTeacherFromGroup(data: Teacher) {
    this.groupSrvc
      .deleteTeacherInGroup(data.groupGid, data.uid)
      .subscribe((_) => {
        this.message.success(
          `成功把教师${data.name}从组 ${data.groupGid} 中删除`
        );
        this.ngOnInit();
        this.isVisibleMember = false;
      });
  }

  deleteStudentFromGroup(data: Student) {
    this.groupSrvc
      .deleteStudentInGroup(data.groupGid, data.uid)
      .subscribe((_) => {
        this.message.success(
          `成功把学生${data.name}从组 ${data.groupGid} 中删除`
        );
        this.ngOnInit();
        this.isVisibleMember = false;
      });
  }
}
