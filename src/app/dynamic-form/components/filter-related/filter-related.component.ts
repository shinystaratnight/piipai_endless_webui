import { FilterService } from './../../services/filter.service';
import { Component, OnInit } from '@angular/core';

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

  constructor(
    private fs: FilterService
  ) {}

  public ngOnInit() {
    this.count = 1;
    this.elements.push(this.createElement(this.count));
  }

  public deleteValue(item) {
    item.data = null;
    this.fs.generateQuery(
      this.genericQuery(this.elements, this.config.query), this.config.key, this.config.listName);
  }

  public addElement() {
    this.elements.push(this.createElement(this.count));
  }

  public deleteElement(item) {
    if (this.elements.length > 1) {
      let result = this.elements.filter((el) => el.id !== item.id);
      this.elements = result;
    }
    this.fs.generateQuery(
      this.genericQuery(this.elements, this.config.query), this.config.key, this.config.listName);
  }

  public createElement(id) {
    this.count++;
    return {
      id,
      data: ''
    };
  }

  public onChange() {
    this.fs.generateQuery(
      this.genericQuery(this.elements, this.config.query), this.config.key, this.config.listName);
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
}
