import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/service/user.service';
import { GlobalMessageService } from '@shared/ui-antd/global-message.service';
import { Subject } from 'rxjs';
import { take, takeUntil, skip, skipWhile } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ta-redirect',
  templateUrl: './ta-redirect.component.html',
  styleUrls: ['./ta-redirect.component.css'],
})
export class TARedirectComponent implements OnInit {
  private ngOnDestroy$ = new Subject<void>();

  constructor(
    private readonly userServ: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private message: GlobalMessageService
  ) {}

  ngOnInit(): void {
    console.log('in redirect ta');
    this.userServ.memberRole$
      .pipe(
        skipWhile((v) => v == -1),
        take(1),
        takeUntil(this.ngOnDestroy$)
      )
      .subscribe((role) => {
        console.log('in ta redirect ,role is ', role);
        if (role == 0 || role == 1) {
          this.router.navigate(['admin'], { relativeTo: this.route });
        } else if (role == 2) {
          this.router.navigate(['teacher'], { relativeTo: this.route });
        } else if (role == 3) {
          this.router.navigate(['student'], { relativeTo: this.route });
        }
      });
  }
  ngOnDestroy() {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }
}
