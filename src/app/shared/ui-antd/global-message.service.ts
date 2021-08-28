import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class GlobalMessageService {
  constructor(private readonly messageService: NzMessageService) {}

  error(message: string) {
    this.messageService.error(message);
  }

  success(message: string) {
    this.messageService.success(message);
  }

  warning(message: string) {
    this.messageService.warning(message);
  }
}
