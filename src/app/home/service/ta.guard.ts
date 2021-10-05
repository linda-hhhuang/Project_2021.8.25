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
    this.userServ.memberInit().subscribe();
    return this.userServ.memberRole$.pipe(
      skipWhile((v) => v == -1),
      map((role) => {
        if (role == 1 || role == 0) {
          // delay(0);
          return true;
        } else if (role == 2 || role == 3) {
          if (this.userServ.hasmember) {
            return true;
          } else {
            this.message.error('此账号未被允许加入此系统,请联系教务部!');
            return this.router.parseUrl('/home');
          }
        } else {
          return false;
        }
      })
    );
  }
}
