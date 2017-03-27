import { Component } from '@angular/core';

@Component({
  selector: 'contact-registration-form',
  templateUrl: 'contact-registration-form.component.html'
})
export class ContactRegistrationFormComponent {

  public isCompany: boolean = true;
  public isRecruitee: boolean = false;
  public datepicker: any;

  public onCompany() {
    this.isCompany = true;
    this.isRecruitee = false;
  }

  public onRecruitee() {
    this.isRecruitee = true;
    this.isCompany = false;
  }

}
