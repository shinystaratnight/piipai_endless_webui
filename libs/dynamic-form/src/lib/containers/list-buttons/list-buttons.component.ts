import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { SiteSettingsService } from '@webui/core';
import { Endpoints } from '@webui/models';
import { getTranslationKey } from '@webui/utilities';

interface Button {
  label: string;
  endpoint: string;
  action: string;
}

@Component({
  selector: 'webui-list-buttons',
  templateUrl: 'list-buttons.component.html',
  styleUrls: ['./list-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListButtonsComponent {

  @Input()
  public buttons!: Button[];

  @Input()
  public first!: boolean;

  @Input()
  public inForm!: boolean;

  @Input()
  public label!: string;

  @Input()
  public poped!: boolean;

  @Input() public allowPermissions!: string[];
  @Input() public endpoint!: string;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  getTranslationKey = getTranslationKey;

  get convertedEndpoint(): Endpoints {
    return this.endpoint as Endpoints;
  }

  constructor(
    private siteSettings: SiteSettingsService
  ) {}

  public getSmsTitle(action: string): string {
    return this.isDisableSmsButton(action)
      ? this.siteSettings.getSmsSendTitle()
      : '';
  }

  public isDisableSmsButton(action: string): boolean {
    if (action === 'sendSMS') {
      return !this.siteSettings.isSmsEnabled();
    }

    return false;
  }

  public buttonAction(type: string): void {
    if (!this.isDisableSmsButton(type)) {
      this.event.emit({
        type
      });
    }
  }

  public checkPermission(type: string): boolean {
    return this.allowPermissions.indexOf(type) > -1;
  }
}
