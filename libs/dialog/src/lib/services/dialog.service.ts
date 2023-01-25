import { Injectable } from '@angular/core';
import { EventService, EventType } from '@webui/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { filter, Subject, takeUntil } from 'rxjs';
import { dialogMap } from '../models';

@Injectable()
export class DialogService {
  private _destroy = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private eventService: EventService
  ) {}

  public open(content: any, options: NgbModalOptions = {}) {
    return this.modalService.open(content, {
      backdrop: 'static',
      size: 'lg',
      ...options,
    });
  }

  public init() {
    this.subscribeOnEvent();
  }

  public destroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  private subscribeOnEvent() {
    this.eventService.event$
      .pipe(
        takeUntil(this._destroy),
        filter((event) => event === EventType.OpenDialog)
      )
      .subscribe(() => {
        const { type, onInit, content } = this.eventService.payload;

        const dialogRef = this.open(dialogMap.get(type), {
          size: 'sm',
        });

        dialogRef.componentInstance.payload = content || {};

        if (onInit) {
          onInit(dialogRef);
        }
      });
  }
}
