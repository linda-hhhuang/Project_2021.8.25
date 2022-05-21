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

  isVisibleRandom = false;
  isOkLoadingRandom = false;

  currentStatus: number = 0;
  currentPass: number = 0;

  currentConfirm: number = 0;
  status = [
    '等待教务审核',
    '材料已被接收，即将审核',
    '材料已被接收，即将审核',
    '本人已确认夏令营面试成绩',
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
      this.currentStatus = student.body.status;
      this.currentPass = student.body.pass1;
      this.currentConfirm = student.body.confirm1;
    });
    this.requestrSrvc.getUploadFileList().subscribe((v) => {
      this.displayFileList = v.body;
    });
  }

  //报名表
  showModalUpdateInfo(): void {
    this.requestrSrvc.getStudentInfo().subscribe((v) => {
      this.isVisibleUpdateInfo = true;
      this.currentStudentInfo = v.body;
    });
  }
  handleOkUpdateInfo(): void {
    this.isOkLoadingUpdateInfo = true;

    if (this.currentStudentInfo.SignupTemplate.description.length > 600) {
      this.message.error('申请人个人陈述字数不能超过600个字!');
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
    this.isOkLoadingUpdateInfo = false;
    this.isVisibleUpdateInfo = false;
  }

  //文件
  showModalRandom(): void {
    this.isVisibleRandom = true;
  }
  handleOkRandom(): void {
    this.isVisibleRandom = false;
  }

  //文件
  showModalUpload(): void {
    this.requestrSrvc.fileList$
      .pipe(filter((v) => v != null))
      .subscribe((v) => {
        this.isVisibleUpload = true;
        this.displayFileList = v!;
      });
  }
  handleOkUpload(): void {
    this.isVisibleUpload = false;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    // 对上传文件大小进行限制

    const isLt10M = file.size! / 1024 / 1024 < 10;
    if (!isLt10M) {
      this.message.warning('文件必须在10M以内');
      this.uploading = false;
      this.fileList = [];
      return false;
    }
    this.fileList = this.fileList.concat(file);

    return false;
  };

  beforeUploadSign = (file: any): boolean => {
    if (file) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        const bstr = reader.result!;

        const isLt2M = file.size / 1024 < 100;
        if (!isLt2M) {
          this.message.error('签名图片大小需小于100KB!');
        } else {
          this.currentStudentInfo.SignupTemplate.sign = String(bstr);
        }
      };
    }
    return false;
  };

  beforeUploadPhoto = (file: any): boolean => {
    if (file) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        const bstr = reader.result!;

        const isLt2M = file.size / 1024 < 512;
        if (!isLt2M) {
          this.message.error('证件图片大小需小于512KB!');
        } else {
          this.currentStudentInfo.SignupTemplate.photo = String(bstr);
        }
      };
    }
    return false;
  };

  handleUpload(): void {
    // 手动上传
    this.fileList.forEach((file: any) => {
      this.uploading = true; // 修改上传按钮状态
      const formData = new FormData();
      formData.append('file', file);

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

  downloadUpload(data: FileList, flag: number) {
    if (flag === 0) {
      this.requestrSrvc.studentdownloadUpload(data.fid, '?preview=true');
    } else if (flag === 1) {
      this.requestrSrvc.studentdownloadUpload(data.fid, '');
    }
  }
  confirmAttend(n: number) {
    this.requestrSrvc.confirmAttend(n).subscribe((_) => {
      this.ngOnInit();
      this.message.success(`成功确认是否面试`);
      if (n === 1) this.showModalRandom();
    });
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
