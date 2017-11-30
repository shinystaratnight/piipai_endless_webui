import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentChecked,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BasicElementComponent } from './../basic-element/basic-element.component';

import { GenericFormService } from './../../services/generic-form.service';
import { CheckPermissionService } from '../../../shared/services/check-permission';
import { Field } from '../../models/field.model';

interface RelatedObject {
  id: string;
  allData: any;
  data: FormGroup;
  metadata: Field[];
}

@Component({
  selector: 'form-related',
  templateUrl: 'form-related.component.html'
})

export class FormRelatedComponent
  extends BasicElementComponent
    implements OnInit, OnDestroy, AfterContentChecked {

  @ViewChild('search')
  public search;

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

  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;
  public count: number;

  public dataOfList: any;
  public isCollapsed: boolean = false;

  public replaceElements: any = [];

  public listElement: Field;

  public viewMode: boolean;

  public skillEndpoint: boolean;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private genericFormService: GenericFormService,
    private permission: CheckPermissionService
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.skillEndpoint = this.config.endpoint === '/ecore/api/v2/skills/skillbaserates/' ||
      this.config.endpoint === '/ecore/api/v2/pricing/pricelistrates/';
    this.display =
      this.config.templateOptions.display ? this.config.templateOptions.display : '__str__';
    this.param = this.config.templateOptions.param ? this.config.templateOptions.param : 'id';
    this.setInitValue();
    this.checkModeProperty();
    this.checkHiddenProperty();
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
  }

  public checkHiddenProperty() {
    if (this.config && this.config.hidden) {
      this.config.hidden.subscribe((hide) => {
        if (hide) {
          this.config.hide = hide;
          this.displayValue = null;
          this.group.get(this.key).patchValue(undefined);
          this.setInitValue();
        } else {
          this.config.hide = hide;
        }
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

  public setInitValue() {
    this.results = [];
    if (this.config.value || this.group.get(this.key).value) {
      let data = this.config.value ? this.config.value :
        this.group.get(this.key).value;
      if (!this.config.many) {
        let value;
        if (data instanceof Object) {
          if (this.config.options && this.config.options.length) {
            this.displayValue = this.config.options.filter((el) => {
              return el[this.param] === data[this.param];
            })[0][this.display];
          } else if (data[this.display]) {
            this.displayValue = data[this.display];
          }
          value = data[this.param];
        } else {
          value = data;
          if (this.config.options && this.config.options.length) {
            this.displayValue = this.config.options.filter((el) => {
              return el[this.param] === data;
            })[0][this.display];
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
            this.results = results;
          });
        } else {
          this.results = data;
        }
        this.updateData();
      }
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

  public ngAfterContentChecked() {
    if (this.tableWrapper) {
      this.checkOverfow();
    }
  }

  public checkOverfow(): void {
    if (this.config.metadata) {
      let width = this.tableWrapper.nativeElement.offsetWidth;
      let count = this.config.metadata.length;
      if ((width / count) < 150) {
        this.tableWrapper.nativeElement.style.overflowX = 'auto';
      } else {
        this.tableWrapper.nativeElement.style.overflowX = 'visible';
      }
    }
  };

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
      this.open('edit', undefined, object);
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
    this.generateList(this.searchValue, true);
  }

  public deleteElement(closeModal): void {
    closeModal();
    this.event.emit({
      type: 'delete',
      endpoint: this.modalData.endpoint,
      id: this.modalData.id
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
    this.modalData = {};
    this.modalData.type = type;
    this.modalData.title = this.config.templateOptions.label;
    this.modalData.endpoint = this.config.endpoint;
    if (type === 'edit' || type === 'delete') {
      if (object) {
        this.modalData.title = object.allData[this.display];
        this.modalData.id = object[this.param];
      } else {
        this.modalData.title = this.displayValue;
        this.modalData.id = this.group.get(this.key).value;
      }
      if (type === 'edit') {
        this.modalData.mode = 'edit';
      }
    }
    if (this.modalData.id && type !== 'delete') {
      this.permission.updateCheck(this.modalData.endpoint, this.modalData.id)
        .subscribe(
          (res: any) => this.modalRef = this.modalService.open(this.modal, {size: 'lg'})
        );
    } else if (type !== 'delete') {
      this.permission.createCheck(this.modalData.endpoint)
        .subscribe(
          (res: any) => this.modalRef = this.modalService.open(this.modal, {size: 'lg'})
        );
    } else {
      this.modalRef = this.modalService.open(this.modal, {size: 'lg'});
    }
  }

  public openAutocomplete(): void {
      this.searchValue = null;
      this.hideAutocomplete = false;
      this.generateList(this.searchValue);
      setTimeout(() => {
        this.search.nativeElement.focus();
      }, 50);
  }

  public generateList(value, concat = false): void {
    if (this.config.useOptions) {
      this.hideAutocomplete = false;
      if (this.searchValue) {
        this.filter(this.searchValue);
      } else {
        this.list = this.config.options
          .filter((el) => !(this.results.indexOf(el) > -1))
          .sort((p, n) => p[this.display] > n[this.display] ? 1 : -1);
        this.generatePreviewList(this.list);
      }
    } else {
      this.hideAutocomplete = false;
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
      if (!this.config.many) {
        this.searchValue = null;
      }
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
          let val = el[this.display];
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
    if (this.config.many) {
      this.results.push(item);
      this.updateData();
    } else {
      this.displayValue = item[this.display];
      this.group.get(this.key).patchValue(item[this.param]);
    }
    this.changeList();
    this.eventHandler({type: 'change'}, item[this.param]);
    this.searchValue = null;
    this.list = null;
    this.count = null;
    this.previewList = null;
    this.errors = null;
    this.message = null;
  }

  public deleteItem(index) {
    if (this.results[index]) {
      this.results.splice(index, 1);
      this.changeList();
      this.updateData();
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
      list: this.results
    });
  }

  public updateData() {
    let results = this.results.map((el) => {
      return el[this.param];
    });
    this.group.get(this.key).patchValue(results);
  }

  public formEvent(e, closeModal, type) {
    if (e.type === 'sendForm' && e.status === 'success' && !this.config.list) {
      closeModal();
      this.group.get(this.key).patchValue(e.data[this.param]);
      this.config.value = e.data[this.param];
      this.displayValue = e.data[this.display];
      this.eventHandler({type: 'change'}, e.data[this.param]);
    } else if (e.type === 'sendForm' && e.status === 'success' && this.config.list) {
      closeModal();
      this.updateList();
    }
  }

  public updateList() {
    this.event.emit({
      type: 'updateData',
      el: this.config
    });
  }

  public getOptions(value, offset, concat = false) {
    let endpoint = this.config.endpoint;
    let query = '';
    if (value) {
      query += `?search=${value}&`;
    }
    query += !query ? '?' : '';
    query += `limit=${this.limit}&offset=${offset}&fields=${this.display}&fields=${this.param}`;
    if (!this.count || (this.count && offset < this.count && concat)) {
      this.lastElement += this.limit;
      this.genericFormService.getByQuery(endpoint, query).subscribe(
        (res: any) => {
          this.count = res.count;
          if (res.results && res.results.length) {
            if (concat) {
              this.previewList.push(...res.results);
            } else {
              this.previewList = res.results;
            }
          }
        }
      );
    }
  }
}
