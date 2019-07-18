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
  HostListener
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription, BehaviorSubject, Subject } from 'rxjs';

import { debounceTime, skip, filter } from 'rxjs/operators';

import { GenericFormService } from '../../services';
import { CheckPermissionService, ToastService, MessageType } from '../../../shared/services';
import {
  NavigationService,
  AuthService,
  UserService,
  SiteSettingsService
} from '../../../services';
import { BasicElementComponent } from '../basic-element/basic-element.component';
import { Field } from '../../models';
import { FormatString } from '../../../helpers/format';
import { Endpoints } from '../../../metadata/helpers';

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
  selector: 'app-form-related',
  templateUrl: './form-related.component.html',
  styleUrls: ['./form-related.component.scss']
})
export class FormRelatedComponent extends BasicElementComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('search')
  public search;

  @ViewChild('searchElement')
  public searchElement;

  @ViewChild('modal')
  public modal;

  @ViewChild('tableWrapper')
  public tableWrapper: any;

  @ViewChild('messageDetail')
  public messageDetail: any;

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

  public lastElement = 0;
  public limit = 10;
  public count: number;
  public searchValue: any;
  public fields: string[];

  public hideAutocomplete = true;
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
  public currentUser: boolean;
  public listDefaultQuery: string;
  public disableMessage: string;
  public fieldDisabled: boolean;
  public placeholder: string;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @ViewChild('autocomplete')
  public elementRef: ElementRef;

  private searchSubscription: Subscription;
  private subscriptions: Subscription[];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private genericFormService: GenericFormService,
    private permission: CheckPermissionService,
    private navigation: NavigationService,
    private authService: AuthService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private settingsService: SiteSettingsService,
    private sanitizer: DomSanitizer,
    private toastr: ToastService
  ) {
    super();
    this.subscriptions = [];
    this.editMode = true;
    this.update = new Subject();
  }

  public ngOnInit() {
    if (this.config.replaceKey) {
      this.config.key = this.config.replaceKey;
    }

    this.addControl(this.config, this.fb, this.config.templateOptions.required);

    this.skillEndpoint =
      this.config.endpoint === '/skills/skillbaserates/' ||
      this.config.endpoint === '/pricing/pricelistrates/';

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

    this.placeholder = this.config.templateOptions.placeholder ||
      (this.config.templateOptions.edit ? 'Select or add new' : 'Select');
  }

  public ngAfterViewChecked() {
    if (this.search && !this.autocompleteDisplay) {
      this.autocompleteDisplay = true;
      this.searchSubscription = this.search.valueChanges
        .pipe(
          skip(2),
          filter((value) => value !== null),
          debounceTime(400)
        )
        .subscribe(() => {
          this.filter(this.searchValue);
        });
    }
  }

  public checkMetadataQuery() {
    const properties = ['metadata_query', 'add_metadata_query'];

    properties.forEach((prop: string) => {
      this.config[prop] =
        this.config[prop] && this.parseMetadataQuery(this.config, prop);
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
      this.allowPermissions = this.permission.getAllowMethods(
        undefined,
        this.config.endpoint
      );
    }
  }

  public getDefaultDataForListType() {
    if (this.config.defaultData) {
      let query = '?limit=-1&';
      const params = [];
      const format = new FormatString();
      Object.keys(this.config.defaultData).forEach((el) => {
        const value = format.format(this.config.defaultData[el], this.formData);

        query += `${el}=${format.format(
          this.config.defaultData[el],
          this.formData
        ) || false}&`;
      });

      if (this.listDefaultQuery === query) {
        return;
      }

      this.listDefaultQuery = query;

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

      this.genericFormService
        .getByQuery(this.config.endpoint, query)
        .subscribe((res) => {
          this.generateDataForList(<any> { list: true, metadata }, res.results);
        });
    }
  }

  public parseMetadataQuery(data, field) {
    if (data[field] instanceof Object) {
      const keys = Object.keys(data[field]);
      const result = keys.map((query) => {
        return `${query}=${data[field][query]}`;
      });
      return result.join('&');
    } else {
      return data[field];
    }
  }

  public generateCustomTemplate(fieldsList) {
    if (this.config.value) {
      this.customTemplate = fieldsList.map((el, index) => {
        const object = <CustomField> {};
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

        if (!(<any> this.cd).destroyed) {
          this.cd.detectChanges();
        }
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
            { type: 'change' },
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
        this.fields.forEach((el) => (res[el] = null));
      }
    }
    return res;
  }

  public checkFormData() {
    if (this.config.formData) {
      const subscription = this.config.formData.subscribe((formData) => {
        this.formData = formData.data;
        if (this.config.key !== formData.key) {
          const disableData = this.isDisabled(this.formData);
          this.fieldDisabled = disableData.disable;
          this.disableMessage = disableData.messages.join(' ');

          if (this.config.errorMessage) {
            if (
              !this.getValueByKey(this.config.errorMessage.field, this.formData)
            ) {
              this.config.errorMessage.visible = true;
            } else {
              this.config.errorMessage.visible = false;
            }
          }

          if (this.config.default instanceof Object) {
            if (
              this.config.default.useIf &&
              this.checkExistKey(this.config.default.useIf, formData.key)
            ) {
              if (this.config.default.manual) {
                if (!formData.manual) {
                  return;
                }
              }
              const result = this.checkShowRules(
                this.config.default.useIf,
                formData.data
              );

              if (result) {
                this.getOptions.call(
                  this,
                  '',
                  0,
                  false,
                  this.setValue,
                  '',
                  this.config.default.query,
                  this.config.default.only
                );
              }
            }
          }

          if (
            this.checkRelatedField(formData.key, formData.data) ||
            (this.config.default &&
              this.config.default.includes &&
              !this.config.default.includes('session') &&
              !(formData.reset && formData.reset.indexOf(this.config.key) > -1))
          ) {
            if (this.config.defaultData) {
              this.getDefaultDataForListType();
            }

            if (this.checkIfMasterCompany(this.formData)) {
              if (this.config.if_master) {
                if (this.config.if_master.includes('session')) {
                  const id = this.userService.user.data.contact.contact_id;

                  if (this.config.read_only) {
                    this.viewMode = true;
                  }

                  if (!this.config.hide) {
                    this.getOptions.call(this, '', 0, false, this.setValue, id);
                  }
                } else {
                  const format = new FormatString();
                  let id;
                  if (typeof this.config.if_master === 'string') {
                    id = format.format(this.config.if_master, this.formData);
                  } else if (Array.isArray(this.config.if_master)) {
                    this.config.if_master.forEach((el) => {
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
            }

            if (
              this.config.default &&
              !this.config.hide &&
              !this.config.value
            ) {
              const format = new FormatString();
              let id;
              if (typeof this.config.default === 'string') {
                if (this.config.default === 'industry.default') {
                  if (this.formData.regular_company) {
                    const { industries } = this.formData.regular_company;

                    if (industries) {
                      const industry = industries.find((el) => el.default);

                      id = industry.id;
                    }
                  }
                }  else {
                  id = format.format(this.config.default, this.formData);
                }
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

          if (formData.reset && formData.reset.indexOf(this.config.key) > -1) {
            if (this.group.get(this.key).value) {
              this.displayValue = '';
              this.group.get(this.key).patchValue('');
              this.eventHandler(
                { type: 'reset' },
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

  public checkIfMasterCompany(data) {
    const customerCompany = data.customer_company;
    const providerCompany = data.provider_company;

    if (customerCompany && providerCompany && !this.config.editForm) {
      return customerCompany.id === providerCompany.id;
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
    const formatString = new FormatString();
    this.results = [];
    if (this.config.value || this.group.get(this.key).value) {
      const data = this.config.value
        ? this.config.value
        : this.group.get(this.key).value;
      if (!this.config.many) {
        let value;
        if (data instanceof Object) {
          if (this.config.options && this.config.options.length) {
            const obj = this.config.options.find(
              (el) => el[this.param] === data[this.param]
            );
            if (obj) {
              const path = this.getLinkPath(this.config.endpoint);
              if (path) {
                this.linkPath =
                  location.origin + path + data[this.param] + '/change';
              } else {
                this.linkPath = '/';
              }
              this.displayValue = formatString.format(this.display, obj);
            }
          } else {
            const path = this.getLinkPath(this.config.endpoint);
            if (path) {
              this.linkPath =
                location.origin + path + data[this.param] + '/change';
            } else {
              this.linkPath = '/';
            }
            this.displayValue = formatString.format(this.display, data);
          }
          value = data[this.param];
        } else {
          value = data;
          if (this.config.options && this.config.options.length) {
            const obj = this.config.options.find(
              (el) => el[this.param] === data
            );
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
          const results = [];
          this.config.options.forEach((el) => {
            el.__str__ = formatString.format(this.display, el);
            el.checked = false;
            data.forEach((elem) => {
              if (elem instanceof Object) {
                const param = this.config.relatedObjects
                  ? this.config.relatedObjects.field + '.id'
                  : this.param;
                const elemValue = { value: '' };
                this.getValueOfData(elem, param, elemValue);

                if (elemValue.value === el[this.param]) {
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
          this.config.options.sort((p, n) => (p.__str__ > n.__str__ ? 1 : -1));
        } else {
          this.results =
            data && data !== '-'
              ? data.map((el) => {
                  if (el.__str__) {
                    el.__str__ = formatString.format(this.display, el);
                  }
                  return el;
                })
              : [];
        }
        this.updateData();
      }
    } else if (
      this.config.default &&
      this.config.default.includes &&
      this.config.default.includes('session') &&
      !this.config.editForm
    ) {
      const id = this.userService.user.data.contact.contact_id;

      if (this.config.read_only) {
        this.viewMode = true;
      }

      if (!this.config.hide) {
        this.getOptions.call(this, '', 0, false, this.setValue, id);
      }
    } else if (
      this.config.default &&
      this.config.default.includes &&
      this.config.default.includes('client_id') &&
      !this.config.editForm
    ) {
      const id = this.userService.user.currentRole.company_id;

      this.group.get(this.key).patchValue(id);
      this.getOptions.call(this, '', 0, false, this.setValue, id);
    } else if (
      this.config.default &&
      this.config.default.includes &&
      this.config.default.includes('currentCompany')
    ) {
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
      const formatString = new FormatString();
      this.config.options.forEach((el) => {
        el.__str__ = formatString.format(this.display, el);
      });
      this.config.options.sort((p, n) => (p.__str__ > n.__str__ ? 1 : -1));
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

  public generateDataForList(config: Field, data?): void {
    if (config.list && config.metadata) {
      this.prefilledAttributes();
      this.dataOfList = [];
      const value = [];
      if (data) {
        data.forEach((el) => {
          const object = this.createObject(config.metadata);
          object['id'] = el.id;
          object['allData'] = el;
          this.fillingForm(object.metadata, el);
          object.data = this.fb.group({});
          value.push(object.data.value);
          this.dataOfList.push(object);
        });
        this.group.get(this.key).patchValue(data);
      }
    }
  }

  public prefilledAttributes() {
    if (this.config && this.config.metadata) {
      this.config.metadata.forEach((el) => {
        if (el && el.attributes) {
          const formatString = new FormatString();
          const attributes = Object.keys(el.attributes);

          attributes.forEach((key) => {
            el.templateOptions[key] = formatString.format(
              el.attributes[key],
              this.formData
            );
          });
        }
      });
    }
  }

  public createObject(metadata: Field[] = this.config.metadata): RelatedObject {
    const object = {
      id: undefined,
      allData: undefined,
      data: this.fb.group({}),
      metadata: []
    };
    const format = new FormatString();
    object.metadata = metadata.map((el) => {
      const element = Object.assign({}, el);
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
          newPrefilled[field] = format.format(
            el.prefilled[field],
            this.formData
          );
        });

        element.prefilled = newPrefilled;
      }

      if (!el.value && typeof el.default === 'string') {
        element.value = format.format(el.default, this.formData);
      }

      return element;
    });
    return object;
  }

  public addObject(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.dataOfList) {
      const object = this.createObject();
      this.dataOfList.push(object);
    }
  }

  public deleteObject(object: RelatedObject, e): void {
    e.stopPropagation();
    e.preventDefault();
    if (object.id) {
      this.genericFormService
        .delete(this.config.endpoint, object.id)
        .subscribe((response: any) => {
          this.dataOfList.splice(this.dataOfList.indexOf(object), 1);
          this.updateValue(undefined);
        },
        (error) => {
          this.toastr.sendMessage(error.errors.join(' '), MessageType.error);
        });
    }
  }

  public editObject(object: RelatedObject, e): void {
    e.stopPropagation();
    e.preventDefault();
    if (object.id) {
      this.open('update', object);
    }
  }

  public setAsDefault(object: RelatedObject): void {
    if (object.id) {
      const endpoint = `${this.config.endpoint}${object.id}/`;
      const body = {
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
      const value = this.dataOfList.map((el) => {
        const object = el.data.value;
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
    const keys = key.split('.');
    const prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
        obj['value'] = data[key];
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
    if (
      !this.skipScroll &&
      (this.previewList && this.previewList.length !== this.count)
    ) {
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

  public open(type, object?) {
    this.currentUser = false;

    if (this.hideDetail) {
      return false;
    }

    const format = new FormatString();

    if (type === 'update' && !this.config.templateOptions.edit) {
      return false;
    }

    if (!this.checkPermission(type) && this.config.endpoint) {
      return;
    }
    this.modalData = {};
    this.modalData.type = type;
    this.modalData.title = this.config.templateOptions.label;
    if (object && object.endpoint) {
      const parts = object.endpoint.split('/');
      parts.pop();
      object[this.param] = parts.pop();
      this.modalData.endpoint = [].concat(parts, '').join('/');
    } else {
      let endpoint;
      if (this.config.editEndpoint) {
        const formatString = new FormatString();
        endpoint = formatString.format(this.config.editEndpoint, this.formData);
      }

      this.modalData.endpoint = endpoint || this.config.endpoint;
    }
    if (type === 'update' || type === 'delete') {
      if (object) {
        this.modalData.title = object.allData
          ? object.allData.__str__
          : object.__str__;
        this.modalData.id = object[this.param];
        this.modalData.needData = true;
        if (this.modalData.endpoint === Endpoints.Timesheet) {
          this.modalData.title = '';
        }
      } else {
        this.modalData.title =
          this.config.templateOptions.editLabel || this.displayValue;
        const description = this.config.templateOptions.editDescription
          ? format.format(
              this.config.templateOptions.editDescription,
              this.formData
            )
          : '';

        if (description) {
          this.modalData.description = this.sanitizer.bypassSecurityTrustHtml(
            description
          );
          this.currentUser =
            this.formData['id'] === this.userService.user.data.user;
        }
        this.modalData.id =
          !this.config.editEndpoint && this.group.get(this.key).value;

        if (this.modalData.id instanceof Object) {
          this.modalData.id = this.modalData.id.id;
        }

        this.modalData.needData = this.config.editEndpoint ? false : true;
        this.modalData.edit = this.config.editEndpoint && true;
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

    if (this.modalData.endpoint === Endpoints.SmsMessages) {
      const messageType = (object && object.type) || this.config.metadata_query;
      const newModal = Object.assign(this.modalData,
        {
          label: messageType.toLowerCase().includes('sent')
            ? 'Sent message'
            : 'Received message',
          mode: 'view',
          edit: true,
          metadataQuery: messageType.toLowerCase()
        }
      );

      if (this.config.strField) {
        newModal.label = '';
      }

      this.modalRef = this.modalService.open(this.messageDetail, { windowClass: 'message-detail' });

      return false;
    }

    const windowClass = this.config.visibleMode && type === 'post' ? 'visible-mode' : '';

    this.modalRef = this.modalService.open(this.modal, { size: 'lg', windowClass });

    return false;
  }

  public changeLabel(data: { str: string, data: any }) {
    if (this.config.strField) {
      const type = data.data[this.config.strField].toLowerCase();

      this.modalData.label = type.includes('sent')
        ? 'Sent message'
        : 'Received message';
    }
  }

  public openAutocomplete(): void {
    if (this.config.type !== 'address' && !this.config.doNotChoice && !this.fieldDisabled) {
      if (this.hideAutocomplete === true) {
        this.searchValue = null;
        this.count = 0;
        this.lastElement = 0;
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
    this.previewList = list ? list.slice(0, this.lastElement) : [];
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
          const val = el.__str__;
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
        { type: 'change' },
        item && item[this.param],
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
      this.hideAutocomplete = true;
      this.lastElement = 0;
    }
    this.count = null;

    if (!(<any> this.cd).destroyed) {
      this.cd.detectChanges();
    }
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
      item.tests = this.addTests(item);
      this.results.push(item);
    }

    this.updateData();

    return true;
  }

  public addTests(item: any) {
    if (this.config.tests) {
      return this.config.tests.filter((test) => {
        const skills = test.acceptance_tests_skills;

        if (!skills.length) {
          return false;
        }

        return skills.some((skillRel) => skillRel.skill.id === item.id);
      });
    }
  }

  public passTests(item: any, event) {
    event.stopPropagation();
    event.preventDefault();

    this.event.emit({
      type: 'test',
      item
    });
  }

  public deleteItem(index: number, item: any, api: boolean) {
    if (api || this.config.send === false) {
      this.genericFormService
        .delete(
          this.config.endpoint,
          item[this.param],
          this.config.send !== false && 'delete'
        )
        .subscribe(() => {
          if (this.results[index]) {
            this.results.splice(index, 1);
            this.config.value.splice(index, 1);
            this.changeList();
          }
        });
    } else {
      if (this.results[index]) {
        if (this.config.options) {
          const val = this.config.options.find(
            (el) => el[this.param] === this.results[index][this.param]
          );
          if (val) {
            val.checked = false;
          }
        }
        this.results.splice(index, 1);
        this.changeList();
        this.updateData();
      }
    }
  }

  public setDefault(i, item) {
    this.results.forEach((el) => {
      el.default = false;
      if (el === item) {
        el.default = true;
      }
    });
    this.updateData();
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
    const results = this.results.map((el) => {
      if (this.config.sendData) {
        const result = {};

        this.config.sendData.forEach((key) => result[key] = el[key]);
        return {
          [this.param]: el[this.param],
          ...result
        }
      }
      return el[this.param];
    });
    this.group.get(this.key).patchValue(results);
  }

  public formEvent(e, closeModal) {
    if (e.type === 'saveStart') {
      this.saveProcess = true;
    }
    if (e.type === 'sendForm' && e.status === 'success' && !this.config.list) {
      closeModal();
      this.saveProcess = false;

      if (this.modalData.description && this.currentUser) {
        this.authService.logout();
      }

      if (this.config.timelineSubject) {
        this.config.timelineSubject.next('update');
      }

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
      this.group
        .get(this.key)
        .patchValue(
          this.config.useValue
            ? this.config.value[this.param]
            : e.data[this.param]
        );
      this.config.value = this.config.useValue
        ? this.config.value
        : e.data[this.param];
      this.displayValue = this.config.useValue
        ? formatString.format(this.display, this.config.value)
        : formatString.format(this.display, e.data);
      this.eventHandler({ type: 'change' }, e.data[this.param], e.data);
    } else if (
      e.type === 'sendForm' &&
      e.status === 'success' &&
      this.config.list
    ) {
      closeModal();
      this.saveProcess = false;
      this.updateList(e.data);
    }
  }

  public formError() {
    this.saveProcess = false;
  }

  public updateList(data?) {
    const object = this.dataOfList.find((el) => el.id === data.id);

    if (object) {
      const newMetadata = object.metadata.slice();
      this.fillingForm(newMetadata, data);
      object.metadata = newMetadata;

      if (!(<any> this.cd).destroyed) {
        this.cd.detectChanges();
      }
    }

    const newList = this.dataOfList.slice();

    this.dataOfList = null;

    setTimeout(() => {
      this.dataOfList = newList;
    }, 500);

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

  public removeItem(index, e) {
    e.stopPropagation();
    e.preventDefault();
    this.dataOfList.splice(index, 1);
    this.updateValue({});
  }

  public generateQuery(queries) {
    const format = new FormatString();
    let query = '&';
    if (queries) {
      const keys = Object.keys(queries);
      keys.forEach((el) => {
        query +=
          typeof queries[el] === 'string'
            ? queries[el] === 'currentCompany'
              ? `${el}=${this.settingsService.settings.company_settings.company}&`
              : `${el}=${format.format(queries[el], this.formData)}&`
            : `${el}=${this.parseQueryValue(queries[el])}&`;
      });
      query = query.slice(0, query.length - 1);
    }
    return query.length > 1 ? query : '';
  }

  public parseQueryValue(value: string | string[]) {
    const format = new FormatString();
    let result = '';
    if (Array.isArray(value)) {
      value.forEach((el) => {
        if (result) {
          return;
        }

        result = format.format(el, this.formData);
      });
    } else {
      result = value;
    }
    return result;
  }

  public getOptions(
    value,
    offset,
    concat = false,
    callback?,
    id?,
    customQuery?,
    only?
  ) {
    const format = new FormatString();

    const endpoint = format.format(this.config.endpoint, this.formData);
    if (endpoint) {
      let query = '';
      if (value) {
        query += `?search=${value}&`;
      }
      query += !query ? '?' : '';
      query += `limit=${this.limit}&offset=${offset}`;
      if (!this.config.templateOptions.dontSendFields) {
        query += this.generateFields(this.fields);
      }
      query += this.generateQuery(this.config.query);
      if (customQuery) {
        query += this.generateQuery(customQuery);
      }
      if (
        (query !== this.currentQuery || id !== this.currentId) &&
        (!this.count || (this.count && offset < this.count && concat))
      ) {
        this.lastElement += this.limit;
        this.currentQuery = query;
        this.currentId = id;
        if (!id) {
          this.genericFormService
            .getByQuery(endpoint, query)
            .subscribe((res: any) => {
              this.skipScroll = false;
              this.count = res.count;
              if (res.results && res.results.length) {
                const formatString = new FormatString();
                let results = [...res.results];

                if (this.config.unique) {
                  results = this.filterUniqueValue(res.results, this.results);
                }

                results.forEach((el) => {
                  el.__str__ = formatString.format(this.display, el);

                  if (this.config.templateOptions.info) {
                    el.score = formatString.format(
                      this.config.templateOptions.info['score'],
                      el
                    );
                    el.distance = formatString.format(
                      this.config.templateOptions.info['distance'],
                      el
                    );
                  }
                });

                results.forEach((el) => {
                  if (el) {
                    this.config.options = this.config.options || [];

                    if (!this.config.options.find((item) => item.id === el.id)) {
                      this.config.options.push(el);
                    }
                  }
                });

                if (concat && this.previewList) {
                  this.previewList.push(...results);
                } else {
                  this.previewList = results;
                }
              }
              if (res && res.length) {
                this.count = res.length;
                const formatString = new FormatString();

                if (this.config.unique) {
                  res = this.filterUniqueValue(res, this.results);
                }
                res.forEach((el) => {
                  el.__str__ = formatString.format(this.display, el);
                });
                if (concat && this.previewList) {
                  this.previewList.push(...res);
                } else {
                  this.previewList = res;
                }
              }

              if (!this.previewList) {
                this.previewList = [];
              }

              if (callback) {
                let canSetValue;

                if (only) {
                  if (res.results.length === only) {
                    canSetValue = true;
                  } else if (only > res.results.length || only < res.results.length) {
                    this.count = null;
                    this.clearField();
                  }
                } else if (!only) {
                  canSetValue = true;
                }

                if (canSetValue) {
                  const target = res.results.find((el) => el.id === id);

                  const item = target || res.results[0];

                  if (item) {
                    const path = this.getLinkPath(this.config.endpoint);
                    if (path) {
                      this.linkPath =
                        location.origin + path + item[this.param] + '/change';
                    } else {
                      this.linkPath = '/';
                    }

                    callback.call(this, item);
                  }
                }
              }
              this.updatePosition();
            });
        } else {
          this.genericFormService
            .getByQuery(
              endpoint + id + '/',
              `?${this.generateFields(this.fields)}`
            )
            .subscribe((res: any) => {
              this.lastElement = 0;
              if (res) {
                const path = this.getLinkPath(this.config.endpoint);
                if (path) {
                  this.linkPath =
                    location.origin + path + res[this.param] + '/change';
                } else {
                  this.linkPath = '/';
                }

                callback.call(this, res, false, true);
              }
            });
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
    const rulesNumber = rule.length;

    rule.forEach((el: any) => {
      if (typeof el === 'string') {
        const value = this.getValueByKey(el, data);

        if (value && value !== '0') {
          approvedRules += 1;
        } else {
          return;
        }
      } else if (el instanceof Object) {
        const key = Object.keys(el)[0];
        const targetValue = el[key];
        const value = this.getValueByKey(key, data);

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
    const keysArray = key.split('.');
    const firstKey = keysArray.shift();
    if (keysArray.length === 0) {
      return data && data[firstKey];
    } else if (keysArray.length > 0) {
      const combineKeys = keysArray.join('.');
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

  public clearField() {
    if (this.group.get(this.key).value) {
      this.displayValue = '';
      this.group.get(this.key).patchValue('');
      this.eventHandler(
        { type: 'reset' },
        this.group.get(this.key).value,
        this.resetAdditionalData()
      );
    }
  }

  public filterUniqueValue(target: any[], data: any[]): any[] {
    return target.filter((el) => {
      return !data.find((elem) => el[this.param] === elem[this.param]);
    });
  }

  public isDisabled(data) {
    const config = this.config.disabled;
    const messages = [];
    let disable = false;

    if (config) {
      config.keys.forEach((key, i) => {
        if (config.values[i] === this.getValueByKey(key, data)) {
          disable = true;
          messages.push(config.messages[i]);
        }
      });
    }

    return {
      disable,
      messages
    };
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
        if (this.previewList) {
          this.resetList();
          this.hideAutocomplete = true;
          this.cd.markForCheck();
          return;
        }
      }
    }
  }
}
