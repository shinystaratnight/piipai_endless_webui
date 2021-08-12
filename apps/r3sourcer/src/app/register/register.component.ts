import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public settings: {
    company_name: string;
    register_form_id: string;
    company: string;
    logo: string;
  };
  public config: any;
  public password: boolean;

  get title() {
    if (this.config) {
      return this.config.title;
    }

    return '';
  }

  get logo() {
    let logo = '/assets/img/logo.svg';

    if (this.settings) {
      logo = this.settings.logo || logo;
    }

    return logo;
  }

  constructor(private route: ActivatedRoute) {}

  public ngOnInit() {
    this.settings = this.route.snapshot.data['settings'];
  }

  public setFormConfig(config: any) {
    this.config = config;
  }
}
