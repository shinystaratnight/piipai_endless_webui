import { FilterService } from './../../services/filter.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService
  ) {}

  public ngOnInit() {
    this.count = 1;
    this.elements.push(this.createElement(this.count));
  }

  public deleteValue(item) {
    item.data = null;
    this.updateOptions(this.config.options);
    this.fs.generateQuery(
      this.genericQuery(this.elements, this.config.query), this.config.key, this.config.listName);
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
    this.updateOptions(this.config.options);
    this.fs.generateQuery(
      this.genericQuery(this.elements, this.config.query), this.config.key, this.config.listName);
    this.changeQuery();
  }

  public createElement(id) {
    this.count++;
    return {
      id,
      data: ''
    };
  }

  public onChange() {
    this.updateOptions(this.config.options);
    this.fs.generateQuery(
      this.genericQuery(this.elements, this.config.query), this.config.key, this.config.listName);
    this.changeQuery();
  }

  public genericQuery(elements, query) {
    let result = '';
    elements.forEach((el) => {
      if (el.data) {
        result += `${query}=${el.data}&`;
      }
    });
    return result.substring(0, result.length - 1);
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName
    });
  }

  public updateOptions(options) {
    this.refreshOptions(options);
    options.forEach((el) => {
      this.elements.forEach((prop) => {
        if (prop.data === el.id) {
          el.disabled = true;
        }
      });
    });
  }

  public refreshOptions(options) {
    options.forEach((el) => {
      if (el.disabled) {
        el.disabled = false;
      }
    });
  }

}
