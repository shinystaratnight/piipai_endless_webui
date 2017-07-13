import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasicElementComponent } from './../basic-element/basic-element.component';

@Component({
  selector: 'form-related',
  templateUrl: 'form-related.component.html'
})

export class FormRelatedComponent
  extends BasicElementComponent
    implements OnInit, AfterViewInit {
  @ViewChild('related')
  public related;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
  public display: string;
  public param: string;
  public list: any[];
  public results: any;
  public options: any[];
  public value: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) { super(); }

  public ngOnInit() {
    this.addControl(this.config, this.fb);
    this.display =
      this.config.templateOptions.display ? this.config.templateOptions.display : '__str__';
    this.param = this.config.templateOptions.param ? this.config.templateOptions.param : 'id';
    this.results = [];
    if (this.config.value) {
      if (!this.config.many) {
        this.group.get(this.key).patchValue(this.config.value);
      } else {
        this.results = this.config.value;
      }
    }
  }

  public ngAfterViewInit() {
    if (this.related) {
      this.addFlags(this.related, this.config);
    }
  }

  public generateList(): void {
    if (this.config.options) {
      this.list = this.config.options
        .filter((el) => !(this.results.indexOf(el) > -1))
        .sort((p, n) => p[this.display] > n[this.display] ? 1 : -1);
    }
  }

  public resetList() {
    this.list = null;
  }

  public filter(value) {
    let filteredList;
    if (value) {
      if (this.config.options) {
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
      }
    } else {
      this.generateList();
    }
  }

  public setValue(item) {
    let element = [].concat(
      this.config.options.filter((el) => el[this.display] === item[this.display]))[0];
    if (element) {
      let exist = this.results.indexOf(element) > -1;
      if (!exist) {
        this.results.push(element);
      }
    }
    this.value = null;
    this.list = null;
  }

  public deleteItem(index) {
    if (this.results[index]) {
      this.results.splice(index, 1);
    }
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.config.options.filter((el) => el.id === this.group.get(this.key).value)
    });
  }
}
