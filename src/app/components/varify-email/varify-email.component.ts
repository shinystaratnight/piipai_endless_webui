import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VerifyService } from '../../services';
import { ToastService, MessageType } from '../../shared/services';

@Component({
  selector: 'app-verify-email',
  template: '',
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    private router: Router,
    private vs: VerifyService,
    private ts: ToastService
  ) {}

  public ngOnInit() {
    this.vs.verifyEmail(`ecore/api/v2${this.router.url}`)
      .subscribe(
        (res) => {
          setTimeout(() => {
            this.ts.sendMessage(res.message, MessageType.success);
          }, 2000);

          this.router.navigate(['']);
        }
    );
  }
}
