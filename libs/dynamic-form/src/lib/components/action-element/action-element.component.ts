import { Component, Input, ViewChild, EventEmitter, Output, OnChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SiteSettingsService } from '@webui/core';
import { FormatString } from '@webui/utilities';

@Component({
  selector: 'app-action-element',
  templateUrl: 'action-element.component.html',
  styleUrls: ['./action-element.component.scss'],
})
export class ActionElementComponent implements OnChanges {
  @Input() public config: any;
  @Input() public count: number;
  @Input() public actionProcess: boolean;
  @ViewChild('content') public content: any;

  public closeResult: string;
  public data: any;
  public label: string;

  @Output() public event: EventEmitter<any> = new EventEmitter();

  public action: any = {};

  public constructor(private modalService: NgbModal, private siteSettings: SiteSettingsService) {}

  public ngOnChanges() {
    this.data = {
      count: this.count,
    };
    const format = new FormatString();
    this.label = format.format(this.config.button_label, this.data);
  }

  public toDoAction() {
    if (this.action && this.action.confirm) {
      this.open(this.content);
    } else if (this.action && !this.action.confirm) {
      this.event.emit({
        action: this.action,
      });
    }
  }

  public open(content) {
    this.modalService.open(content, { backdrop: 'static' }).result.then(
      (result) => {
        if (result) {
          this.event.emit({
            action: this.action,
          });
          this.action = '';
        }
      },
      () => {
        return false;
      }
    );
  }

  public getSmsTitle(endpoint: string): string {
    return this.isDisableSmsButton(endpoint) ? this.siteSettings.getSmsSendTitle() : '';
  }

  public isDisableSmsButton(endpoint = ''): boolean {
    if (endpoint.indexOf('sendsms') !== -1) {
      return !this.siteSettings.isSmsEnabled();
    }
  }
}
