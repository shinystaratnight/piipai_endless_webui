import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';

import { GenericFormService } from './../../services/generic-form.service';
import { FilterService } from './../../services/filter.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/skip';

@Component({
  selector: 'filter-related',
  templateUrl: 'filter-related.component.html'
})
export class FilterRelatedComponent implements OnInit, AfterViewInit, OnDestroy {
  public config: any;
  public data: any;
  // public elements = [];
  // public count: number;
  public item: any;
  public query: string;
  // public copyConfig = [];
  public isCollapsed: boolean = false;

  public searchValue: string;

  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;

  public list: any[];
  public limit: number = 10;
  public previewList: any[];
  public topHeight: number;

  public settingValue: boolean = true;

  public defaultValue: any;
  public theme: string;
  public multiple: boolean;
  public selected: any[];

  public chashValues: any[];

  public icons = {
    r3sourcer: {
      true: 'angle-right',
      false: 'angle-down'
    },
    default: {
      true: 'eye',
      false: 'eye-slash'
    }
  };

  public cashResults: any[];
  public subscription: Subscription;

  @ViewChild('search')
  public search;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute,
    private genericFormService: GenericFormService
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => this.updateFilter()
    );
    this.isCollapsed = this.query || document.body.classList.contains('r3sourcer') ? false : true;
    this.defaultValue = {
      [this.config.data.key]: '',
      [this.config.data.value]: 'All'
    };
    this.theme = document.body.classList.contains('r3sourcer') ? 'r3sourcer' : 'default';
    this.multiple = this.config.multiple;

    // this.item = this.createElement();
  }

  public ngAfterViewInit() {
    if (this.search) {
      this.subscription = this.search.valueChanges
        .skip(1)
        .debounceTime(400)
        // .distinctUntilChanged()
        .subscribe((res) => {
          this.filter();
        });
    }
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public generateList(concat = false): void {
    if (this.multiple) {
      if (!this.chashValues) {
        this.getOptions(this.searchValue, concat);
      }
    } else {
      this.getOptions(this.searchValue, concat);
    }
  }

  public generatePreviewList(list) {
    this.item.lastElement += this.limit;
    this.previewList = list.slice(0, this.item.lastElement);
  }

  public openAutocomplete($event) {
      if (this.multiple && !this.item.hideAutocomplete) {
        this.item.hideAutocomplete = true;
        return;
      }
      let autocomplete;
      let target = $event.target;

      this.searchValue = null;
      this.item.hideAutocomplete = false;
      this.generateList();
      if (target.classList.contains('autocomplete-value')) {
        this.topHeight = target.offsetHeight + 1;
        autocomplete = target.nextElementSibling;
      } else {
        this.topHeight = target.parentElement.offsetHeight + 1;
        autocomplete = target.parentElement.nextElementSibling;
      }
      setTimeout(() => {
        if (!this.multiple) {
          autocomplete.children[0].focus();
        }
      }, 50);
  }

  public resetList() {
    setTimeout(() => {
      this.previewList.length = 0;
      this.item.lastElement = 0;
      this.item.count = null;
      this.item.hideAutocomplete = true;
    }, 150);
  }

  public filter() {
    this.item.lastElement = 0;
    this.item.count = null;
    // this.previewList = null;
    this.generateList();
  }

  public onModalScrollDown() {
    if (!this.multiple) {
      this.generateList(true);
    }
  }

  public setValue(value, list?) {
    if (this.multiple) {
      this.selected = list.filter((item) => item.checked);
      // if (this.item.data) {
      //   this.item.data.push(value[this.config.data.key]);
      // } else {
      //   this.item.data = [value[this.config.data.key]];
      // }
      this.item.data = this.selected.map((el) => el[this.config.data.key]);
      this.item.displayValue = this.selected.length
        ? `Selected ${this.selected.length} ${this.config.label}`
        : `Select ${this.config.label}`;
      this.onChange();
    } else {
      this.item.data = value[this.config.data.key];
      this.item.displayValue = value[this.config.data.value];
      this.item.count = null;
      this.item.hideAutocomplete = true;
      this.searchValue = null;
      this.previewList.length = 0;
      this.onChange();
    }
  }

  public deleteValue() {
    if (this.multiple) {
      this.resetAll(this.previewList || []);
      return;
    } else {
      this.item.data = '';
      this.item.displayValue = 'All';
    }
    // this.fs.generateQuery(
    //   this.genericQuery(this.config.query),
    //   this.config.key, this.config.listName, this.item);
    // this.changeQuery();
  }

  // public addElement() {
  //   if (this.elements.length < this.config.options.length) {
  //     this.elements.push(this.createElement(this.count));
  //   }
  // }

  // public deleteElement(item = this.elements[0]) {
  //   if (this.elements.length > 1) {
  //     let result = this.elements.filter((el) => el.id !== item.id);
  //     this.elements = result;
  //   }
  //   this.fs.generateQuery(
  //     this.genericQuery(this.elements, this.config.query),
  //     this.config.key, this.config.listName, this.elements);
  //   this.changeQuery();
  // }

  public createElement(data?: any) {
    // this.count++;
    let element = {
      data,
      lastElement: 0,
      hideAutocomplete: true
    };
    element['displayValue'] = data ? this.getOption(data) : 'All';
    return element;
  }

  public onChange() {
    this.fs.generateQuery(
      this.genericQuery(this.config.query),
      this.config.key, this.config.listName, this.item);
    this.changeQuery();
  }

  public genericQuery(query) {
    let result = '';
    if (Array.isArray(this.item.data)) {
      this.item.data.forEach((el) => {
        result += `${query}=${el}&`;
      });
    } else {
      result = `${query}=${this.item.data}&`;
    }
    // elements.forEach((el) => {
    //   if (el.data) {
    //     result += `${query}=${el.data}&`;
    //   }
    // });
    // this.item
    this.query = result;
    return result.substring(0, result.length - 1);
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName
    });
  }

  public parseQuery(query) {
    this.query = query;
    const queries = query.split('&');
    const selected = queries.length;
    let data = queries.length && [];
    queries.forEach((el, i) => {
      if (queries.length) {
        data.push(el.split('=')[1]);
      } else {
        data = el.split('=')[1];
      }
    });
    if (!this.item) {
      this.item = this.createElement(data);
    }
  };

  public updateFilter() {
    let data = this.fs.getQueries(this.config.listName, this.config.key);
    if (data) {
      if (data.byQuery) {
        if (this.settingValue) {
          this.settingValue = false;
          // this.elements = [];
          this.parseQuery(data.query);
        }
      } else {
        if (this.settingValue) {
          this.settingValue = false;
          // this.elements = [];
          // let counts = data.map((el) => el.id);
          // this.elements.push(...data);
          // this.count = Math.max(...counts);
          this.item = data;
          this.genericQuery(this.config.query);
        }
      }
    } else {
      this.query = '';
      if (!this.item) {
        this.item = this.createElement();
      }
      this.deleteValue();
      // this.count = 1;
      // if (this.elements && !this.elements.length) {
      //   this.elements.push(this.createElement(this.count));
      // }
    }
  };

  public resetFilter() {
    // this.elements.length = 1;
    this.deleteValue();
    this.fs.generateQuery('', this.config.key, this.config.listName, this.item);
    this.changeQuery();
  }

  public getOption(value) {
    if (this.multiple) {
      this.selected = value;
      return `Selected ${value.length} ${this.config.label}`;
    }
    let endpoint = `${this.config.data.endpoint}${value}/`;
    let display = this.config.data.value;
    this.genericFormService.getAll(endpoint).subscribe(
      (res: any) => {
        this.item.displayValue = res[display];
      }
    );
  }

  public getOptions(value, concat = false) {
    let endpoint = this.config.data.endpoint;
    let offset = this.item.lastElement;
    let display = this.config.data.value;
    let key = this.config.data.key;
    let query = '';

    if (value) {
      query += `?search=${value}&`;
    }
    query += !query ? '?' : '';
    query += `limit=${this.limit}&offset=${offset}&fields=${display}&fields=${key}`;
    if (!this.item.count || (this.item.count && offset < this.item.count && concat)) {
      this.item.lastElement += this.limit;
      this.genericFormService.getByQuery(endpoint, query).subscribe(
        (res: any) => {
          this.item.count = res.count;
          if (res.results) {
            if (concat) {
              if (this.previewList) {
                this.previewList.push(...res.results);
              }
            } else {
              if (!this.chashValues && this.multiple) {
                if (this.selected) {
                  res.results.forEach((el) => {
                    if (this.selected.indexOf(el[this.config.data.key]) > -1) {
                      el.checked = true;
                    }
                  });
                }
                this.chashValues = res.results;
                this.previewList = this.chashValues;
                return;
              }
              this.previewList = res.results;
            }
          }
        }
      );
    }
  }

  public selectAll(list) {
    list.forEach((el) => {
      el.checked = true;
    });
    this.setValue(null, list);
  }

  public resetAll(list) {
    list.forEach((el) => {
      el.checked = false;
    });
    this.setValue(null, list);
  }

}
