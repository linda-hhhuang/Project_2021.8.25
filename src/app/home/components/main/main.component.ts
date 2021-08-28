import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/service/user.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  isAdmin$ = this.userSrvc.user$.pipe(
    map((user) => user.role == 0 || user.role == 1)
  );

  constructor(private userSrvc: UserService) {}

  ngOnInit(): void {}
}
