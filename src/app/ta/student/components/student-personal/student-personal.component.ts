import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Student } from '@ta/model/member';
import { filter, map } from 'rxjs/operators';
import { RequestService } from '@ta/student/services/request.service';
import { FileList } from '@ta/model/request';

@Component({
  selector: 'app-student-personal',
  templateUrl: './student-personal.component.html',
  styleUrls: ['./student-personal.component.css'],
})
export class StudentPersonalComponent implements OnInit {
  isVisibleUpdateInfo = false;
  isOkLoadingUpdateInfo = false;

  isVisibleUpload = false;
  isOkLoadingUpload = false;

  currentStudentInfo!: Student;

  fileList: NzUploadFile[] = [];
  displayFileList: FileList[] = [];

  uploading = false; // 初始值

  currentStatus: number = 0;
  status = [
    '等待教务审核',
    '材料已被审核,请等待结果',
    '材料已被审核,请等待结果',
    '本人已通过夏令营成绩审核',
  ];
  AntdStatus = function (v: number) {
    switch (v) {
      case 0:
        return 'warning';
      case 1:
        return 'success';
      case 2:
        return 'success';
      case 3:
        return 'success';
      default:
        return undefined;
    }
  };

  constructor(
    private requestrSrvc: RequestService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.requestrSrvc.getStudentInfo().subscribe((student) => {
      this.currentStudentInfo = student.body;
      console.log('in student-personal ngOnInit, data is ', student);
    });
    this.requestrSrvc.getUploadFileList().subscribe((v) => {
      console.log('in student-personal ngOnInit, data is ', v);
      this.displayFileList = v.body;
    });
  }

  //报名表
  showModalUpdateInfo(): void {
    this.requestrSrvc.currentStudent$
      .pipe(filter((v) => v != null))
      .subscribe((v) => {
        console.log('in showModalUpdateInfo', v);
        this.isVisibleUpdateInfo = true;
        this.currentStudentInfo = v!;
      });
  }
  handleOkUpdateInfo(): void {
    this.isOkLoadingUpdateInfo = true;
    console.log('in handleOkUpdateInfo, data is ', this.currentStudentInfo);
    if (this.currentStudentInfo.SignupTemplate.description.length > 300) {
      this.message.error('申请人个人陈述字数不能超过300个字!');
      this.isOkLoadingUpdateInfo = false;
      return;
    }
    if (this.currentStudentInfo.SignupTemplate.achievements.length > 300) {
      this.message.error('科研成果描述字数不能超过300个字!');
      this.isOkLoadingUpdateInfo = false;
      return;
    }
    this.requestrSrvc
      .updateStudentInfo(this.currentStudentInfo)
      .subscribe((response) => {
        this.message.success(response.msg);
        this.isOkLoadingUpdateInfo = false;
        this.isVisibleUpdateInfo = false;
      });
  }
  handleCancelUpdateInfo(): void {
    console.log('Button cancel clicked!');
    this.isOkLoadingUpdateInfo = false;
    this.isVisibleUpdateInfo = false;
  }

  //文件
  showModalUpload(): void {
    this.requestrSrvc.fileList$
      .pipe(filter((v) => v != null))
      .subscribe((v) => {
        console.log('in showModalUpload', v);
        this.isVisibleUpload = true;
        this.displayFileList = v!;
      });
  }
  handleOkUpload(): void {
    this.isVisibleUpload = false;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    // 对上传文件大小进行限制
    console.log('file', file);
    const isLt10M = file.size! / 1024 / 1024 < 10;
    if (!isLt10M) {
      this.message.warning('文件必须在10M以内');
      this.uploading = false;
      this.fileList = [];
      return false;
    }
    this.fileList = this.fileList.concat(file);
    console.log('filelist', this.fileList);
    return false;
  };

  handleUpload(): void {
    // 手动上传
    this.fileList.forEach((file: any) => {
      this.uploading = true; // 修改上传按钮状态
      const formData = new FormData();
      formData.append('file', file);
      console.log('in filelist foreach ', file);
      this.requestrSrvc.uploadFile(formData).subscribe((_) => {
        this.uploading = false;
        this.message.success(
          `${file.name} 上传完毕,请在下方检查成功上传的文件`
        );
        this.ngOnInit();
      });
    });
    this.fileList = [];
  }

  deleteUploadConfirm(data: FileList) {
    this.requestrSrvc.deleteUpload(data.fid).subscribe((_) => {
      this.ngOnInit();
      this.message.success(`成功删除 ${data.filename} `);
    });
  }
  deleteUploadCancel() {}
  downloadUpload(data: FileList) {
    this.requestrSrvc.studentdownloadUpload(data.fid);
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
