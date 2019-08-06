import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

import { FormatString } from '@webui/utilities';
import { smallModalEndpoints } from '../../helpers/small-modal';

import { CheckPermissionService } from '@webui/core';
import { GenericFormService } from '../../services/generic-form.service';

@Component({
  selector: 'app-form-list',
  templateUrl: 'form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit, OnDestroy {
  @ViewChild('modal', { static: false })
  public modalTemplate: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  public isCollapsed: boolean;

  public config;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;
  public count: number;

  public modalData: any;
  public format = new FormatString();

  public modalRef: NgbModalRef;

  public update: BehaviorSubject<boolean>;
  public query: string;
  public showButton: boolean;

  public allowMethods: string[];
  public formData: any[];

  public defaultValues: any[] = [];
  public defaultQueries: any;
  public addedData: any[] = [];

  public saveProcess: boolean;

  public initialized: boolean;
  public metadataQuery: string;
  public addMetadataQuery: string;

  private subscriptions: Subscription[];

  constructor(
    private modal: NgbModal,
    private permission: CheckPermissionService,
    private gfs: GenericFormService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.subscriptions = [];
  }

  public ngOnInit() {
    if (!this.config.hide) {
      this.initialize();
      this.checkFormData();
      this.checkTimelineChange();
    }
    this.checkHiddenProperty();
    this.allowMethods = this.permission.getAllowMethods(
      undefined,
      this.config.endpoint
    );
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      const subscription = this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.config.hide = hide;
        } else {
          if (!this.initialized) {
            this.initialize();
            this.checkFormData();
          }
          this.config.hide = hide;
        }

        if (!(<any> this.cd).destroyed) {
          this.cd.detectChanges();
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  public initialize(): void {
    this.update = new BehaviorSubject(false);
    this.isCollapsed = this.config.collapsed ? this.config.collapsed : false;
    if (this.config.query) {
      this.query = this.generateQuery(this.config.query).slice(1);
    }
    if (this.config.delay) {
      this.config.data = {
        length: 0,
        results: [],
        sendData: []
      };
      this.config.delayData[this.config.endpoint] = this.config;
    }

    if (
      this.config.metadata_query &&
      typeof this.config.metadata_query !== 'string'
    ) {
      this.config.metadata_query = this.parseMetadataQuery(
        this.config,
        'metadata_query'
      );
    }

    if (
      this.config.add_metadata_query &&
      typeof this.config.add_metadata_query !== 'string'
    ) {
      this.config.add_metadata_query = this.parseMetadataQuery(
        this.config,
        'add_metadata_query'
      );
    }

    this.initialized = true;
  }

  public parseMetadataQuery(data, field) {
    const keys = Object.keys(data[field]);
    const result = keys.map((query) => {
      return `${query}=${data[field][query]}`;
    });
    return result.join('&');
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public addObject() {
    if (
      this.config.add_endpoint &&
      this.config.add_endpoint.indexOf('fillin') > -1
    ) {
      const urlPath = this.router.url.split('/');
      urlPath.splice(urlPath.length - 1, 1, 'fillin').join('/');
      this.router.navigate([urlPath.join('/')]);
      return;
    }
    this.modalData = {};
    this.modalData.title = this.config.templateOptions.add_label;
    this.modalData.endpoint = this.config.add_endpoint || this.config.endpoint;
    if (this.config.prefilled) {
      this.modalData.data = {};
      const keys = Object.keys(this.config.prefilled);
      keys.forEach((el) => {
        this.modalData.data[el] = {
          action: 'add',
          data: {
            value: this.config.delay ? undefined : this.config.prefilled[el],
            read_only: true,
            editForm: true
          }
        };
        if (this.config.delay) {
          this.modalData.data[el].data.hide = true;
        }
      });
    }

    let windowClass = this.config.visibleMode ? 'visible-mode' : '';

    let size = 'lg';

    if (smallModalEndpoints.includes(this.modalData.endpoint)) {
      size = undefined;
      windowClass += ' small-modal';
    }

    if (this.modalData.endpoint.includes('/candidate/skillrels/')) {
      size = undefined;
    }

    this.modalRef = this.modal.open(this.modalTemplate, {
      size: size as any,
      windowClass
    });
  }

  public formEvent(e, closeModal) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      this.updateList(e);
      if (this.config.timelineSubject) {
        this.config.timelineSubject.next('update');
      }
      this.saveProcess = false;
    }
  }

  public formError() {
    this.saveProcess = false;
  }

  public updateList(event) {
    if (
      this.config.delay &&
      this.checkOnUnique(event.sendData, this.config.unique)
    ) {
      this.addedData.push(event.viewData);
      this.config.data.sendData.push(event.sendData);

      this.updateDataInTheList(this.defaultValues, this.addedData);
    }
    this.update.next(true);
  }

  public checkedHandler(e) {
    this.event.emit(e);
  }

  public eventHandler(e) {
    if (e) {
      this.config.templateOptions.label = e.__str__;
    }
  }

  public checkCount(e: number): void {
    this.count = e;
    if (this.config.max) {
      this.showButton =
        (this.config.templateOptions.add_label || this.config.add_endpoint) &&
        this.config.max > this.count; //tslint:disable-line
    } else {
      this.showButton =
        this.config.templateOptions.add_label || this.config.add_endpoint;
    }
  }

  public checkPermissions(type: string): boolean {
    if (this.allowMethods) {
      return this.allowMethods.indexOf(type) > -1;
    } else {
      return false;
    }
  }

  public checkOnUnique(data, fields: string[]) {
    if (!fields) {
      return true;
    }
    let check = true;
    fields.forEach((el: string) => {
      const inputValue = this.getValueByKey(el, data);
      this.config.data.sendData.find((field) => {
        const value = this.getValueByKey(el, field);
        if (inputValue === value) {
          check = false;
        }
      });

      this.config.data.results.find((field) => {
        const value = this.getValueByKey(el, field);
        if (inputValue === value) {
          check = false;
        }
      });
    });
    return check;
  }

  public getValueByKey(key: string, data: any): any {
    const keysArray = key.split('.');
    const firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      return data && data[firstKey];
    } else if (keysArray.length > 0) {
      const combineKeys = keysArray.join('.');
      return this.getValueByKey(combineKeys, data[firstKey]);
    }
  }

  public checkFormData() {
    if (this.config.formData) {
      const subscription = this.config.formData.subscribe((formData) => {
        this.formData = formData.data;
        this.checkDefaultValues(formData.data);
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkTimelineChange() {
    if (this.config.timelineSubject) {
      const subscription = this.config.timelineSubject
        .pipe(
          skip(1)
        )
        .subscribe(() => this.update.next(true));

      this.subscriptions.push(subscription);
    }
  }

  public checkDefaultValues(data) {
    const format = new FormatString();
    if (this.config.default) {
      if (!this.defaultQueries) {
        this.defaultQueries = {};
      }
      const keys = Object.keys(this.config.default);
      let fullfilled = true;
      keys.forEach((key) => {
        const value = format.format(this.config.default[key], data);
        this.defaultQueries[key] = value;
        if (!value) {
          fullfilled = false;
        }
      });

      if (fullfilled) {
        this.gfs
          .getByQuery(
            this.config.endpoint,
            this.generateQuery(this.defaultQueries)
          )
          .subscribe((res: any) => {
            this.defaultValues = res.results;
            this.updateDataInTheList(this.defaultValues, this.addedData);
            this.update.next(true);
          });
      } else {
        this.defaultValues = [];
        this.updateDataInTheList(this.defaultValues, this.addedData);
        this.update.next(true);
      }
      return;
    }
  }

  public generateQuery(data: any): string {
    const keys = Object.keys(data);
    const values = keys.map((key) => {
      if (Array.isArray(data[key])) {
        const result = [];
        data[key].forEach((el) => {
          result.push(`${key}=${el}`);
        });
        return result.join('&');
      }

      return `${key}=${data[key]}`;
    });

    return `?${values.join('&')}`;
  }

  public updateDataInTheList(defaultData, addedData) {
    const length = this.config.data.results.length;

    this.pasredAddedData(addedData, defaultData, this.config.unique);
    this.pasredAddedData(
      this.config.data.sendData,
      defaultData,
      this.config.unique
    );
    this.config.data.results = [...defaultData, ...addedData];
  }

  public pasredAddedData(
    addedData: any[],
    defaultData: any[],
    fields: string[]
  ) {
    if (!fields) {
      return;
    }
    if (defaultData && defaultData.length) {
      fields.forEach((el: string) => {
        const inputValues = [];
        defaultData.forEach((field) => {
          inputValues.push(this.getValueByKey(el, field));
        });

        for (let i = 0; i < addedData.length; i++) {
          const value = this.getValueByKey(el, addedData[i]);
          if (inputValues.indexOf(value) > -1) {
            addedData.splice(i, 1);
            i--;
          }
        }
      });
    }
  }
}