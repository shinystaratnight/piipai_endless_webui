import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { BasicElementComponent } from './../basic-element/basic-element.component';

import { GenericFormService } from './../../services/generic-form.service';
import { CheckPermissionService } from '../../../shared/services';
import { NavigationService, UserService } from '../../../services';

import { Field } from '../../models/field.model';

import { FormatString } from '../../../helpers/format';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/filter';

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
    implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('search')
  public search;

  @ViewChild('searchElement')
  public searchElement;

  @ViewChild('modal')
  public modal;

  @ViewChild('tableWrapper')
  public tableWrapper: any;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public label: boolean;
  public display: string;
  public param: string;
  public list: any[];
  public results: any;
  public displayValue: any;
  public limit: number = 10;
  public previewList: any[];
  public lastElement: number = 0;
  public searchValue: any;
  public hideAutocomplete: boolean = true;
  public modalData: any = {};
  public modalRef: any;
  public formData: any = {};

  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;

  public skipScroll = false;

  public dataOfList: any;
  public count: number;
  public isCollapsed: boolean = false;

  public replaceElements: any = [];

  public listElement: Field;

  public viewMode: boolean;

  public skillEndpoint: boolean;
  public customTemplate: CustomField[];

  public fields: string[];

  public saveProcess: boolean;

  public linkPath: string;
  public allowPermissions: string[];
  public relatedAutocomplete: any;
  public subscription: Subscription;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private genericFormService: GenericFormService,
    private permission: CheckPermissionService,
    private navigation: NavigationService,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.skillEndpoint = this.config.endpoint === '/ecore/api/v2/skills/skillbaserates/' ||
      this.config.endpoint === '/ecore/api/v2/pricing/pricelistrates/';
    this.display =
      this.config.templateOptions.display ? this.config.templateOptions.display : '{__str__}';
    this.param = this.config.templateOptions.param ? this.config.templateOptions.param : 'id';
    this.fields = this.config.templateOptions.values;
    this.allowPermissions = this.permission.getAllowMethods(undefined, this.config.endpoint);
    if (this.fields) {
      this.fields.push(this.param);
    }
    this.checkAutocomplete();
    this.checkFormData();
    if (!this.config.editForm && this.config.read_only) {
      return;
    }
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
    if (this.config.custom && this.config.custom.length) {
      this.generateCustomTemplate(this.config.custom);
    }
    if (this.config && this.config.list && this.config.data) {
      this.config.data.subscribe((data) => {
        this.generateDataForList(this.config, data);
      });
    }
    this.createEvent();
    if (this.config && this.config.metadata) {
      this.getReplaceElements(this.config.metadata);
    }
    this.isCollapsed = this.config.collapsed;

    if (this.config.editForm && this.config.read_only) {
      this.viewMode = true;
    }
  }

  public ngAfterViewInit() {
    if (this.search) {
      this.subscription = this.search.valueChanges
        .skip(2)
        .filter((value) => value !== null)
        .debounceTime(400)
        .subscribe((res) => {
          this.filter(this.searchValue);
        });
    }
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
      this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.displayValue = null;
          this.group.get(this.key).patchValue(undefined);
          this.setInitValue();
        }
        this.config.hide = hide;
      });
    }
  }

  public checkModeProperty() {
    if (this.config && this.config.mode) {
      this.config.mode.subscribe((mode) => {
        if (mode === 'view') {
          this.viewMode = true;
        } else {
          this.viewMode = this.config.read_only || false;
        }
        this.setInitValue();
      });
    }
  }

  public checkFormData() {
    if (this.config.formData) {
      this.config.formData.subscribe((formData) => {
        this.formData = formData.data;
        if (this.checkRelatedField(formData.key, formData.data)) {
          if (this.config.default && !this.config.hide && !this.config.value) {
            this.getOptions.call(this, '', 0, false, this.setValue);
            if (this.config.read_only) {
              this.viewMode = true;
            }
          }
          if (this.relatedAutocomplete) {
            const query = {};
            this.relatedAutocomplete.related.forEach((field) => {
              if (field === 'state') {
                query['region'] = `{state.id}`;
              } else {
                query[field] = `{${field}.id}`;
              }

              if (field === 'country') {
                query['code2'] = this.relatedAutocomplete.search;
              }
            });

            this.getOptions.call(this, this.relatedAutocomplete.search, 0 , false, this.setValue, undefined, query); //tslint:disable-line
          }
        }
      });
    }
  }

  public checkAutocomplete() {
    if (this.config.autocompleteData) {
      this.config.autocompleteData.subscribe((data) => {
        this.relatedAutocomplete = undefined;
        if (data.hasOwnProperty(this.config.key)) {
          if (data[this.config.key].related) {
            this.relatedAutocomplete = {
              search: data[this.config.key].value,
              related: data[this.config.key].related
            };
          } else {
            this.getOptions.call(this, data[this.config.key].value, 0, false, this.setValue);
          }
        }
      });
    }
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
          }
        }
        this.group.get(this.key).patchValue(value);
      } else {
        if (this.config.options && this.config.options.length) {
          let results = [];
          this.config.options.forEach((el) => {
            data.forEach((elem) => {
              if (elem instanceof Object) {
                if (elem[this.param] === el[this.param]) {
                  results.push(el);
                }
              } else {
                if (elem === el[this.param]) {
                  results.push(el);
                }
              }
            });
            results.forEach((elem) => {
              elem.__str__ = formatString.format(this.display, elem);
            });
            this.results = [...results];
          });
        } else {
          this.results = data && data !== '-' ? [...data] : [];
        }
        this.updateData();
      }
    } else if (this.config.default && this.config.default.includes('session')) {
      const id = this.userService.user.data.contact.contact_id;

      this.getOptions.call(this, '', 0, false, this.setValue, id);
    }

    if (this.config.query) {
      this.config.currentQuery = `${this.config.query}${this.config.id}`;
    }
    this.generateDataForList(this.config, this.config.value);
  }

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
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
          let object = this.createObject();
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

  public createObject(): RelatedObject {
    let object = {
      id: undefined,
      allData: undefined,
      data: this.fb.group({}),
      metadata: []
    };
    object.metadata = this.config.metadata.map((el) => {
      let element = Object.assign({}, el);
      element.mode = el.mode;
      return element;
    });
    return object;
  }

  public addObject(e): void {
    e.preventDefault();
    e.stopPropagation();
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
      this.open('update', undefined, object);
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

  public open(type, e = undefined, object = undefined): void {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!this.checkPermission(type) && this.config.endpoint) {
      return;
    }
    this.modalData = {};
    this.modalData.type = type;
    this.modalData.title = this.config.templateOptions.label;
    this.modalData.endpoint = object && object.endpoint || this.config.endpoint;
    if (object && object.endpoint) {
      this.modalData.edit = true;
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
            value: this.config.prefilled[el],
            read_only: true
          }
        };
      });
    }
    this.modalRef = this.modalService.open(this.modal, {size: 'lg'});
  }

  public openAutocomplete(): void {
    if (this.hideAutocomplete === true) {
      this.searchValue = null;
      this.generateList(this.searchValue);
      setTimeout(() => {
        this.searchElement.nativeElement.focus();
      }, 50);
    }
  }

  public generateList(value, concat = false): void {
    this.hideAutocomplete = false;
    if (this.config.useOptions) {
      if (this.searchValue) {
        this.filter(this.searchValue);
      } else {
        const formatString = new FormatString();
        this.config.options.forEach((el) => {
          el.__str__ = formatString.format(this.display, el);
        });
        this.list = this.config.options
          .filter((el) => !(this.results.indexOf(el) > -1))
          .sort((p, n) => p.__str__ > n.__str__ ? 1 : -1);
        this.generatePreviewList(this.list);
      }
    } else {
      this.getOptions(value, this.lastElement, concat);
    }
  }

  public generatePreviewList(list) {
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
            let existInConfig = val.toLowerCase().indexOf(value.toLowerCase()) > -1;
            if (existInConfig) {
              return this.results.indexOf(el) === -1;
            }
          }
        });
        this.list = filteredList;
        this.generatePreviewList(this.list);
      }
    } else {
      this.generateList(value);
    }
  }

  public setValue(item) {
    const formatString = new FormatString();
    if (item) {
      if (this.config.many) {
        this.results.push(item);
        this.updateData();
      } else {
        this.displayValue = formatString.format(this.display, item);
        this.group.get(this.key).patchValue(item[this.param]);
      }
    } else {
      this.displayValue = '';
      this.group.get(this.key).patchValue(undefined);
    }
    this.changeList();
    this.eventHandler({type: 'change'}, item && item[this.param]);
    this.searchValue = null;
    this.list = null;
    this.count = null;
    this.previewList = null;
    this.cd.detectChanges();
  }

  public deleteItem(index: number, item: any, api: boolean) {
    if (api) {
      this.genericFormService.delete(this.config.endpoint, item[this.param], 'delete')
        .subscribe(() => {
          if (this.results[index]) {
            this.results.splice(index, 1);
            this.changeList();
          }
        });
    } else {
      if (this.results[index]) {
        this.results.splice(index, 1);
        this.changeList();
        this.updateData();
      }
    }
  }

  public eventHandler(e, value) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value
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
      this.group.get(this.key).patchValue(e.data[this.param]);
      this.config.value = e.data[this.param];
      this.displayValue = formatString.format(this.display, e.data);
      this.eventHandler({type: 'change'}, e.data[this.param]);
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
        query += `${el}=${format.format(queries[el], this.formData)}&`;
      });
      query = query.slice(0, query.length - 1);
    }
    return query.length > 1 ? query : '';
  }

  public getOptions(value, offset, concat = false, callback?, id?, customQuery?) {
    let endpoint = this.config.endpoint;
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
    if (!this.count || (this.count && offset < this.count && concat)) {
      this.lastElement += this.limit;
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

            callback.call(this, (target || res.results[0]));
          }
        }
      );
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
    } else if (this.relatedAutocomplete && this.relatedAutocomplete.related && this.checkExistKey(this.relatedAutocomplete.related, key)) { //tslint:disable-line
      result = this.checkShowRules(this.relatedAutocomplete.related, data);
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
}
