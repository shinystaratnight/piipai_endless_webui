import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageType, ToastService, UserService } from '@webui/core';
import { Endpoints } from '@webui/data';
import { GenericFormService } from '@webui/dynamic-form';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})

export class ConsentComponent {
  constructor(
    private router: Router,
    private genericFormService: GenericFormService,
    private userServise: UserService,
    private toast: ToastService,
  ) { }

  onAgree() {
    const id = this.userServise.user.data.contact.candidate_contact;

    this.genericFormService.submitForm(`${Endpoints.CandidateContact}${id}/consent/`, {})
      .subscribe((res) => {
        this.toast.sendMessage('Thank you!', MessageType.success);
        this.router.navigate(['/']);
      })
  }

  notAgree() {
    this.router.navigate(['/']);
  }
}
