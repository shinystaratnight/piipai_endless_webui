import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { ErrorsService } from '../services/errors.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'my-toast',
  template: ''
})

export class ToastComponent implements OnInit {

  constructor(
    private errors: ErrorsService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public ngOnInit() {
    this.errors.messages.subscribe((message) => {
      this.showError(message);
    });
  }

  public showError(message) {
    this.toastr.error(message, 'Oops!');
  }
}
