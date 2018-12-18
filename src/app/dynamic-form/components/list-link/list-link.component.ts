import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { SiteSettingsService } from '../../../services/site-settings.service';

@Component({
  selector: 'app-list-link',
  templateUrl: 'list-link.component.html',
  styleUrls: ['./list-link.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ListLinkComponent implements OnInit {

  public config;
  public href: string | string[];
  public link: boolean;
  public value: string | string[];
  public last: boolean;
  public arrayValue: boolean;
  public smsDisabled: boolean;
  public smsDisabledTitle: string;

  public phone: boolean;
  public linkClass = '';

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  @ViewChild('view')
  public lickView;

  constructor(
    private siteSettings: SiteSettingsService
  ) {}

  public ngOnInit() {
    if (this.config.value && this.config.value instanceof Object && !Array.isArray(this.config.value)) { //tslint:disable-line
      this.value = this.config.value && (this.config.text || this.config.value.__str__);
    } else {
      this.value = this.config.value && (this.config.text || this.config.value);
      if (Array.isArray(this.config.value)) {
        this.arrayValue = true;
      }
    }
    this.href = this.config.link;

    if (Array.isArray(this.value) && Array.isArray(this.href)) {
      this.link = !(this.isEmail(this.value[0]) || this.isPhone(this.value[0]));
    } else {
      this.link = !(this.isEmail(this.value) || this.isPhone(this.value));
    }

    if (!this.link && this.config.link.indexOf('tel:') > -1) {
      this.phone = true;
    }

    if (this.config.color) {
      const classes = ['primary', 'danger', 'info', 'success', 'warning'];
      const color = this.config.color;
      this.linkClass = classes.indexOf(color) > -1 ? `text-${color} custom-link` : '';
    }

    this.smsDisabled = !this.siteSettings.isSmsEnabled();
    this.smsDisabledTitle = this.smsDisabled
      ? this.siteSettings.getSmsSendTitle()
      : '';
  }

  public isEmail(value) {
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //tslint:disable-line

    return reg.test(value) ? true : false;
  }

  public isPhone(value) {
    const reg = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    return reg.test(value) ? true : false;
  }

  public action(e, index) {
    e.preventDefault();
    e.stopPropagation();
    if (index || index === 0) {
      let endpoint = this.href[index];

      const newEndpoint = endpoint.split('/');
      newEndpoint.pop();
      newEndpoint.pop();
      const id = newEndpoint.pop();

      endpoint = '/ecore/api/v2' + [...newEndpoint, ''].join('/');

      this.event.emit({
        target: 'form',
        endpoint,
        label: (<any> this.value[index]).__str__,
        id
      });
      return;
    }

    if (this.value) {
      const arr = this.config.endpoint.split('/');
      const id = arr[arr.length - 2];
      arr.splice(arr.length - 2, 1);
      const endpoint = arr.join('/');
      if (this.config.action) {
        this.buttonAction.emit({
          el: this.config,
          value: this.config.action
        });
      } else {
        this.event.emit({
          target: 'form',
          endpoint: endpoint || this.config.endpoint,
          label: e.target.innerText,
          id: id || this.config.id
        });
      }
    }
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonHandler(e) {
    this.buttonAction.emit(e);
  }

  public sendSms() {
    if (!this.smsDisabled) {
      this.buttonAction.emit({
        type: 'click',
        value: 'sendSMS',
        el: Object.assign({}, this.config, {
          fields: [{
            type: 'link',
            field: this.config.key,
            value: this.config.value
          }]
        })
      });
    }
  }

}
