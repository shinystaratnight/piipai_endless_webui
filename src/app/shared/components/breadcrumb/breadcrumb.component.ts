import { Component, OnChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Page } from '../../../services';

export interface Breadcrumb {
  path: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: 'breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BreadcrumbComponent implements OnChanges {

  @Input()
  public navigationList: Page[];

  @Input()
  public formLabel: string;

  @Input()
  public url: any;

  @Input()
  public byRoute = true;

  public list: Breadcrumb[] = [];

  constructor(
    private route: ActivatedRoute
  ) {}

  public ngOnChanges() {
    this.getList();
  }

  public getList() {
    this.list = [];
    if (this.url) {
      this.generateData(this.url);
    }
    if (this.byRoute) {
      this.route.url.subscribe(
        (url) => {
          if (this.navigationList) {
            this.list = [];
            this.generateData(url);
          }
        }
      );
    }
  }

  public generateData(url) {
    const urlCopy = url.map((el) => {
      return el.path;
    });
    this.generateBreadcrumb(urlCopy);
  }

  public generateBreadcrumb(url) {
    const fullPath = `/${url.join('/')}/`;
    url.forEach((el, i) => {
      const path = `/${url.slice(0, i + 1).join('/')}/`;
      const label = '';
      const exist = this.getElement(path, this.navigationList);
      if (exist) {
        this.list.push({
          path,
          label: exist.name,
          active: path === fullPath
        });
      } else if ((el === 'add' || el === 'change') && this.formLabel) {
        this.list.push({
          path: null,
          label: this.formLabel,
          active: true
        });
      }
    });
  }

  public getElement(path, array) {
    let result;
    array.forEach((el) => {
      if (el.url === path) {
        if (!result) {
          result = el;
        }
      } else if (el.childrens && el.childrens.length) {
        if (!result) {
          result = this.getElement(path, el.childrens);
        }
      }
    });
    return result;
  }

}
