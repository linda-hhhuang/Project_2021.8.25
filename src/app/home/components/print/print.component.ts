import { Component, OnInit } from '@angular/core';
import { PrintRequestService } from '@home/service/print-request.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css'],
})
export class PrintComponent implements OnInit {
  requestList$ = this.requestSrvc.requestList$;
  id!: string | null;
  Id!: Observable<string>;
  // buttonVisiable = new BehaviorSubject<boolean>(true);
  buttonVisiable = false;
  constructor(
    private requestSrvc: PrintRequestService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap((params: ParamMap) => {
          console.log(
            'in print-component-ngOninit , get ID : ',
            params.get('id')!
          );
          this.id = params.get('id');
        })
      )
      .subscribe((_) => {
        if (this.id == null) {
          this.requestSrvc.getRequestInfoList().subscribe();
        } else {
          this.requestSrvc.getRequestInfo(+this.id).subscribe();
        }
      });
    console.log('in print-component-ngOninit');
  }

  print() {
    this.buttonVisiable = true;
    setTimeout((_: any) => {
      window.print();
      this.buttonVisiable = false;
    }, 1000);
  }
}
