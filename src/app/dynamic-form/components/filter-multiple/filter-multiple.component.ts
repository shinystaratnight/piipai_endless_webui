import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FilterService } from '../../services/filter.service';
import { FormatString } from '../../../helpers/format';

@Component({
  selector: 'filter-multiple',
  templateUrl: './filter-multiple.component.html'
})
export class FilterMultipleComponent implements OnInit, OnDestroy {
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
  public type: string;
  public filterSubscription: Subscription;
  public querySubscription: Subscription;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(private fs: FilterService, private route: ActivatedRoute) {}

  public ngOnInit() {
    this.type = this.config.type === 'multiple' ? 'data' : 'options';
    this.querySubscription = this.route.queryParams.subscribe((params) =>
      this.updateFilter()
    );
    this.filterSubscription = this.fs.reset.subscribe(() =>
      this.updateFilter()
    );
    this.isCollapsed =
      this.query || document.body.classList.contains('r3sourcer')
        ? false
        : true;
    this.theme = document.body.classList.contains('r3sourcer')
      ? 'r3sourcer'
      : 'default';
    if (!this.data) {
      this.createData(this.type);
    }
    if (this.config.unique) {
      setTimeout(() => {
        this.onChange(null, true);
      }, 50);
    }
  }

  public ngOnDestroy() {
    this.querySubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  public createData(type) {
    this.data = this.config[type].map((data) => {
      return {
        label: type === 'data' ? data[this.config.display] : data.label,
        query: this.config.query,
        checked: type === 'data' ? true : false,
        data: type === 'data' ? data : data.value
      };
    });
  }

  public onChange(index: number, first?) {
    this.checkUniqueValues(this.config.unique, this.data, first, index);
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
          if (el.query instanceof Object) {
            const queries = Object.keys(el.query);
            queries.forEach((item) => {
              result += `${item}=${format.format(el.query[item], el.data)}&`;
            });
          } else {
            result += `${query}=${el.data}&`;
          }
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
        if (el.query instanceof Object) {
          const keys = Object.keys(el.query);
          let result;
          keys.forEach((item) => {
            result = `${item}=${format.format(el.query[item], el.data)}`;
            el.checked = query.indexOf(result) > -1;
          });
        } else {
          el.checked = query.indexOf(`${el.query}=${el.data}`) > -1;
        }
      });
    }
  }

  public updateFilter() {
    this.query = '';
    let data = this.fs.getQueries(this.config.listName, this.config.key);
    if (data) {
      if (data.byQuery) {
        if (!this.data) {
          this.createData(this.type);
        }

        this.parseQuery(data.query);
      } else {
        this.data = data;
      }
    } else {
      if (!this.data) {
        this.createData(this.type);
      }
      this.resetValues();
    }
  }

  public checkUniqueValues(unique, data, first?, index?) {
    if (unique) {
      const uniqueField = {};
      unique.forEach((field) => {
        if (index !== undefined && index !== null) {
          data.forEach((el, i) => {
            if (el.checked && i === index) {
              uniqueField[field] = [].concat(el.data[field]);
            }
          });
        }

        data.forEach((el, i) => {
          if (!uniqueField[field]) {
            uniqueField[field] = [];
          }
          if (uniqueField[field].indexOf(el.data[field]) > -1) {
            if (i !== index) {
              el.checked = false;
            }
          } else {
            if (first && this.config.preset) {
              el.checked = true;
            }
            if (el.checked) {
              uniqueField[field].push(el.data[field]);
            }
          }
        });
      });
    }
  }

  public resetValues() {
    this.data.forEach((el) => {
      el.checked = false;
    });
  }

  public resetFilter() {
    this.resetValues();
    this.fs.generateQuery(
      this.genericQuery(this.config.query, this.data),
      this.config.key,
      this.config.listName,
      this.data
    );
    this.changeQuery();
  }
}
