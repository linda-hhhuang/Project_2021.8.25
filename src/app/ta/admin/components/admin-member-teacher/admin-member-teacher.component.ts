import { Component, OnInit } from '@angular/core';
import { MemberService } from '@ta/services/member.service';
import { Teacher } from '@ta/model/member';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-admin-member-teacher',
  templateUrl: './admin-member-teacher.component.html',
  styleUrls: ['./admin-member-teacher.component.css'],
})
export class AdminMemberTeacherComponent implements OnInit {
  teacherList: Teacher[] | null = [];
  currentDisplayUserList!: Teacher[] | null;

  currentSelectedUser!: Teacher;

  isVisibleShowInfo = false;
  isOkLoadingShowInfo = false;

  importSid = 0;
  importPhone = '';

  isVisibleImport = false;
  isOkLoadingImport = false;

  isVisibleResetInfo = false;
  isOkLoadingResetInfo = false;

  searchNameValue = '';
  visibleSearchName = false;

  searchSidValue = '';
  visibleSearchSid = false;

  constructor(
    private memberSrvc: MemberService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.memberSrvc.getTeacherList().subscribe((v) => {
      this.currentDisplayUserList = v.body;
      this.teacherList = v.body;
    });
  }

  showModalShowInfo(e: any) {
    this.memberSrvc.getTeacherInfo(e.uid).subscribe((v) => {
      this.currentSelectedUser = v.body;
      this.isVisibleShowInfo = true;
    });
  }
  handleOkShowInfo(): void {
    this.isVisibleShowInfo = false;
  }

  showModalImport() {
    this.isVisibleImport = true;
  }
  handleOkImport(): void {
    this.isOkLoadingImport = true;

    this.memberSrvc
      .importTeacher(this.importSid, this.importPhone)
      .subscribe((response) => {
        this.message.success(response.msg);
        this.isOkLoadingImport = false;
        this.isVisibleImport = false;
      });
    this.importSid = 0;
    this.importPhone = '';
  }
  handleCancelImport(): void {
    this.importSid = 0;
    this.importPhone = '';
    this.isVisibleImport = false;
  }
  resetName(): void {
    this.searchNameValue = '';
    this.searchName();
  }
  searchName(): void {
    this.visibleSearchName = false;
    this.currentDisplayUserList = this.teacherList!.filter(
      (item: Teacher) => item.name!.indexOf(this.searchNameValue) !== -1
    );
  }

  resetSid(): void {
    this.searchSidValue = '';
    this.searchSid();
  }
  searchSid(): void {
    this.visibleSearchSid = false;
    this.currentDisplayUserList = this.teacherList!.filter(
      (item: Teacher) => String(item.uid).indexOf(this.searchSidValue) !== -1
    );
  }

  deleteConfirm(user: Teacher) {
    this.memberSrvc.deleteMember(user.uid).subscribe((_) => {
      this.message.success('删除教师成功!');
      this.ngOnInit();
    });
  }

  deleteCancel() {}
}
