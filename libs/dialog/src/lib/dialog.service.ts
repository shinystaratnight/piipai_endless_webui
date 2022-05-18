import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DialogService {
  constructor(private modalService: NgbModal) {}

  public open(content: any, options: any = {}) {
    return this.modalService.open(content, {
      backdrop: 'static',
      size: 'lg',
      ...options,
    });
  }
}
