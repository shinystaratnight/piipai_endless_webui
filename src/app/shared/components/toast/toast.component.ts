import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import { ToastrService, Message } from '../../services';

@Component({
  selector: 'my-toast',
  template: ''
})

export class ToastComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private ts: ToastrService
  ) {
    this.toastr.setRootViewContainerRef(this.vcr);
  }

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
