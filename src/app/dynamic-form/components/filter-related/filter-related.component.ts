import { FilterService } from './../../services/filter.service';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GenericFormService } from './../../services/generic-form.service';

@Component({
  selector: 'filter-related',
  templateUrl: 'filter-related.component.html'
})
export class FilterRelatedComponent implements OnInit {
  public config: any;
  public data: any;
  public elements = [];
  public count: number;
  public item: any;
  public query: string;
  public copyConfig = [];
  public isCollapsed: boolean = false;

  public searchValue: string;
  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;
  public list: any[];
  public limit: number = 10;
  public previewList: any[];
  public topHeight: number;

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
    this.isCollapsed = this.query ? false : true;
  }

  public generateList(item, concat = false): void {
      this.getOptions(this.searchValue, item, concat);
  }

  public generatePreviewList(list, item) {
    item.lastElement += this.limit;
    this.previewList = list.slice(0, item.lastElement);
  }

  public openAutocomplete($event, item) {
      let autocomplete;
      let target = $event.target;
      this.searchValue = null;
      item.hideAutocomplete = false;
      this.generateList(item);
      if (target.classList.contains('autocomplete-value')) {
        this.topHeight = target.offsetHeight;
        autocomplete = target.nextElementSibling;
      } else {
        this.topHeight = target.parentElement.offsetHeight;
        autocomplete = target.parentElement.nextElementSibling;
      }
      setTimeout(() => {
        autocomplete.children[0].focus();
      }, 50);
  }

  public resetList(item) {
    setTimeout(() => {
      this.previewList = null;
      item.lastElement = 0;
      item.count = null;
      item.hideAutocomplete = true;
    }, 150);
  }

  public filter(item) {
    item.lastElement = 0;
    item.count = null;
    this.previewList = null;
    this.generateList(item);
  }

  public onModalScrollDown(item) {
    this.generateList(item, true);
  }

  public setValue(value, item) {
    item.data = value[this.config.data.key];
    item.displayValue = value[this.config.data.value];
    item.count = null;
    this.searchValue = null;
    this.previewList = null;
    this.onChange();
  }

  public deleteValue(item) {
    item.data = '';
    this.fs.generateQuery(
      this.genericQuery(this.elements, this.config.query),
      this.config.key, this.config.listName, this.elements);
    this.changeQuery();
  }

  public addElement() {
    if (this.elements.length < this.config.options.length) {
      this.elements.push(this.createElement(this.count));
    }
  }

  public deleteElement(item) {
    if (this.elements.length > 1) {
      let result = this.elements.filter((el) => el.id !== item.id);
      this.elements = result;
    }
    this.fs.generateQuery(
      this.genericQuery(this.elements, this.config.query),
      this.config.key, this.config.listName, this.elements);
    this.changeQuery();
  }

  public createElement(id, data = '') {
    this.count++;
    let element = {
      id,
      data,
      lastElement: 0,
      hideAutocomplete: true
    };
    element['displayValue'] = data ? this.getOption(data, element) : this.config.label;
    return element;
  }

  public onChange() {
    this.fs.generateQuery(
      this.genericQuery(this.elements, this.config.query),
      this.config.key, this.config.listName, this.elements);
    this.changeQuery();
  }

  public genericQuery(elements, query) {
    let result = '';
    elements.forEach((el) => {
      if (el.data) {
        result += `${query}=${el.data}&`;
      }
    });
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
    query.split('&').forEach((el) => {
      let value = el.split('=')[1];
      this.elements.push(this.createElement(this.count, value));
    });
  };

  public updateFilter() {
    let data = this.fs.getQueries(this.config.listName, this.config.key);
    if (data) {
      if (data.byQuery) {
        this.elements = [];
        this.parseQuery(data.query);
      } else {
        this.elements = [];
        let counts = data.map((el) => el.id);
        this.elements.push(...data);
        this.count = Math.max(...counts);
        this.genericQuery(this.elements, this.config.query);
      }
    } else {
      this.query = '';
      this.count = 1;
      if (this.elements && !this.elements.length) {
        this.elements.push(this.createElement(this.count));
      }
    }
  };

  public resetFilter() {
    this.elements.length = 1;
    this.deleteValue(this.elements[0]);
    this.fs.generateQuery('', this.config.key, this.config.listName);
    this.changeQuery();
  }

  public getOption(value, item) {
    let endpoint = `${this.config.data.endpoint}${value}/`;
    let display = this.config.data.value;
    this.genericFormService.getAll(endpoint).subscribe(
      (res: any) => {
        item.displayValue = res[display];
      }
    );
  }

  public getOptions(value, item, concat = false) {
    let endpoint = this.config.data.endpoint;
    let offset = item.lastElement;
    let display = this.config.data.value;
    let key = this.config.data.key;
    let query = '';
    if (value) {
      query += `?search=${value}&`;
    }
    query += !query ? '?' : '';
    query += `limit=${this.limit}&offset=${offset}&fields=${display}&fields=${key}`;
    if (!item.count || (item.count && offset < item.count && concat)) {
      item.lastElement += this.limit;
      this.genericFormService.getByQuery(endpoint, query).subscribe(
        (res: any) => {
          item.count = res.count;
          if (res.results && res.results.length) {
            if (concat) {
              if (this.previewList) {
                this.previewList.push(...res.results);
              }
            } else {
              this.previewList = res.results;
            }
          }
        }
      );
    }
  }

}
