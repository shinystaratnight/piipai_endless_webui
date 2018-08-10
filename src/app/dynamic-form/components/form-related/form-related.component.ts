import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
  ElementRef,
  HostListener,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/filter';

import { GenericFormService } from '../../services';
import { CheckPermissionService } from '../../../shared/services';
import { NavigationService, UserService, SiteSettingsService } from '../../../services';
import { BasicElementComponent } from '../basic-element/basic-element.component';
import { Field } from '../../models';
import { FormatString } from '../../../helpers/format';
import { Subject } from 'rxjs/Subject';

export interface RelatedObject {
  id: string;
  allData: any;
  data: FormGroup;
  metadata: Field[];
}

export interface CustomField {
  key: string;
  value: any;
  icon?: string;
  link?: boolean;
  prefix?: string;
  outside?: boolean;
}

@Component({
  selector: 'form-related',
  templateUrl: './form-related.component.html',
  styleUrls: ['./form-related.component.scss']
})

export class FormRelatedComponent
  extends BasicElementComponent
    implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('search')
  public search;

  @ViewChild('searchElement')
  public searchElement;

  @ViewChild('modal')
  public modal;

  @ViewChild('tableWrapper')
  public tableWrapper: any;

  public config: Field;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;

  public label: boolean;
  public isCollapsed: boolean;
  public viewMode: boolean;
  public editMode: boolean;
  public saveProcess: boolean;
  public linkPath: string;

  public display: string;
  public param: string;

  public list: any[];
  public previewList: any[];
  public results: any;
  public displayValue: any;

  public lastElement: number = 0;
  public limit: number = 10;
  public count: number;
  public searchValue: any;
  public fields: string[];

  public hideAutocomplete: boolean = true;
  public modalData: any = {};
  public modalRef: any;

  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;
  public skipScroll = false;

  public dataOfList: any;
  public formData: any = {};
  public allowPermissions: string[];

  public replaceElements: any = [];

  public listElement: Field;

  public skillEndpoint: boolean;
  public customTemplate: CustomField[];

  public autocompleteDisplay: boolean;
  public currentQuery: string;
  public currentId: string;
  public update: Subject<any>;
  public manual: boolean;
  public hideDetail: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChild('autocomplete') public elementRef: ElementRef;

  private searchSubscription: Subscription;
  private subscriptions: Subscription[];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private genericFormService: GenericFormService,
    private permission: CheckPermissionService,
    private navigation: NavigationService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private settingsService: SiteSettingsService
  ) {
    super();
    this.subscriptions = [];
    this.editMode = true;
  }

  public ngOnInit() {
    this.addControl(this.config, this.fb, this.config.templateOptions.required);

    this.skillEndpoint = this.config.endpoint === '/ecore/api/v2/skills/skillbaserates/' ||
      this.config.endpoint === '/ecore/api/v2/pricing/pricelistrates/';

    this.display = this.config.templateOptions.display || '{__str__}';
    this.param = this.config.templateOptions.param || 'id';
    this.fields = this.config.templateOptions.values || ['__str__'];
    this.isCollapsed = this.config.collapsed;
    this.viewMode = this.config.editForm && this.config.read_only;

    if (this.fields.indexOf(this.param) === -1) {
      this.fields.push(this.param);
    }

    this.getAllowPermissions();
    this.checkAutocomplete();
    this.checkFormData();
    this.setInitValue();
    this.createEvent();
    this.checkModeProperty();
    this.checkHiddenProperty();
    this.getDefaultDataForListType();
    this.checkCustomTemplate();
    this.checkIfListType();
    this.checkDelayData();
    this.checkMetadataQuery();

    if (this.config && this.config.metadata) {
      this.getReplaceElements(this.config.metadata);
    }

    this.update = new Subject();
  }

  public ngAfterViewChecked() {
    if (this.search && !this.autocompleteDisplay) {
      this.autocompleteDisplay = true;
      this.searchSubscription = this.search.valueChanges
        .skip(2)
        .filter((value) => value !== null)
        .debounceTime(400)
        .subscribe(() => {
          this.filter(this.searchValue);
        });
    }
  }

  public checkMetadataQuery() {
    const properties = ['metadata_query', 'add_metadata_query'];

    properties.forEach((prop: string) => {
      this.config[prop] = this.config[prop] && this.parseMetadataQuery(this.config, prop);
    });
  }

  public checkDelayData() {
    if (this.config.delay) {
      this.config.data = {
        sendData: []
      };
      this.config.delayData[this.config.endpoint] = this.config;
    }
  }

  public checkIfListType() {
    if (this.config && this.config.list && this.config.data) {
      const subscription = this.config.data.subscribe((data) => {
        this.generateDataForList(this.config, data);
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkCustomTemplate() {
    if (this.config.custom && this.config.custom.length) {
      this.generateCustomTemplate(this.config.custom);
    }
  }

  public getAllowPermissions() {
    if (!this.allowPermissions) {
      this.allowPermissions = this.permission.getAllowMethods(undefined, this.config.endpoint);
    }
  }

  public getDefaultDataForListType() {
    if (this.config.defaultData) {
      let query = '?limit=-1&';
      const params = [];
      const format = new FormatString();
      Object.keys(this.config.defaultData).forEach((el) => {
        const value = format.format(this.config.defaultData[el], this.formData);

        query += `${el}=${format.format(this.config.defaultData[el], this.formData) || false}&`;
      });

      const metadata = JSON.parse(JSON.stringify(this.config.metadata));
      metadata.forEach((el) => {
        if (el.key) {
          el.mode = new BehaviorSubject('view');
          el.read_only = true;
          if (el.query) {
            Object.keys(el.query).forEach((param) => {
              el.query[param] = format.format(el.query[param], this.formData);
            });
          }
        }
      });

      this.genericFormService.getByQuery(this.config.endpoint, query)
        .subscribe((res) => {
          this.generateDataForList(<any> { list: true, metadata }, res.results);
        });
    }
  }

  public parseMetadataQuery(data, field) {
    const keys = Object.keys(data[field]);
    const result = keys.map((query) => {
      return `${query}=${data[field][query]}`;
    });
    return result.join('&');
  }

  public generateCustomTemplate(fieldsList) {
    if (this.config.value) {
      this.customTemplate = fieldsList.map((el, index) => {
        let object = <CustomField> {};
        object.value = this.config.customValue[index];
        object.key = el;
        if (el.indexOf('email') > -1) {
          object.icon = 'envelope';
          object.prefix = 'mailto:';
        } else if (el.indexOf('phone_mobile') > -1) {
          object.icon = 'commenting';
          object.prefix = 'tel:';
        } else if (el.indexOf('website') > -1) {
          object.icon = 'globe';
          object.outside = true;
        } else if (el.indexOf('address') > -1) {
          object.icon = 'map-marker';
        } else if (el === '__str__' || el.indexOf('contact.__str__') > -1) {
          object.link = true;
        }
        return object;
      });
    } else {
      this.customTemplate = [];
    }
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      const subscription = this.config.hidden.subscribe((hide) => {
        if (hide && !this.config.hide) {
          this.displayValue = null;
          this.group.get(this.key).patchValue('');
          this.setInitValue();
        }
        this.config.hide = hide;

        this.cd.detectChanges();
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      this.config.mode.subscribe((mode) => {
        if (mode === 'view') {

          this.viewMode = true;
          this.editMode = false;

          this.group.get(this.key).patchValue('');
          this.displayValue = undefined;

          this.autocompleteDisplay = false;
          if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
          }
          this.setInitValue();
          this.eventHandler(
            {type: 'change'},
            this.group.get(this.key).value,
            this.resetAdditionalData()
          );
        } else if (mode === 'edit') {
          this.viewMode = this.config.read_only || false;
          this.editMode = true;
          this.setInitValue();
        }
      });
    }
  }

  public resetAdditionalData() {
    const res = {};
    if (this.group.get(this.key).value === '') {
      if (this.fields) {
        this.fields.forEach((el) => res[el] = null);
      }
    }
    return res;
  }

  public checkFormData() {
    if (this.config.formData) {
      const subscription = this.config.formData.subscribe((formData) => {
        this.formData = formData.data;
        if (this.config.key !== formData.key) {
          if (this.config.errorMessage) {
            if (!this.getValueByKey(this.config.errorMessage.field, this.formData)) {
              this.config.errorMessage.visible = true;
            } else {
              this.config.errorMessage.visible = false;
            }
          }

          if (
            this.checkRelatedField(formData.key, formData.data) ||
            (
              this.config.default
              && !this.config.default.includes('session')
              && !(formData.reset && formData.reset.indexOf(this.config.key) > -1)
            )
          ) {
            if (this.config.defaultData) {
              this.getDefaultDataForListType();
            }

            if (this.config.default && !this.config.hide && !this.config.value) {
              const format = new FormatString();
              let id;
              if (typeof this.config.default === 'string') {
                id = format.format(this.config.default, this.formData);
              } else if (Array.isArray(this.config.default)) {
                this.config.default.forEach((el) => {
                  if (!id) {
                    id = format.format(el, this.formData);
                  }
                });
              }
              if (id && id !== this.group.get(this.key).value) {
                this.getOptions.call(this, '', 0, false, this.setValue, id);
                if (this.config.read_only) {
                  this.viewMode = true;
                }
              }
            }
          }

          if (
            formData.reset
            && formData.reset.indexOf(this.config.key) > -1
          ) {
            if (this.group.get(this.key).value) {
              this.displayValue = '';
              this.group.get(this.key).patchValue('');
              this.eventHandler(
                {type: 'reset'},
                this.group.get(this.key).value,
                this.resetAdditionalData()
              );
            }

          }
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  public checkAutocomplete() {
    if (this.config.autocompleteData) {
      const subscription = this.config.autocompleteData.subscribe((data) => {
        const key = this.propertyMatches(Object.keys(data), this.config.key);
        if (key) {
          this.hideDetail = true;
          this.viewMode = true;
          this.currentQuery = undefined;
          this.getOptions.call(this, '', 0, false, this.setValue, data[key]);
        }
      });

      this.subscriptions.push(subscription);
    }
  }

  public propertyMatches(keys: string[], key: string): string {
    return keys.find((el) => key.includes(el));
  }

  public getLinkPath(endpoint): string {
    const list = this.navigation.linksList;
    let result;
    list.forEach((el) => {
      if (el.endpoint === endpoint) {
        result = el.url;
      }
    });
    return result;
  }

  public setInitValue() {
    let formatString = new FormatString();
    this.results = [];
    if (this.config.value || this.group.get(this.key).value) {
      let data = this.config.value ? this.config.value :
        this.group.get(this.key).value;
      if (!this.config.many) {
        let value;
        if (data instanceof Object) {
          if (this.config.options && this.config.options.length) {
            const obj = this.config.options.find((el) => el[this.param] === data[this.param]);
            if (obj) {
              const path = this.getLinkPath(this.config.endpoint);
              if (path) {
                this.linkPath = location.origin + path + data[this.param] + '/change';
              } else {
                this.linkPath = '/';
              }
              this.displayValue = formatString.format(this.display, obj);
            }
          } else {
            const path = this.getLinkPath(this.config.endpoint);
            if (path) {
              this.linkPath = location.origin + path + data[this.param] + '/change';
            } else {
              this.linkPath = '/';
            }
            this.displayValue = formatString.format(this.display, data);
          }
          value = data[this.param];
        } else {
          value = data;
          if (this.config.options && this.config.options.length) {
            const obj = this.config.options.find((el) => el[this.param] === data);
            if (obj) {
              const path = this.getLinkPath(this.config.endpoint);
              if (path) {
                this.linkPath = location.origin + path + value + '/change';
              } else {
                this.linkPath = '/';
              }
              this.displayValue = formatString.format(this.display, obj);
            }
          } else {
            this.getOptions.call(this, '', 0, false, this.setValue, data);
          }
        }
        this.group.get(this.key).patchValue(value);
      } else {
        if (this.config.options && this.config.options.length) {
          let results = [];
          this.config.options.forEach((el) => {
            el.__str__ = formatString.format(this.display, el);
            el.checked = false;
            data.forEach((elem) => {
              if (elem instanceof Object) {
                if (elem[this.param] === el[this.param]) {
                  el.checked = true;
                  results.push(el);
                }
              } else {
                if (elem === el[this.param]) {
                  el.checked = true;
                  results.push(el);
                }
              }
            });
            this.results = [...results];
          });
          this.config.options.sort((p, n) => p.__str__ > n.__str__ ? 1 : -1);
        } else {
          this.results = data && data !== '-' ? data.map((el) => {
            if (el.__str__) {
              el.__str__ = formatString.format(this.display, el);
            }
            return el;
          }) : [];
        }
        this.updateData();
      }
    } else if (
      this.config.default
      && this.config.default.includes('session')
      && !this.config.editForm
    ) {
      const id = this.userService.user.data.contact.contact_id;

      if (this.config.read_only) {
        this.viewMode = true;
      }

      if (!this.config.hide) {
        this.getOptions.call(this, '', 0, false, this.setValue, id);
      }

    } else if (this.config.default && this.config.default.includes('currentCompany')) {
      const id = this.settingsService.settings.company_settings.company;

      this.group.get(this.key).patchValue(id);

    } else {
      this.parseOptions();
    }

    this.generateDataForList(this.config, this.config.value);
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }

    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }

  public parseOptions() {
    if (this.config.options && this.config.options.length) {
      let formatString = new FormatString();
      this.config.options.forEach((el) => {
        el.__str__ = formatString.format(this.display, el);
      });
      this.config.options.sort((p, n) => p.__str__ > n.__str__ ? 1 : -1);
    }
  }

  public getReplaceElements(metadata: Field[]): void {
    metadata.forEach((el) => {
      if (el.type === 'replace') {
        this.replaceElements.push(el);
      } else if (el.children) {
        this.getReplaceElements(el.children);
      }
    });
  }

  public generateDataForList(config: Field, data = undefined): void {
    if (config.list && config.metadata) {
      this.dataOfList = [];
      let value = [];
      if (data) {
        data.forEach((el) => {
          let object = this.createObject(config.metadata);
          object['id'] = el.id;
          object['allData'] = el;
          this.fillingForm(object.metadata, el);
          object.data = this.fb.group({});
          value.push(object.data.value);
          this.dataOfList.push(object);
        });
        this.group.get(this.key).patchValue(data);
      } else {
        let object = this.createObject();
        this.dataOfList.push(object);
      }
    }
  }

  public createObject(metadata: Field[] = this.config.metadata): RelatedObject {
    let object = {
      id: undefined,
      allData: undefined,
      data: this.fb.group({}),
      metadata: []
    };
    const format = new FormatString();
    object.metadata = metadata.map((el) => {
      let element = Object.assign({}, el);
      element.mode = el.mode;

      if (el.query) {
        const newQuery = {};
        Object.keys(el.query).forEach((query) => {
          newQuery[query] = format.format(el.query[query], this.formData);
        });

        element.query = newQuery;
      }

      if (el.prefilled) {
        const newPrefilled = {};
        Object.keys(el.prefilled).forEach((field) => {
          newPrefilled[field] = format.format(el.prefilled[field], this.formData);
        });

        element.prefilled = newPrefilled;
      }

      return element;
    });
    return object;
  }

  public addObject(): void {
    if (this.dataOfList) {
      let object = this.createObject();
      this.dataOfList.push(object);
    }
  }

  public deleteObject(object: RelatedObject): void {
    if (object.id) {
      this.genericFormService
        .delete(this.config.endpoint, object.id)
        .subscribe(
          (response: any) => {
            this.dataOfList.splice(this.dataOfList.indexOf(object), 1);
            this.updateValue(undefined);
          }
        );
    }
  }

  public editObject(object: RelatedObject): void {
    if (object.id) {
      this.open('update', object);
    }
  }

  public setAsDefault(object: RelatedObject): void {
    if (object.id) {
      let endpoint = `${this.config.endpoint}${object.id}/`;
      let body = {
        default_rate: true,
        skill: object.allData.skill.id
      };
      this.genericFormService
        .editForm(endpoint, body)
        .subscribe((res: any) => this.updateList());
    }
  }

  public updateValue(e): void {
    if (e.type !== 'create' && e.type !== 'updateValue') {
      let value = this.dataOfList.map((el) => {
        let object = el.data.value;
        if (el.id) {
          object.id = el.id;
        }
        return object;
      });
      if (this.config.delayData) {
        this.config.data.sendData = value.filter((el) => !el.id);
      }

      this.group.get(this.key).patchValue(value);
    }
  }

  public fillingForm(metadata: Field[], data): void {
    metadata.forEach((el) => {
      if (el.key) {
        this.getValueOfData(data, el.key, el);
      } else if (el.children) {
        this.fillingForm(el.children, data);
      }
    });
  }

  public getValueOfData(data, key: string, obj: Field): void {
    let keys = key.split('.');
    let prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
        if (!obj['value']) {
          obj['value'] = data[key];
        }
        if (obj.type === 'related') {
          if (obj.value && obj.value instanceof Object) {
            if (obj.value.id && obj.value.__str__) {
              obj.options = [obj.value];
            }
          }
        }
      }
    } else {
      if (data[prop]) {
        this.getValueOfData(data[prop], keys.join('.'), obj);
      }
    }
  }

  public onModalScrollDown(): void {
    if (!this.skipScroll && (this.previewList && this.previewList.length !== this.count)) {
      this.skipScroll = true;
      this.generateList(this.searchValue, true);
    }
  }

  public deleteElement(closeModal): void {
    closeModal();
    this.event.emit({
      type: 'delete',
      endpoint: this.modalData.endpoint,
      id: this.modalData.id,
      el: this.config
    });
    this.group.get(this.key).patchValue('');
    delete this.config.value;
    this.displayValue = null;
  }

  public open(type, object = undefined) {
    if (this.hideDetail) {
      return false;
    }

    const format = new FormatString();

    if (!this.checkPermission(type) && this.config.endpoint) {
      return;
    }
    this.modalData = {};
    this.modalData.type = type;
    this.modalData.title = this.config.templateOptions.label;
    if (object.endpoint) {
      const parts = object.endpoint.split('/');
      parts.pop();
      object[this.param] = parts.pop();
      this.modalData.endpoint = [].concat(parts, '').join('/');
    } else {
      this.modalData.endpoint = this.config.endpoint;
    }
    if (type === 'update' || type === 'delete') {
      if (object) {
        this.modalData.title = object.allData ? object.allData.__str__ : object.__str__;
        this.modalData.id = object[this.param];
      } else {
        this.modalData.title = this.displayValue;
        this.modalData.id = this.group.get(this.key).value;
      }
      if (type === 'update') {
        this.modalData.mode = 'edit';
      }
    }
    if (this.config.prefilled) {
      this.modalData.data = {};
      const keys = Object.keys(this.config.prefilled);
      keys.forEach((el) => {
        this.modalData.data[el] = {
          action: 'add',
          data: {
            value: this.config.list
              ? this.config.prefilled[el]
              : format.format(this.config.prefilled[el], this.formData),
            read_only: true,
            isPrefilled: true,
            editForm: true
          }
        };
      });
    }
    this.modalRef = this.modalService.open(this.modal, {size: 'lg'});

    return false;
  }

  public openAutocomplete(): void {
    if (this.config.type !== 'address' && !this.config.doNotChoice) {
      if (this.hideAutocomplete === true) {
        this.searchValue = null;
        this.generateList(this.searchValue);
        setTimeout(() => {
          this.searchElement.nativeElement.focus();
        }, 50);
      }
    }
  }

  public generateList(value, concat = false): void {
    if (!this.config.doNotChoice) {
      this.currentQuery = null;
      this.hideAutocomplete = false;
      if (this.config.useOptions) {
        if (this.searchValue) {
          this.filter(this.searchValue);
        } else {
          this.list = this.config.options;
          this.generatePreviewList(this.list);
        }
      } else {
        this.getOptions(value, this.lastElement, concat);
      }
    }
  }

  public generatePreviewList(list) {
    if (this.config.options) {
      this.previewList = list;
      return;
    }

    this.lastElement += this.limit;
    this.previewList = list.slice(0, this.lastElement);
  }

  public resetList() {
    setTimeout(() => {
      this.list = null;
      this.previewList = null;
      this.lastElement = 0;
      this.hideAutocomplete = true;
      this.count = null;
    }, 150);
  }

  public filter(value) {
    this.lastElement = 0;
    this.count = null;
    this.previewList = null;
    if (this.config.useOptions) {
      let filteredList;
      if (value && this.config.options) {
        filteredList = this.config.options.filter((el) => {
          let val = el.__str__;
          if (val) {
            return val.toLowerCase().indexOf(value.toLowerCase()) > -1;
          }
        });
        this.list = filteredList;
        this.generatePreviewList(this.list);
      } else {
        this.generatePreviewList(this.config.options);
      }
    } else {
      this.generateList(value);
    }
  }

  public setValue(item, manual?: boolean, update?: boolean) {
    let updated = false;

    if (item) {
      if (this.config.many) {
        updated = this.updateValueOfManyType(item);
      } else {
        updated = this.updateValueOfSingleType(item, update);
      }
    } else {
      updated = this.resetValue();
    }

    if (updated || update) {
      this.eventHandler(
        {type: 'change'},
        (item && item[this.param]),
        item,
        manual
      );
    }

    this.changeList();
    if (!this.config.useOptions) {
      this.searchValue = null;
      this.list = null;
      this.count = null;
      this.previewList = null;
    }
    this.cd.detectChanges();
  }

  public resetValue(): boolean {
    this.displayValue = '';
    this.group.get(this.key).patchValue('');

    return true;
  }

  public updateValueOfSingleType(item: any, update?: boolean): boolean {
    if (item[this.param] !== this.group.get(this.key).value || update) {
      const formatString = new FormatString();

      this.displayValue = formatString.format(this.display, item);
      this.group.get(this.key).patchValue(item[this.param]);

      return true;
    }

    return false;
  }

  public updateValueOfManyType(item: any): boolean {
    if (this.config.useOptions) {
      if (item.checked) {
        this.results.push(item);
      } else {
        this.results.splice(this.results.indexOf(item), 1);
      }
    } else {
      this.results.push(item);
    }

    this.updateData();

    return true;
  }

  public deleteItem(index: number, item: any, api: boolean) {
    if (api || this.config.send === false) {
      this.genericFormService.delete(
        this.config.endpoint, item[this.param],
        this.config.send !== false && 'delete')
        .subscribe(() => {
          if (this.results[index]) {
            this.results.splice(index, 1);
            this.config.value.splice(index, 1);
            this.changeList();
          }
        });
    } else {
      if (this.results[index]) {
        const val = this.config.options
          .find((el) => el[this.param] === this.results[index][this.param]);
        if (val) {
          val.checked = false;
        }
        this.results.splice(index, 1);
        this.changeList();
        this.updateData();
      }
    }
  }

  public eventHandler(e, value, additionalData?, manual?: boolean) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value,
      additionalData,
      manual
    });
  }

  public changeList() {
    this.event.emit({
      list: this.results,
      el: this.config,
      type: 'chenge'
    });
  }

  public updateData() {
    let results = this.results.map((el) => {
      return el[this.param];
    });
    this.group.get(this.key).patchValue(results);
  }

  public formEvent(e, closeModal, type = undefined) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success' && !this.config.list) {
      closeModal();
      this.saveProcess = false;
      const formatString = new FormatString();
      if (this.config.many) {
        e.data.__str__ = formatString.format(this.display, e.data);
        this.setValue(e.data);
        if (!this.config.useOptions) {
          if (!this.config.value) {
            this.config.value = [e.data];
          } else {
            this.config.value.push(e.data);
          }
        }
        return;
      }
      this.group.get(this.key).patchValue(e.data[this.param]);
      this.config.value = e.data[this.param];
      this.displayValue = formatString.format(this.display, e.data);
      this.eventHandler({type: 'change'}, e.data[this.param], e.data);
    } else if (e.type === 'sendForm' && e.status === 'success' && this.config.list) {
      closeModal();
      this.saveProcess = false;
      this.updateList();
    }
  }

  public formError() {
    this.saveProcess = false;
  }

  public updateList() {
    this.event.emit({
      type: 'updateData',
      el: this.config
    });
  }

  public generateFields(fields?: string[]) {
    let query = '&';
    if (fields) {
      fields.forEach((el) => {
        query += `fields=${el}&`;
      });
      query = query.slice(0, query.length - 1);
    } else {
      query = `&fields=__str__&fields=${this.param}`;
    }
    return query;
  }

  public removeItem(index) {
    this.dataOfList.splice(index, 1);
    this.updateValue({});
  }

  public generateQuery(queries) {
    const format = new FormatString();
    let query = '&';
    if (queries) {
      const keys = Object.keys(queries);
      keys.forEach((el) => {
        query += typeof queries[el] === 'string'
          ? `${el}=${format.format(queries[el], this.formData)}&`
          : `${el}=${queries[el]}&`;
      });
      query = query.slice(0, query.length - 1);
    }
    return query.length > 1 ? query : '';
  }

  public getOptions(value, offset, concat = false, callback?, id?, customQuery?) {
    let endpoint = this.config.endpoint;
    if (endpoint) {
      let query = '';
      if (value) {
        query += `?search=${value}&`;
      }
      query += !query ? '?' : '';
      query += `limit=${this.limit}&offset=${offset}`;
      query += this.generateFields(this.fields);
      query += this.generateQuery(this.config.query);
      if (customQuery) {
        query += this.generateQuery(customQuery);
      }
      if ((query !== this.currentQuery || id !== this.currentId)
          && (!this.count || (this.count && offset < this.count && concat))) {
        this.lastElement += this.limit;
        this.currentQuery = query;
        this.currentId = id;
        if (!id) {
          this.genericFormService.getByQuery(endpoint, query).subscribe(
            (res: any) => {
              this.skipScroll = false;
              this.count = res.count;
              if (res.results && res.results.length) {
                const formatString = new FormatString();
                res.results.forEach((el) => {
                  el.__str__ = formatString.format(this.display, el);
                });
                if (concat && this.previewList) {
                  this.previewList.push(...res.results);
                } else {
                  this.previewList = res.results;
                }
              }
              if (callback) {
                const target = res.results.find((el) => el.id === id);

                const item = target || res.results[0];

                if (item) {
                  const path = this.getLinkPath(this.config.endpoint);
                  if (path) {
                    this.linkPath = location.origin + path + item[this.param] + '/change';
                  } else {
                    this.linkPath = '/';
                  }

                  callback.call(this, item);
                }
              }
              this.updatePosition();
            }
          );
        } else {
          this.genericFormService
          .getByQuery(endpoint + id + '/', `?${this.generateFields(this.fields)}`)
          .subscribe(
            (res: any) => {
              this.lastElement = 0;
              if (res) {
                const path = this.getLinkPath(this.config.endpoint);
                if (path) {
                  this.linkPath = location.origin + path + res[this.param] + '/change';
                } else {
                  this.linkPath = '/';
                }

                callback.call(this, res, false, true);
              }
            }
          );
        }
      }
    }
  }

  public checkPermission(type: string): boolean {
    if (this.allowPermissions) {
      return this.allowPermissions.indexOf(type) > -1;
    } else {
      return false;
    }
  }

  public checkRelatedField(key: string, data): boolean {
    let result;
    if (this.config.showIf && this.checkExistKey(this.config.showIf, key)) {
      result = this.checkShowRules(this.config.showIf, data);
    }
    return result || false;
  }

  public checkExistKey(rules, key) {
    let result = false;
    rules.forEach((rule) => {
      if (rule instanceof Object) {
        const keys = Object.keys(rule);
        result = result || keys.indexOf(key) > -1;
      } else {
        result = result || rule.indexOf(key) > -1;
      }
    });
    return result;
  }

  public checkShowRules(rule: any[], data): boolean {
    let approvedRules = 0;
    let rulesNumber = rule.length;

    rule.forEach((el: any) => {
      if (typeof el === 'string') {
        let value = this.getValueByKey(el, data);

        if (value && value !== '0') {
          approvedRules += 1;
        } else {
          return;
        }
      } else if (el instanceof Object) {
        let key = Object.keys(el)[0];
        let targetValue = el[key];
        let value = this.getValueByKey(key, data);

        if (value === targetValue) {
          approvedRules += 1;
        } else {
          return;
        }
      }
    });

    return approvedRules === rulesNumber;
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

  public trackByFn(value) {
    return value[this.param];
  }

  public isArray(target: any) {
    return Array.isArray(target);
  }

  public updatePosition() {
    this.update.next();
  }

  @HostListener('document:click', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    if (this.elementRef) {
      do {
        if (clickedComponent === this.elementRef.nativeElement) {
          inside = true;
        }
        clickedComponent = clickedComponent.parentNode;
      } while (clickedComponent);
      if (!inside) {
        this.hideAutocomplete = true;
        this.cd.detectChanges();
        return;
      }
    }
  }
}
