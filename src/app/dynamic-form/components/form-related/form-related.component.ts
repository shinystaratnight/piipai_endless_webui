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

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private genericFormService: GenericFormService
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.display =
      this.config.templateOptions.display ? this.config.templateOptions.display : '__str__';
    this.param = this.config.templateOptions.param ? this.config.templateOptions.param : 'id';
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
    this.generateDataForList(this.config);
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

  public checkOverfow() {
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

  public generateDataForList(config) {
    if (config.list && config.metadata) {
      this.dataOfList = [];
      let value = [];
      if (this.config.value) {
        this.config.value.forEach((el) => {
          let object = this.createObject();
          object['id'] = el.id;
          this.fillingForm(object.metadata, el, object.data);
          value.push(object.data.value);
          this.dataOfList.push(object);
        });
        this.group.get(this.key).patchValue(value);
      } else {
        let object = this.createObject();
        this.dataOfList.push(object);
      }
    }
  }

  public createObject() {
    let object = {
      data: this.fb.group({}),
      metadata: []
    };
    object.metadata = [].concat(this.config.metadata);
    return object;
  }

  public addObject(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.dataOfList) {
      let object = this.createObject();
      this.dataOfList.push(object);
    }
  }

  public deleteObject(object) {
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

  public updateValue(e) {
    let value = this.dataOfList.map((el) => {
      let object = el.data.value;
      if (el.id) {
        object.id = el.id;
      }
      return object;
    });
    this.group.get(this.key).patchValue(value);
  }

  public fillingForm(metadata, data, object) {
    metadata.forEach((el) => {
      if (el.key) {
        this.getValueOfData(data, el.key, object);
      } else if (el.children) {
        this.fillingForm(el.children, data, object);
      }
    });
  }

    public getValueOfData(data, key, obj) {
    let keys = key.split('.');
    let prop = keys.shift();
    if (keys.length === 0) {
      if (data) {
          obj.addControl(key, this.fb.control(data[key]));
      }
    } else {
      if (data[prop]) {
        obj.addControl(prop, this.fb.group({}));
        this.getValueOfData(data[prop], keys.join('.'), obj.get(prop));
      }
    }
  }

  public onModalScrollDown() {
    this.generateList(this.searchValue, true);
  }

  public deleteElement(closeModal) {
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

  public open(type, e = undefined, object = undefined) {
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
        this.modalData.title = object[this.display];
        this.modalData.id = object[this.param];
      } else {
        this.modalData.title = this.displayValue;
        this.modalData.id = this.group.get(this.key).value;
      }
    }
    this.modalRef = this.modalService.open(this.modal, {size: 'lg'});
  }

  public openAutocomplete() {
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

  public eventHandler(e, value = null) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: value ? value
        : this.config.options.filter((el) => el.id === this.group.get(this.key).value)
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
    if (e.type === 'sendForm' && e.status === 'success') {
      closeModal();
      this.group.get(this.key).patchValue(e.data[this.param]);
      this.config.value = e.data[this.param];
      this.event.emit({
        type: 'update',
        el: this.config,
        currentQuery: this.config.currentQuery
      });
      this.eventHandler({type: 'change'}, e.data[this.param]);
    }
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
