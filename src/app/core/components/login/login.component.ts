import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '@core/service/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLogging = false;

  constructor(private userServ: UserService) {
    this.userServ.isLoading$.subscribe((value) => (this.isLogging = value));
  }

  ngOnInit(): void {
    const domain = window.location.hostname;
    window.location.replace(
      // 'http://172.18.198.146/sso/#/login?frontend=http://localhost:4200&backend=http://172.18.198.146/fushi/api/user/cas'
      'https://' +
        domain +
        '/sso/#/login?frontend=https://' +
        domain +
        '/fushi/&backend=https://' +
        domain +
        '/fushi/api/user/cas'
    );
    this.isLogging = false;
  }

  casLogin() {
    const domain = window.location.hostname;
    window.location.replace(
      'http://172.18.198.146/sso/#/login?frontend=http://localhost:4200&backend=http://172.18.198.146/fushi/api/user/cas'
      // 'https://' +
      //   domain +
      //   '/sso/#/login?frontend=https://' +
      //   domain +
      //   '/fushi/&backend=https://' +
      //   domain +
      //   '/fushi/api/user/cas'
    );
  }
}
