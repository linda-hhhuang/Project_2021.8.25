import { Component, OnInit, Input } from '@angular/core';
import { StudentOperationService } from '@ta/services/student-operation.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileList } from '@ta/model/request';
import { Student } from '@ta/model/member';
import { StudentStatus } from '@ta/model/request';
import { UserService } from '@core/service/user.service';
import { take, takeUntil, skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-student-operation',
  templateUrl: './student-operation.component.html',
  styleUrls: ['./student-operation.component.css'],
})
export class StudentOperationComponent implements OnInit {
  @Input() studentUid: number = -1;
  currentStudentInfo: Student = {
    uid: 0,
    sid: 0,
    name: '',
    score1: 0,
    finalscore1: 0,
    allscore1: [],
    pass1: false,
    confirm1: 0,
    score2: 0,
    status: 0,
    randomId: 0,
    groupGid: 0,
    sign: '',
    SignupTemplate: {
      uid: 0,
      name: '', // 姓名
      sex: '', // 性别
      birth: '', // 出生年月
      nation: '', // 民族
      politic: '', // 政治面貌
      sid: '', // 学号
      birthPlace: '', // 籍贯
      id: '', // 身份证号码
      university: '', // 本科院校
      department: '', // 本科院系

      major: '', // 本科专业
      enrollmentTime: '', // 入学时间
      phone: '', // 电话
      email: '', // 邮箱
      qq: '', // 邮箱
      address: '', // 家庭住址
      emergencyPhone: '', // 紧急电话
      examFree: null, // 是否获取免试生资格（null为未确定）
      description: '', // 300字以内个人介绍
      reward: '', // 奖励与荣誉
      achievements: '', // 已取得的科研成果

      photo: '', // 证件照片
      sign: '', // 签名
      tutor: '',
      date: '', // 日期

      scoreDate: '',
      getScore: '',
      maxScore: '',
      getRank: 0,
      maxRank: 0,
      cet4Score: '',
      cet6Score: '',
      otherEnglishScore: '',

      volunteer1: 0,
      volunteer2: 0,
    },
  };
  fileList: FileList[] = [];

  score1: number = -1;
  score2: number = -1;

  isVisibleScore1 = false;
  isOkLoadingScore1 = false;

  isVisibleScore2 = false;
  isOkLoadingScore2 = false;

  currentScore1Flag = true;

  status = [
    '等待教务审核',
    '材料已被审核',
    '材料已被审核',
    '本人已确认夏令营面试成绩',
  ];

  constructor(
    private optSrvc: StudentOperationService,
    private message: NzMessageService,
    private userSrvc: UserService
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
    this.userSrvc.memberRole$
      .pipe(
        skipWhile((v) => v == -1),
        take(1)
      )
      .subscribe((role) => {
        if (role == 0 || role == 1) {
          this.currentScore1Flag = false;
        } else if (role == 2) {
          this.currentScore1Flag = true;
        }
      });
  }

  statusPass() {
    this.optSrvc
      .operateStudent(this.studentUid, { status: 1 })
      .subscribe((v) => {
        this.ngOnInit();
        this.message.success('成功通过此学生材料形式审查！');
      });
  }
  setPass1() {
    this.optSrvc
      .operateStudent(this.studentUid, { pass1: true })
      .subscribe((v) => {
        this.ngOnInit();
        this.message.success('成功通过此学生入营资格审查！');
      });
  }
  unsetPass1() {
    this.optSrvc
      .operateStudent(this.studentUid, { pass1: false })
      .subscribe((v) => {
        this.ngOnInit();
        this.message.success('成功取消此学生入营资格审查！');
      });
  }
  setConfirm1() {
    this.optSrvc
      .operateStudent(this.studentUid, { confirm1: 1 })
      .subscribe((v) => {
        this.ngOnInit();
        this.message.success('成功修改此学生面试确认申请为同意！');
      });
  }
  unsetConfirm1() {
    this.optSrvc
      .operateStudent(this.studentUid, { confirm1: -1 })
      .subscribe((v) => {
        this.ngOnInit();
        this.message.success('成功修改此学生面试确认申请为拒绝！');
      });
  }

  Cancel() {}

  showModalScore1(): void {
    this.isVisibleScore1 = true;
    this.score1 = this.currentStudentInfo.score1;
  }
  handleOkScore1(): void {
    this.isOkLoadingScore1 = true;
    this.optSrvc
      .operateStudentScore1(this.studentUid, this.score1)
      .subscribe((v) => {
        this.ngOnInit();
        this.isVisibleScore1 = false;
        this.isOkLoadingScore1 = false;
        this.message.success('成功修改材料审核分数！');
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
      .operateStudentScore2(this.studentUid, this.score2)
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

  volunteerStatus(v: any) {
    if (v === null) return '暂未确定';
    else if (v === 1) return '学术型硕士(计算数学方向)';
    else if (v === 2) return '学术型硕士(计算机科学与技术方向)';
    else if (v === 3) return '专业性硕士（电子信息）';
    else if (v === 4) return '直博（计算数学方向）';
    else if (v === 5) return '直博（计算机科学与技术方向）';
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

  downloadUpload(data: FileList, flag: number) {
    if (flag === 0) {
      this.optSrvc.getUploadFile(data.studentUid, data.fid, '?preview=true');
    } else if (flag === 1) {
      this.optSrvc.getUploadFile(data.studentUid, data.fid, '');
    }
  }
}
