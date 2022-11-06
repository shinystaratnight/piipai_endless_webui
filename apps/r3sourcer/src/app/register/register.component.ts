import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CompanySettings, SiteSettingsService } from '@webui/core';

@Component({
  selector: 'webui-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  public settings!: CompanySettings;

  get logo(): string {
    return this.settings['logo'] || '/assets/img/logo.svg';
  }

  constructor(
    private router: Router,
    private siteSettingsService: SiteSettingsService
  ) {}

  public ngOnInit(): void {
    this.settings = this.siteSettingsService.settings;
  }

  onClose() {
    this.router.navigateByUrl('/login');
  }
}
