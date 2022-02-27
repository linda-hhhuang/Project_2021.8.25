import { Component, OnInit } from '@angular/core';
import { TimeService } from '@ta/services/time.service';

@Component({
  selector: 'app-teacher-home',
  templateUrl: './teacher-home.component.html',
  styleUrls: ['./teacher-home.component.css'],
})
export class TeacherHomeComponent implements OnInit {
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

  constructor(private timeSrvc: TimeService) {}

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
