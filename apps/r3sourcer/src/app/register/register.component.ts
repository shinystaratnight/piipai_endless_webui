import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  public settings: {
    company_name: string;
    register_form_id: string;
    company: string;
    logo: string;
  };
  public config: any;

  get title(): string {
    return this.config ? this.config.title : '';
  }

  get logo(): string {
    //return this.settings.logo || '/assets/img/logo.svg';
    return '/assets/img/piiprent_logo.png';
  }

  constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.settings = this.route.snapshot.data['settings'];
  }

  public setFormConfig(config: any): void {
    this.config = config;
  }
}
