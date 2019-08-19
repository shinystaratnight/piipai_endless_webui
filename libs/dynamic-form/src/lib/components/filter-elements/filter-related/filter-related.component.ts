import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GenericFormService, FilterService } from '../../../services';
import { SiteSettingsService } from '@webui/core';
import { FormatString } from '@webui/utilities';

import { Subscription } from 'rxjs';
import { debounceTime, skip, filter } from 'rxjs/operators';

@Component({
  selector: 'app-filter-related',
  templateUrl: 'filter-related.component.html'
})
export class FilterRelatedComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public config: any;
  public data: any;
  public item: any;
  public query: string;
  public isCollapsed = false;

  public searchValue: string;

  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;
  public skipScroll = false;

  public list: any[];
  public limit = 10;
  public previewList: any[];
  public topHeight: number;

  public settingValue = true;

  public defaultValue: any;
  public theme: string;
  public multiple: boolean;
  public selected: any[];
  public selectedValues: any[];

  public chashValues: any[];

  public icons = {
    r3sourcer: {
      true: 'chevron-right',
      false: 'chevron-down'
    },
    default: {
      true: 'eye',
      false: 'eye-slash'
    }
  };

  public cashResults: any[];
  public subscription: Subscription;
  public filterSubscription: Subscription;
  public querySubscription: Subscription;

  @ViewChild('search', { static: false })
  public search;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute,
    private genericFormService: GenericFormService,
    private elementRef: ElementRef,
    private siteSettingsService: SiteSettingsService,
  ) {}

  public ngOnInit() {
    this.multiple = this.config.multiple;
    if (this.multiple) {
      this.limit = -1;
    }
    this.querySubscription = this.route.queryParams.subscribe(
      () => this.updateFilter()
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
        .pipe (
          skip(2),
          filter((value) => value !== null),
          debounceTime(400)
        )
        .subscribe(() => {
          this.filter();
        });
    }
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.querySubscription.unsubscribe();
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
      const target = $event.target;

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
        if (!this.multiple && autocomplete) {
          autocomplete.children[1].scrollTo({ top: 0 });
          autocomplete.children[0].focus();
        }
      }, 150);
  }

  public resetList() {
    setTimeout(() => {
      if (this.previewList && this.item) {
        this.previewList.length = 0;
        this.item.lastElement = 0;
        this.item.count = null;
        this.item.hideAutocomplete = true;
      }
    }, 150);
  }

  public filter() {
    if (!this.multiple) {
      this.item.lastElement = 0;
      this.item.count = null;
      this.generateList();
    } else {
      let filteredList;
      if (this.searchValue && this.chashValues) {
        filteredList = this.chashValues.filter((el) => {
          const val = el[this.config.data.value];
          if (val) {
            return val.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1;
          }
        });
        this.previewList = filteredList;
      } else {
        this.previewList = this.chashValues;
      }
    }
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
      this.item.displayValue = this.getValue(value, this.config.data.value);
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
    const element = {
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
      list: this.config.listName,
      key: this.config.query,
      value: this.item
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
  }

  public updateFilter() {
    const data = this.fs.getQueries(this.config.listName, this.config.key);
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
  }

  public resetFilter() {
    this.query = '';
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

    if (this.config.data.endpoint.includes('{')) {
      const formatString = new FormatString();
      endpoint =
        formatString.format(this.config.data.endpoint, this.siteSettingsService.settings);
      endpoint += `&number=${value}`;
      this.genericFormService.getAll(endpoint).subscribe(
        (res: any) => {
          if (res.results) {
            this.item.displayValue = this.getValue(res.results[0], this.config.data.value);
          }
        }
      );
    } else {
      const index = this.config.data.endpoint.indexOf('?');
      if (index !== -1) {
        endpoint = this.config.data.endpoint.slice(0, index)
          + `${value}/`
          + this.config.data.endpoint.slice(index);
      } else {
        endpoint = `${this.config.data.endpoint}${value}/`;
      }
      const display = this.config.data.value;
      this.genericFormService.getAll(endpoint).subscribe(
        (res: any) => {
          this.item.displayValue = res[display];
        }
      );
    }

  }

  public getOptions(value, concat = false) {
    const formatString = new FormatString();
    const endpoint =
      this.config.data.endpoint.includes('{')
      ? formatString.format(this.config.data.endpoint, this.siteSettingsService.settings)
      : this.config.data.endpoint;
    const offset = this.item.lastElement;
    let query = '';

    if (value) {
      query += endpoint.indexOf('?') === -1 ? `?search=${value}` : `&search=${value}`;
    }
    query += !query && endpoint.indexOf('?') === -1 ? '?' : '&';
    query += `&limit=${this.limit}&offset=${offset}`;
    query += this.generateFields(this.config.data);
    if (!this.item.count || (this.item.count && offset < this.item.count && concat)) {
      this.item.lastElement += this.limit;
      this.genericFormService.getByQuery(endpoint, query).subscribe(
        (res: any) => {
          this.skipScroll = false;
          this.item.count = res.count;
          if (res.results) {
            if (concat) {
              if (this.previewList) {
                res.results.forEach((el) => {
                  if (el) {
                    el.__str__ = this.getValue(el, this.config.data.value);
                  }
                });

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
              res.results.forEach((el) => {
                if (el) {
                  el.__str__ = this.getValue(el, this.config.data.value);
                }
              });

              this.previewList = res.results;
            }
          }
        }
      );
    } else {
      this.skipScroll = false;
    }
  }

  public getValue(data: any, value) {
    let result;

    if (Array.isArray(value)) {
      value.forEach((el) => {
        result = result ? result : data[el];
      });
    } else {
      result = data[value];
    }

    return result;
  }

  public generateFields(data: any): string {
    let query = '&';
    query += `fields=${data.key}&`;

    if (Array.isArray(data.value)) {
      data.value.forEach((el) => {
        query += `fields=${el}&`;
      });
    } else {
      query += `fields=${data.value}&`;
    }

    return query;
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
        this.searchValue = '';
        return;
      }
    }
  }

}
