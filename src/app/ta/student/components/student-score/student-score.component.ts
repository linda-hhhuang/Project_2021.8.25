import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestService } from '@ta/student/services/request.service';
import { Student } from '@ta/model/member';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-student-score',
  templateUrl: './student-score.component.html',
  styleUrls: ['./student-score.component.css'],
})
export class StudentScoreComponent implements OnInit {
  isVisibleScore = false;
  isOkLoadingScore = false;

  currentStudentInfo!: Student;

  constructor(
    private requestrSrvc: RequestService,
    private message: NzMessageService
  ) {}

  init() {}
  ngOnInit(): void {
    this.requestrSrvc.getStudentInfo().subscribe((student) => {
      this.currentStudentInfo = student.body;
      console.log('in student-personal ngOnInit, data is ', student);
    });
  }

  //查看成绩
  showModalScore(): void {
    this.requestrSrvc.currentStudent$
      .pipe(filter((v) => v != null))
      .subscribe((v) => {
        console.log('in showModalScore', v);
        this.isVisibleScore = true;
        this.currentStudentInfo = v!;
      });
  }
  handleOkScore(): void {
    this.isVisibleScore = false;
  }

  ACK() {
    this.requestrSrvc.ACKScore2().subscribe((_) => {
      this.message.success('确认夏令营成绩成功！');
      this.isVisibleScore = false;
    });
  }
}
