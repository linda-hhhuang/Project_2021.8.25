import { Component, OnInit } from '@angular/core';
import { TimeService } from '@ta/services/time.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css'],
})
export class StudentHomeComponent implements OnInit {
  currentTimeFrom!: string;
  currentTimeTo!: string;
  currentsignEnd!: string;

  currentStatus: number = 0; //0-未开始,1-进行中,2-已结束
  status = ['未开始', '进行中', '已结束'];
  AntdStatus = function (v: number) {
    switch (v) {
      case 0:
        return 'warning';
      case 1:
        return 'success';
      case 2:
        return 'danger';
      default:
        return undefined;
    }
  };

  constructor(
    private timeSrvc: TimeService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.timeSrvc.currentTimeFrom$.subscribe((res) => {
      this.currentTimeFrom = this.timeSrvc.formatDateTime(new Date(res!));
    });
    this.timeSrvc.currentTimeTo$.subscribe((res) => {
      this.currentTimeTo = this.timeSrvc.formatDateTime(new Date(res!));
    });
    this.timeSrvc.currentsignEnd$.subscribe((res) => {
      this.currentsignEnd = this.timeSrvc.formatDateTime(new Date(res!));
    });
    this.timeSrvc.currentStatus$.subscribe((res) => {
      this.currentStatus = res;
    });
  }
}
