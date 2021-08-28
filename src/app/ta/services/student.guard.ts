import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { UserService } from '@core/service/user.service';
import { map, skipWhile, delay } from 'rxjs/operators';
import { GlobalMessageService } from '@shared/ui-antd/global-message.service';
@Injectable({
  providedIn: 'root',
})
export class StudentGuard implements CanActivate {
  constructor(
    private readonly userServ: UserService,
    private router: Router,
    private message: GlobalMessageService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('in admin.guard');
    this.userServ
      .memberInit()
      .subscribe((_) =>
        console.log('subscribe memberinit in guard(ta/admin) and ', _)
      );
    return this.userServ.memberRole$.pipe(
      skipWhile((v) => v == -1),
      map((role) => {
        if (role == 3) {
          console.log('ta/student.guard: role=3 : true(default)');
          return true;
        } else {
          this.message.error('您无权进入此版块');
          return this.router.parseUrl('/');
        }
      })
    );
  }
}
