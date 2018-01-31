import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FilterService } from '../../services/filter.service';
import { FormatString } from '../../../helpers/format';

@Component({
  selector: 'filter-multiple',
  templateUrl: './filter-multiple.component.html'
})
export class FilterMultipleComponent implements OnInit {
  public config: any;
  public query: string;
  public data: any;
  public isCollapsed: boolean = true;
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
  public theme: string;

  @Output() public event: EventEmitter<any> = new EventEmitter();

  constructor(private fs: FilterService, private route: ActivatedRoute) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => this.updateFilter()
    );
    this.isCollapsed =
      this.query || document.body.classList.contains('r3sourcer')
        ? false
        : true;
    this.theme = document.body.classList.contains('r3sourcer')
      ? 'r3sourcer'
      : 'default';
    if (this.config.data) {
      this.data = this.config.data.map((data) => {
        return {
          label: data[this.config.display],
          query: this.config.query,
          checked: true,
          data
        };
      });
    }
  }

  public onChange() {
    this.fs.generateQuery(
      this.genericQuery(this.config.query, this.data),
      this.config.key,
      this.config.listName,
      this.data
    );
    this.changeQuery();
  }

  public genericQuery(query, data) {
    const format = new FormatString();
    let result = '';
    if (data) {
      data.forEach((el) => {
        if (el.checked) {
          const queries = Object.keys(el.query);
          queries.forEach((item) => {
            result += `${item}=${format.format(el.query[item], el.data)}&`;
          });
        }
      });
    }
    this.query = result.slice(0, result.length - 1);
    return this.query;
  }

  public changeQuery() {
    this.event.emit({
      list: this.config.listName
    });
  }

  public parseQuery(query) {
    const format = new FormatString();
    this.query = query;
    if (this.data) {
      this.data.forEach((el) => {
        const keys = Object.keys(el.query);
        let result;
        keys.forEach((item) => {
          result = `${item}=${format.format(el.query[item], el.data)}`;
          if (query.indexOf(result)) {
            el.checked = el.checked ? el.checked : false;
          }
        });
      });
    }
  }

  public updateFilter() {
    this.query = '';
    let data = this.fs.getQueries(this.config.listName, this.config.key);
    if (data) {
      if (data.byQuery) {
        this.parseQuery(data.query);
      } else {
        this.data = data;
      }
    }
  }
}
