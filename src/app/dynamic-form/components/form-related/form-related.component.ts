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
    implements OnInit {

  @ViewChild('search')
  public search;

  public config;
  public group: FormGroup;
  public errors: any;
  public message: any;
  public key: any;
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

  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;

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
        let value;
        if (this.config.value instanceof Object) {
          if (this.config.options) {
            this.displayValue = this.config.options.filter((el) => {
              return el[this.param] === this.config.value[this.param];
            })[0][this.display];
          }
          value = this.config.value[this.param];
        } else {
          value = this.config.value;
        }
        this.group.get(this.key).patchValue(value);
      } else {
        if (this.config.options) {
          this.results = this.config.options.filter((el) => {
            return this.config.value.indexOf(el[this.param]) > -1;
          });
        } else {
          this.results = this.config.value;
        }
        this.updateData();
      }
    }
  }

  public onModalScrollDown() {
    this.generatePreviewList(this.list);
  }

  public openAutocomplete() {
    if (this.config.options) {
      this.searchValue = null;
      this.hideAutocomplete = false;
      this.generateList();
      setTimeout(() => {
        this.search.nativeElement.focus();
      }, 50);
    }
  }

  public generateList(): void {
    if (this.config.options) {
      this.hideAutocomplete = false;
      if (this.searchValue) {
        this.filter(this.searchValue);
      } else {
        this.list = this.config.options
          .filter((el) => !(this.results.indexOf(el) > -1))
          .sort((p, n) => p[this.display] > n[this.display] ? 1 : -1);
        this.generatePreviewList(this.list);
      }
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
      if (!this.config.many) {
        this.searchValue = null;
      }
    }, 150);
  }

  public filter(value) {
    this.lastElement = 0;
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
        this.generatePreviewList(this.list);
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
        if (this.config.many) {
          this.results.push(element);
          this.updateData();
        } else {
          this.displayValue = item[this.display];
          this.group.get(this.key).patchValue(item[this.param]);
        }
        this.changeList();
      }
      this.eventHandler({type: 'change'});
    }
    this.searchValue = null;
    this.list = null;
    this.previewList = null;
  }

  public deleteItem(index) {
    if (this.results[index]) {
      this.results.splice(index, 1);
      this.changeList();
      this.updateData();
    }
  }

  public eventHandler(e) {
    this.event.emit({
      type: e.type,
      el: this.config,
      value: this.config.options.filter((el) => el.id === this.group.get(this.key).value)
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
}
