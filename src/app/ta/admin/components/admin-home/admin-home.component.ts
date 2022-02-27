import { Component, OnInit } from '@angular/core';
import { TimeService } from '@ta/services/time.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  date!: Date[];
  signdate!: Date;
  setTimeFrom!: number;
  setTimeTo!: number;
  setTimeSign!: number;
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
  isVisibleSetTime = false;
  isOkLoadingSetTime = false;

  constructor(
    private timeSrvc: TimeService,
    private message: NzMessageService
  ) {}

  onSetTimeChange(result: Date[]): void {
    this.setTimeFrom = this.date[0].getTime();
    this.setTimeTo = this.date[1].getTime();
  }
  onSetSignChange(result: Date[]): void {
    this.setTimeSign = this.signdate.getTime();
  }

  init() {
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
  ngOnInit(): void {
    this.init();
  }

  showModalSetTime() {
    this.isVisibleSetTime = true;
  }

  handleOkSetTime(): void {
    this.isOkLoadingSetTime = true;
    this.timeSrvc
      .setTime(this.setTimeFrom, this.setTimeTo, this.setTimeSign)
      .subscribe((res) => {
        this.message.success('时间修改成功!');
        this.isOkLoadingSetTime = false;
        this.isVisibleSetTime = false;
        this.init();
      });
  }

  handleCancelSetTime(): void {
    this.isVisibleSetTime = false;
  }
}
