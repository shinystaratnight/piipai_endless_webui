import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { VerifyService, UserService } from '../../services';
import { ToastService, MessageType } from '../../shared/services';

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-verify-email',
  template: '',
})
export class VerifyEmailComponent implements OnInit {

  public verifyEndpoint = '/ecore/api/v2/core/contacts/verify_email/';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private vs: VerifyService,
    private ts: ToastService,
    private userService: UserService
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.vs.verifyEmail(this.verifyEndpoint + `?token=${params.token}`)
        .pipe(
          catchError((err) => {
            return of(err);
          })
        )
        .subscribe(
          (res) => {
            if (res.message) {
              setTimeout(() => {
                this.ts.sendMessage(res.message, MessageType.success);

                const user = this.userService.user;
                if (user.currentRole && user.currentRole.__str__.includes('candidate')) {

                  this.router.navigate(['profile']);
                }

              }, 2000);
            } else if (res.statusText) {
              setTimeout(() => {
                this.ts.sendMessage(res.statusText, MessageType.error);
              }, 2000);
            }

            this.router.navigate(['']);
          }
        );
    });

  }
}
