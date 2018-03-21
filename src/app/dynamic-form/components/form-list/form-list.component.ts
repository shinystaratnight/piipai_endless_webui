import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { FormatString } from '../../../helpers/format';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CheckPermissionService } from '../../../shared/services/check-permission';
import { GenericFormService } from '../../services/generic-form.service';

@Component({
  selector: 'form-list',
  templateUrl: 'form-list.component.html'
})

export class FormListComponent implements OnInit, OnDestroy {

  @ViewChild('modal')
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

  constructor(
    private modal: NgbModal,
    private permission: CheckPermissionService,
    private gfs: GenericFormService,
    private router: Router,
  ) { }

  public ngOnInit() {
    if (!this.config.hide) {
      this.initialize();
      this.checkFormData();
    }
    this.allowMethods = this.permission.getAllowMethods(undefined, this.config.endpoint);
  }

  public initialize(): void {
    this.update = new BehaviorSubject(false);
    this.isCollapsed = this.config.collapsed ? this.config.collapsed : false;
    if (this.config.query) {
      let queryKeys = Object.keys(this.config.query);
      let queryArray = [];
      queryKeys.forEach((el) => {
        queryArray.push(`${el}=${this.config.query[el]}`);
      });
      this.query = queryArray.join('&');
    }
    if (this.config.delay) {
      this.config.data = {
        length: 0,
        results: [],
        sendData: []
      };
      this.config.delayData[this.config.endpoint] = this.config;
    }

    if (this.config.metadata_query) {
      this.config.metadata_query = this.parseMetadataQuery(this.config, 'metadata_query');
    }

    if (this.config.add_metadata_query) {
      this.config.add_metadata_query = this.parseMetadataQuery(this.config, 'add_metadata_query');
    }
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
  }

  public addObject() {
    if (this.config.add_endpoint && this.config.add_endpoint.indexOf('fillin') > -1) {
      const urlPath = this.router.url.split('/');
      urlPath.splice(urlPath.length - 1, 1, 'fillin').join('/');
      this.router.navigateByUrl(urlPath.join('/'));
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
    this.modalRef = this.modal.open(this.modalTemplate, {size: 'lg'});
  }

  public formEvent(e, closeModal) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      this.updateList(e);
      this.saveProcess = false;
    }
  }

  public formError() {
    this.saveProcess = false;
  }

  public updateList(event) {
    if (this.config.delay && this.checkOnUnique(event.sendData, this.config.unique)) {
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
      this.showButton = (this.config.templateOptions.add_label || this.config.add_endpoint) && this.config.max > this.count; //tslint:disable-line
    } else {
      this.showButton = this.config.templateOptions.add_label || this.config.add_endpoint;
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
    let check: boolean = true;
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
    let keysArray = key.split('.');
    let firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      return data && data[firstKey];
    } else if (keysArray.length > 0) {
      let combineKeys = keysArray.join('.');
      return this.getValueByKey(combineKeys, data[firstKey]);
    }
  }

  public checkFormData() {
    if (this.config.formData) {
      this.config.formData
        .subscribe((formData) => {
          this.formData = formData.data;
          this.checkDefaultValues(formData.data);
        });
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
        this.gfs.getByQuery(this.config.endpoint, this.generateQuery(this.defaultQueries))
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
      return `${key}=${data[key]}`;
    });

    return `?${values.join('&')}`;
  }

  public updateDataInTheList(defaultData, addedData) {
    const length = this.config.data.results.length;

    this.pasredAddedData(addedData, defaultData, this.config.unique);
    this.pasredAddedData(this.config.data.sendData, defaultData, this.config.unique);
    this.config.data.results = [...defaultData, ...addedData];
  }

  public pasredAddedData(addedData: any[], defaultData: any[], fields: string[]) {
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
