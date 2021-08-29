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
  ngOnInit(): void {}

  exportCvs() {
    this.isLoading = true;
    let title = [
      '姓名',
      '账号',
      '组别',
      '初试分数',
      '是否已经通过初试',
      '夏令营成绩',
    ];
    let titleForKey = ['name', 'uid', 'groupGid', 'score1', 'pass1', 'score2'];
    this.memberSrvc.getStudentList().subscribe((v) => {
      this.isLoading = false;
      let data = v.body
        // .filter((n: Student) => n.pass1 == true)
        .map((v: Student) => {
          return {
            name: v.name,
            uid: v.uid,
            groupGid: v.groupGid,
            score1: v.score1 == -1 ? '无成绩' : v.score1,
            pass1: v.pass1 ? '是' : '否',
            score2: v.score2 == -1 ? '无成绩' : v.score2,
          };
        });
      let str = [];
      str.push(title.join(',') + '\n');
      for (let i = 0; i < data.length; i++) {
        let temp: any[] = [];
        for (let j = 0; j < titleForKey.length; j++) {
          if (j == 0 || j == 2) temp.push('\t' + data[i][titleForKey[j]]);
          else temp.push(data[i][titleForKey[j]]);
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
