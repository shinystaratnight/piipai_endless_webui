import { Component, OnInit, OnDestroy } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { ToastService, Message } from '@webui/core';

@Component({
  selector: 'webui-toast',
  template: ''
})
export class ToastComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  constructor(
    private toastr: ToastrService,
    private toastService: ToastService
  ) {}

  public ngOnInit() {
    this.subscription = this.toastService.message$.subscribe(
      (data: Message) => {
        const { text, type } = data;

        if (!text) {
          return;
        }

        this.toastr[type](text, '', {
          timeOut: 10000
        });
      }
    );
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
