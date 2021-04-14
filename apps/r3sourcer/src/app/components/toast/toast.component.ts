import { Component, OnInit, OnDestroy } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { ToastService, Message } from '@webui/core';

@Component({
  selector: 'app-toast',
  template: ''
})
export class ToastComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(
    private toastr: ToastrService,
    private toastService: ToastService
  ) {}

  public ngOnInit() {
    this.subscription = this.toastService.message$.subscribe(
      (data: Message) => {
        const { text } = data;
        const method = this.toastr[data.type];

        if (!text || !method) {
          return;
        }

        method(text);
      }
    );
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
