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
export class TAGuard implements CanActivate {
  constructor(
    private readonly userServ: UserService,
    private router: Router,
    private message: GlobalMessageService
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('in ta.guard');
    this.userServ
      .memberInit()
      .subscribe((_) =>
        console.log('subscribe memberinit in guard(ta) and ', _)
      );
    return this.userServ.memberRole$.pipe(
      skipWhile((v) => v == -1),
      map((role) => {
        if (role == 1 || role == 0) {
          // delay(0);
          console.log('ta.guard: role=0/1 : true(default)');
          return true;
        } else if (role == 2 || role == 3) {
          console.log('ta.guard: role=2/3 : ', this.userServ.hasmember);
          if (this.userServ.hasmember) {
            return true;
          } else {
            this.message.error('此账号未被允许加入此系统,请联系教务部!');
            return this.router.parseUrl('/home');
          }
        } else {
          console.log('!!!!!!!!!! role 值错误 !!!!!!!!!');
          return false;
        }
      })
    );
  }
}
