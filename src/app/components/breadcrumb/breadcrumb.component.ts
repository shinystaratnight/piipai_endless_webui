import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavigationService, Page } from '../../services/navigation.service';

export interface Breadcrumb {
  path: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'breadcrumb',
  templateUrl: 'breadcrumb.component.html'
})

export class BreadcrumbComponent implements OnInit {
  public list: Breadcrumb[] = [];
  public navigationList: Page[];

  constructor(
    private navigationService: NavigationService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {
    this.getList();
  }

  public getList() {
    this.navigationService.getPages().subscribe(
      (list: any) => {
        this.navigationList = list;
        this.route.url.subscribe(
          (url) => {
            if (this.navigationList) {
              this.list = [];
              this.generateData(url);
            }
          }
        );
      }
    );
  }

  public generateData(url) {
    let urlCopy = url.map((el) => {
      return el.path;
    });
    let lastElement = urlCopy.pop();
    let fullPath;
    if (lastElement === 'add') {
      this.generateBreadcrumb(urlCopy);
    } else if (lastElement === 'change') {
      let id = urlCopy.pop();
      this.generateBreadcrumb(urlCopy);
    } else {
      urlCopy.push(lastElement);
      this.generateBreadcrumb(urlCopy);
    }
  }

  public generateBreadcrumb(url) {
    let fullPath = `/${url.join('/')}/`;
    url.forEach((el, i) => {
      let path = `/${url.slice(0, i + 1).join('/')}/`;
      let label = '';
      let exist = this.getElement(path, this.navigationList);
      if (exist) {
        this.list.push({
          path,
          label: exist.name,
          active: path === fullPath
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
      } else if (el.children && el.childrens.length) {
        if (!result) {
          result = this.getElement(path, el.childrens);
        }
      }
    });
    return result;
  }

}
