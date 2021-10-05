import { Component, OnInit, Input } from '@angular/core';
import { StudentOperationService } from '@ta/services/student-operation.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileList } from '@ta/model/request';
import { Student } from '@ta/model/member';
import { StudentStatus } from '@ta/model/request';

@Component({
  selector: 'app-student-operation',
  templateUrl: './student-operation.component.html',
  styleUrls: ['./student-operation.component.css'],
})
export class StudentOperationComponent implements OnInit {
  @Input() studentUid: number = -1;
  currentStudentInfo: Student = {
    uid: 0,
    name: '',
    score1: 0,
    pass1: false,
    score2: 0,
    status: 0,
    groupGid: 0,
    sign: '',
    SignupTemplate: {
      uid: 0,
      name: '',
      sex: '',
      birth: '',
      nation: '',
      politic: '',
      sid: '',
      birthPlace: '',
      id: '',
      university: '',
      department: '',
      major: '',
      enrollmentTime: '',
      phone: '',
      email: '',
      address: '',
      emergencyPhone: '',
      examFree: null,
      description: '',
      reward: '',
      achievements: '',
      score: '',
      englishScore: '',
      photo: '',
      sign: '',
      date: '',
    },
  };
  fileList: FileList[] = [];

  score1: number = -1;
  score2: number = -1;

  isVisibleScore1 = false;
  isOkLoadingScore1 = false;

  isVisibleScore2 = false;
  isOkLoadingScore2 = false;

  status = [
    '等待教务审核',
    '材料已被审核,请等待结果',
    '材料已被审核,请等待结果',
    '本人已通过夏令营成绩审核',
  ];

  constructor(
    private optSrvc: StudentOperationService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.score1 = -1;
    this.score2 = -1;
    this.optSrvc.getStudentInfo(this.studentUid).subscribe((student) => {
      this.currentStudentInfo = student.body;
      this.score1 = this.currentStudentInfo.score1;
      this.score2 = this.currentStudentInfo.score2;
    });
    this.optSrvc.getUploadList(this.studentUid).subscribe((file) => {
      this.fileList = file.body;
    });
  }

  statusPass() {
    this.optSrvc
      .operateStudent(this.studentUid, {
        status: 1,
      })
      .subscribe((v) => {
        this.ngOnInit();
        this.message.success('成功通过此学生材料审核！');
      });
  }

  getUploadFile(data: FileList) {
    this.optSrvc.getUploadFile(data.studentUid, data.fid);
  }

  showModalScore1(): void {
    this.isVisibleScore1 = true;
    this.score1 = this.currentStudentInfo.score1;
  }
  handleOkScore1(): void {
    this.isOkLoadingScore1 = true;
    this.optSrvc
      .operateStudent(this.studentUid, {
        score1: this.score1,
      })
      .subscribe((v) => {
        this.ngOnInit();
        this.isVisibleScore1 = false;
        this.isOkLoadingScore1 = false;
        this.message.success('成功修改初试分数！');
      });
  }
  handleCancelScore1(): void {
    this.isOkLoadingScore1 = false;
    this.isVisibleScore1 = false;
  }

  showModalScore2(): void {
    this.isVisibleScore2 = true;
    this.score2 = this.currentStudentInfo.score2;
  }
  handleOkScore2(): void {
    this.isOkLoadingScore2 = true;
    this.optSrvc
      .operateStudent(this.studentUid, {
        score2: this.score2,
      })
      .subscribe((v) => {
        this.ngOnInit();
        this.isVisibleScore2 = false;
        this.isOkLoadingScore2 = false;
        this.message.success(v.body.msg);
      });
  }
  handleCancelScore2(): void {
    this.isOkLoadingScore2 = false;
    this.isVisibleScore2 = false;
  }

  examFreestatus(v: any) {
    if (v === null) return '暂未确定';
    else if (v === true) return '是';
    else if (v === false) return '否';
    else return undefined;
  }

  formatDateTime(dateString: string) {
    const date = new Date(dateString);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let mm = m < 10 ? '0' + m : m;
    let d = date.getDate();
    let dd = d < 10 ? '0' + d : d;
    let h = date.getHours();
    let hh = h < 10 ? '0' + h : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let minuteS = minute < 10 ? '0' + minute : minute;
    let secondS = second < 10 ? '0' + second : second;
    return y + '-' + mm + '-' + dd + ' ' + hh + ':' + minuteS + ':' + secondS;
  }
}
