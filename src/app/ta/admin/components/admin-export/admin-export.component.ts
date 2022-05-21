import { Component, OnInit } from '@angular/core';
import { MemberService } from '@ta/services/member.service';
import { Student } from '@ta/model/member';
@Component({
  selector: 'app-admin-export',
  templateUrl: './admin-export.component.html',
  styleUrls: ['./admin-export.component.css'],
})
export class AdminExportComponent implements OnInit {
  constructor(private memberSrvc: MemberService) {}
  isLoading = false;
  domain = window.location.hostname;
  ngOnInit(): void {
    this.domain = window.location.hostname;
  }

  exportCvs() {
    this.isLoading = true;
    let title = [
      '学工号',
      '姓名',
      '所属组别',
      '号码',
      '原始分',
      '最终分',
      '材料审核打分',
      '材料形式审查',
      '入营资格审查',
      '面试确认申请',
    ];
    let titleForKey = [
      'sid',
      'name',
      'groupGid',
      'randomId',
      'score1',
      'finalscore1',
      'allscore1',
      'status',
      'pass1',
      'confirm1',
    ];
    this.memberSrvc.getStudentList().subscribe((v) => {
      this.isLoading = false;
      let data = v.body
        // .filter((n: Student) => n.pass1 == true)
        .map((v: Student) => {
          return {
            sid: v.sid ? String(v.sid) : '无',
            name: v.name,
            groupGid: String(v.groupGid),
            randomId: String(v.randomId),
            score1: v.score1 == -1 ? '未打分' : String(v.score1),
            finalscore1: v.finalscore1 == -1 ? '未打分' : String(v.finalscore1),
            allscore1: String(v.allscore1),
            status: v.status ? '已审核' : '未审核',
            pass1: v.pass1 ? '已通过' : '审核中',
            confirm1:
              v.confirm1 == 1
                ? '已确认参加'
                : v.confirm1 == -1
                ? '已拒绝参加'
                : '待确认',
          };
        });
      let str = [];
      str.push(title.join(',') + '\n');
      for (let i = 0; i < data.length; i++) {
        let temp: any[] = [];
        for (let j = 0; j < titleForKey.length; j++) {
          // if (j == 0 || j == 2) temp.push('\t' + data[i][titleForKey[j]]);
          temp.push(data[i][titleForKey[j]]);
        }
        str.push(temp.join(',') + '\n');
      }
      let uri =
        'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str.join(''));
      let downloadLink = document.createElement('a');
      downloadLink.href = uri;
      downloadLink.download =
        new Date().toISOString().substring(0, 10) + '-夏令营活动报名结果.csv';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    });
  }
}
