import {Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable()
export class MessagerService {

  constructor(private messageService: MessageService) {
  }

  showToast(level: string, message: string): void {
    this.messageService.clear();
    this.messageService.add({severity: level, summary: '', detail: message});
  }

  showToastLarge(level: string, message: string): void {
    this.messageService.clear();
    this.messageService.add({severity: level, summary: '', detail: message, life: 8000});
  }


}
