import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'webui-form-legend',
  templateUrl: './form-legend.component.html',
  styleUrls: ['./form-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLegendComponent {
  private readonly _legend: Record<string, string> = {
    auth_url: `The login auth token url`,
    candidate_contact: `Candidate contact name`,
    get_fill_time_sheet_url: `URL of timesheet to fill in`,
    get_url: `The same value as "auth_url"`,
    candidate_consent_url: `The same value similar to "auth_url"`,
    contact: `Combination of designation and full name of the contact.`,
    contact__first_name: `First name of contact`,
    contact__email: `contact’s email`,
    email_verification_link: ``,
    manager: `Manager’s full name`,
    master_company: `Master company name`,
    master_company_contact: `Contact for master company`,
    master_company_url: `URL of master company`,
    password: `Password`,
    portfolio_manager: `Portfolio Manager name`,
    portfolio_manager__contact__phone_mobile: `Portfolio manager' phone number`,
    project_url: `URL of the project`,
    shift_end_date: `End date of a given shift`,
    site_url: `URL of the websie`,
    subdomain: `Subdomain of the main domain. e.g. piiprent`,
    supervisor: `Supervisor's name`,
    username: `Username`,
    verification_url: `URL link for user verification`
  };

  list: string[] = Object.keys(this._legend);

  getDescription(key: string): string {
    return this._legend[key];
  }

}
