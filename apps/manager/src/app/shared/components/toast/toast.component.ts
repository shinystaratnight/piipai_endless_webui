import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { ToastService, Message } from '../../services';

@Component({
  selector: 'app-toast',
  template: ''
})

export class ToastComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private toastr: ToastrService,
    private ts: ToastService
  ) {}

  public ngOnInit() {
    this.subscription = this.ts.message.subscribe((message: Message) => {
      if (message && this.toastr[message.type]) {
        this.toastr[message.type](message.message);
      }
    });
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
