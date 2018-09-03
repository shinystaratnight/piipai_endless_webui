import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs/Subscription';

import { getContactAvatar } from '../../../helpers/utils';
import { FormatString } from '../../../helpers/format.ts';

@Component({
  selector: 'form-info',
  templateUrl: './form-info.component.html',
  styleUrls: ['./form-info.component.scss']
})
export class FormInfoComponent implements OnInit, OnDestroy {
  public config: any;
  public group: any;
  public errors: any;

  public picture: string;
  public available: boolean;
  public title: string;
  public skill_title: string; //tslint:disable-line
  public address: string;
  public description: string;
  public status: any[];
  public averageScore: any;
  public contactAvatar: string;
  public created_at: string; //tslint:disable-line
  public updated_at: string; //tslint:disable-line
  public job_title: string; //tslint:disable-line
  public company: string;
  public titlePath: boolean;
  public carrier_reserve: number; //tslint:disable-line
  public map: any;
  public client: any;
  public link: string;
  public job: any;
  public jobsite: any;
  public tags: any;

  public color: any;
  public colorAttr: string;
  public className: any;
  public viewMode: boolean;

  public modalRef: NgbModalRef;
  public modalInfo: any;
  public saveProcess: boolean;

  public statusList: any[];
  public more: boolean;

  public colors = {
    1: '#FA5C46',
    2: '#fc9183',
    3: '#FFA236',
    4: '#ffbf00',
    5: '#FFD042'
  };

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal')
  public modal: TemplateRef<any>;

  private subscriptions: Subscription[];

  constructor(private modalService: NgbModal) {
    this.subscriptions = [];
  }

  public ngOnInit() {
    this.checkModeProperty();
    if (this.config.values && this.config.value) {
      const keys = Object.keys(this.config.values);

      this.averageScore = this.config.value.average_score;

      keys.forEach((key) => {
        if (key === 'status') {
          this[key] = this.getValue(
            this.config.values[key].field,
            this.config.value
          );

          if (this[key]) {
            if (this[key].length > 4) {
              this.statusList = this[key].slice(0, 4);

              this.more = true;
            } else {
              this.statusList = this[key];
            }

            this.color = this.config.values[key].color;
            this.colorAttr = this.config.values[key].color_attr;
          }
        } else if (key === 'picture') {
          this[key] =
            this.getValue(
              this.config.values[key],
              this.config.value,
              'picture'
            ) ||
            (this.getConfig('picture') &&
            this.getConfig('picture').companyContact
              ? '/assets/img/logo.svg'
              : null);
        } else if (key === 'map') {
          this[key] = this.getValue(this.config.values[key], this.config.value);

          if (this[key]) {
            if (this[key].latitude) {
              this[key].latitude = parseFloat(this[key].latitude);
            }

            if (this[key].longitude) {
              this[key].longitude = parseFloat(this[key].longitude);
            }
          }
        } else {
          this[key] = this.getValue(this.config.values[key], this.config.value);
        }
      });

      if (!this.picture && this.title) {
        this.contactAvatar = getContactAvatar(this.title);
      }

      if (
        this.config.metadata['title'] &&
        this.config.metadata['title'].value instanceof Object
      ) {
        this.titlePath = true;
      }
    }

    this.createEvent();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public createEvent() {
    if (this.config.value) {
      this.event.emit({
        type: 'create',
        el: this.config,
        value: this.config.key === 'id' && { id: this.config.value.id }
      });
    }
  }

  public getConfig(name: string) {
    if (name === 'title' && !this.config.editForm) {
      const config = this.config.metadata[name];

      config.templateOptions.label = `${config.key[0].toUpperCase()}${config.key.slice(
        1
      )}`;
      return config;
    }

    return this.config.metadata[name];
  }

  public getValue(key: string, data: any, type?: string): any {
    if (key) {
      let keys = key.split('.');
      let prop = keys.shift();

      if (!keys.length) {
        if (data[prop] instanceof Object && type === 'picture') {
          return data[prop].origin;
        }

        return data[prop];
      } else if (data[prop]) {
        return this.getValue(keys.join('.'), data[prop], type);
      }
    }
  }

  public checkClass(item) {
    let className;
    if (this.color && this.colorAttr) {
      const keys = Object.keys(this.color);

      keys.forEach((key) => {
        className =
          this.color[key].indexOf(item[this.colorAttr]) > -1 ? key : 'success';
      });
    }

    return className || 'success';
  }

  public showMore(e) {
    e.preventDefault();
    e.stopPropagation();

    this.statusList = this.status;
    this.more = false;

    return false;
  }

  public getScore(score) {
    return Math.floor(parseFloat(score));
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      const subscription = this.config.mode.subscribe((mode) => {
        this.viewMode = mode === 'view';
      });

      this.subscriptions.push(subscription);
    }
  }

  public extendJob() {
    const formatString = new FormatString();

    this.modalInfo = {
      type: 'form',
      endpoint: `/ecore/api/v2/hr/jobs/${this.config.value.id.id}/extend/`,
      mode: 'edit',
      edit: true,
      data: {
        skill: {
          action: 'add',
          data: {
            value: formatString.format('{position.id}', this.config.value)
          }
        },
        job: {
          action: 'add',
          data: {
            value: formatString.format('{id.id}', this.config.value)
          }
        }
      }
    };

    this.modalRef = this.modalService.open(this.modal, { size: 'lg' });
  }

  public formEvent(e, closeModal) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      this.saveProcess = false;
      closeModal();
    }
  }

  public formError() {
    this.saveProcess = false;
  }
}
