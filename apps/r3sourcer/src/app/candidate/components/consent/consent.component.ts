import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageType, ToastService, UserService } from '@webui/core';
import { Endpoints } from '@webui/data';
import { GenericFormService } from '@webui/dynamic-form';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})

export class ConsentComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private genericFormService: GenericFormService,
    private userServise: UserService,
    private toast: ToastService,
  ) {}

  get user() {
    return this.userServise.user;
  }

  onAgree() {
    const id = this.route.snapshot.params['id'];

    this.genericFormService.submitForm(`${Endpoints.CandidateContact}${id}/consent/`, {})
      .pipe(catchError((err) => {
        const message = err.errors.detail;

        this.toast.sendMessage(message, MessageType.error);
        return of(err);
      }))
      .subscribe((res) => {
        if (res.status == 'success') {
          this.toast.sendMessage('Thank you!', MessageType.success);
          this.router.navigate(['/']);
        }
      })
  }

  notAgree() {
    this.router.navigate(['/']);
  }
}
