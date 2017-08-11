import { FilterService } from './../../services/filter.service';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  public isCollapsed: boolean = true;

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
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    let data = this.fs.getQueries(this.config.listName, this.config.key);
    if (data) {
      if (data.byQuery) {
        this.count = 1;
        this.parseQuery(data.query);
      } else {
        let counts = data.map((el) => el.id);
        this.elements.push(...data);
        this.count = Math.max(...counts);
        this.genericQuery(this.elements, this.config.query);
      }
    } else {
      this.count = 1;
      this.elements.push(this.createElement(this.count));
    }
    this.route.queryParams.subscribe(
      (params) => this.updateFilter()
    );
    this.isCollapsed = this.query ? false : true;
  }

  public generateList(item): void {
    this.list = this.config.options
      .sort((p, n) => p[this.config.data.value] > n[this.config.data.value] ? 1 : -1);
    this.generatePreviewList(this.list, item);
  }

  public generatePreviewList(list, item) {
    item.lastElement += this.limit;
    this.previewList = list.slice(0, item.lastElement);
  }

  public openAutocomplete($event, item) {
    if (this.config.options) {
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
  }

  public resetList(item) {
    setTimeout(() => {
      this.list = null;
      this.previewList = null;
      item.lastElement = 0;
      item.hideAutocomplete = true;
    }, 150);
  }

  public filter(value, item) {
    item.lastElement = 0;
    let filteredList;
    if (value) {
      filteredList = this.config.options.filter((el) => {
        let val = el[this.config.data.value];
        if (val) {
          return val.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }
      });
      this.list = filteredList;
      this.generatePreviewList(this.list, item);
    } else {
      this.generateList(item);
    }
  }

  public onModalScrollDown(item) {
    this.generatePreviewList(this.list, item);
  }

  public setValue(value, item) {
    item.data = value[this.config.data.key];
    this.searchValue = null;
    this.list = null;
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

  public getValueByKey(key) {
    if (this.config.options) {
      let value = this.config.options.filter((el) => el[this.config.data.key] === key)[0];
      if (value) {
        return value[this.config.data.value];
      }
    }
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
    return {
      id,
      data,
      lastElement: 0,
      hideAutocomplete: true
    };
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
      this.elements.length = 1;
      this.elements[0].data = '';
    }
  };

  public resetFilter() {
    this.elements.length = 1;
    this.deleteValue(this.elements[0]);
    this.fs.generateQuery('', this.config.key, this.config.listName);
    this.changeQuery();
  }

}
