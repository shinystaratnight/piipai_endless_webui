import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GenericFormService } from './../../services/generic-form.service';
import { FilterService } from './../../services/filter.service';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'filter-related',
  templateUrl: 'filter-related.component.html'
})
export class FilterRelatedComponent implements OnInit, AfterViewInit, OnDestroy {
  public config: any;
  public data: any;
  public item: any;
  public query: string;
  public isCollapsed: boolean = false;

  public searchValue: string;

  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;
  public skipScroll = false;

  public list: any[];
  public limit: number = 10;
  public previewList: any[];
  public topHeight: number;

  public settingValue: boolean = true;

  public defaultValue: any;
  public theme: string;
  public multiple: boolean;
  public selected: any[];
  public selectedValues: any[];

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
  public filterSubscription: Subscription;

  @ViewChild('search')
  public search;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute,
    private genericFormService: GenericFormService,
    private elementRef: ElementRef
  ) {}

  public ngOnInit() {
    this.multiple = this.config.multiple;
    if (this.multiple) {
      this.limit = -1;
    }
    this.route.queryParams.subscribe(
      (params) => this.updateFilter()
    );
    this.filterSubscription = this.fs.reset.subscribe(() => this.updateFilter());
    this.isCollapsed = this.query || document.body.classList.contains('r3sourcer') ? false : true;
    this.defaultValue = {
      [this.config.data.key]: '',
      [this.config.data.value]: this.multiple ? `Select ${this.config.label}` : 'All'
    };
    this.theme = document.body.classList.contains('r3sourcer') ? 'r3sourcer' : 'default';
  }

  public ngAfterViewInit() {
    if (this.search) {
      this.subscription = this.search.valueChanges
        .skip(2)
        .filter((value) => value !== null)
        .debounceTime(400)
        .subscribe((res) => {
          this.filter();
        });
    }
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.filterSubscription.unsubscribe();
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
    this.generateList();
  }

  public onModalScrollDown() {
    if (!this.multiple) {
      if (!this.skipScroll) {
        this.skipScroll = true;
        this.generateList(true);
      }
    }
  }

  public setValue(value, list?) {
    if (this.multiple) {
      this.selected = list.filter((item) => item.checked);
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
  }

  public createElement(data?: any) {
    let element = {
      data,
      lastElement: 0,
      hideAutocomplete: true
    };
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
      this.item['displayValue'] = data ? this.getOption(data) : 'All';
    }
  };

  public updateFilter() {
    let data = this.fs.getQueries(this.config.listName, this.config.key);
    if (data) {
      if (data.byQuery) {
        if (this.settingValue) {
          this.settingValue = false;
          this.parseQuery(data.query);
        }
      } else {
        if (this.settingValue) {
          this.settingValue = false;
          this.item = data;
          this.genericQuery(this.config.query);
        }
      }
    } else {
      this.query = '';
      if (!this.item) {
        this.item = this.createElement();
        if (this.multiple) {
          this.item.displayValue = `Select ${this.config.label}`;
        } else {
          this.item.displayValue = data ? this.getOption(data) : 'All';
        }
      }

      if (this.item && !this.multiple) {
        this.item.data = '';
        this.item.displayValue = 'All';
      } else if (this.previewList) {
        this.previewList.forEach((el) => {
          el.checked = false;
        });
        this.selected = this.previewList.filter((item) => item.checked);
        this.item.data = this.selected.map((el) => el[this.config.data.key]);
        this.item.displayValue = this.selected && this.selected.length
          ? `Selected ${this.selected.length} ${this.config.label}`
          : `Select ${this.config.label}`;
      }
    }
  };

  public resetFilter() {
    this.deleteValue();
    this.fs.generateQuery('', this.config.key, this.config.listName, this.item);
    this.changeQuery();
  }

  public getOption(value) {
    if (this.multiple) {
      this.selected = value;
      this.getOptions(this.searchValue);
      return `Selected ${value.length} ${this.config.label}`;
    }
    let endpoint;
    const index = this.config.data.endpoint.indexOf('?');
    if (index !== -1) {
      endpoint = this.config.data.endpoint.slice(0, index)
        + `${value}/`
        + this.config.data.endpoint.slice(index);
    } else {
      endpoint = `${this.config.data.endpoint}${value}/`;
    }
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
      query += endpoint.indexOf('?') === -1 ? `?search=${value}` : `&search=${value}`;
    }
    query += !query && endpoint.indexOf('?') === -1 ? '?' : '&';
    query += `limit=${this.limit}&offset=${offset}&fields=${display}&fields=${key}`;
    if (!this.item.count || (this.item.count && offset < this.item.count && concat)) {
      this.item.lastElement += this.limit;
      this.genericFormService.getByQuery(endpoint, query).subscribe(
        (res: any) => {
          this.skipScroll = false;
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
                this.selected = this.filterSelectedValues(this.previewList);
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

  public filterSelectedValues(list) {
    return list.filter((el) => this.selected && this.selected.indexOf(el.id) > -1);
  }

  public removeItem(item) {
    item.checked = false;
    this.setValue(item, this.previewList);
  }

  @HostListener('document:click', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      if (this.multiple && !this.item.hideAutocomplete) {
        this.item.hideAutocomplete = true;
        return;
      }
    }
  }

}
