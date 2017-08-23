import { Injectable } from '@angular/core';

import { NavigationService, Page } from './navigation.service';

import { Observable } from 'rxjs/Observable';

interface PathData {
  type: string;
  path: string;
  id?: string;
}

export interface PageData {
  endpoint: string;
  pathData: PathData;
}

@Injectable()
export class SiteService {

  public list: Page[];

  constructor(
    private navigationService: NavigationService
  ) {}

  public getDataOfPage(url: any): Observable<PageData> {
    if (!this.list) {
      return this.navigationService.getPages().map(
        (list: Page[]) => {
          this.list = list;
          let data = this.generateData(list, url);
          return data;
        }
      );
    } else if (this.list) {
      let data = this.generateData(this.list, url);
      return Observable.of(data);
    }
  }

  public generateData(list: Page[], url: any[]): PageData {
    let pathData: PathData = this.getTypeOfPage(url);
    let element: Page = this.getElementFromList(list, pathData.path);
    let data: PageData = {
      endpoint: element ? element.endpoint : '',
      pathData
    };
    return data;
  }

  public generatePath(url: string[]): string {
    return `/${url.join('/')}/`;
  }

  public getTypeOfPage(url): PathData {
    let data: PathData;
    let urlCopy = url.map((el) => {
      return el.path;
    });
    let lastElement = urlCopy.pop();
    if (lastElement === 'add') {
      data = {
        type: 'form',
        path: this.generatePath(urlCopy)
      };
    } else if (lastElement === 'change') {
      let id = urlCopy.pop();
      data = {
        type: 'form',
        path: this.generatePath(urlCopy),
        id
      };
    } else if (lastElement === 'profile') {
      urlCopy.push(lastElement);
      data = {
        type: 'profile',
        path: this.generatePath(urlCopy)
      };
    } else {
      urlCopy.push(lastElement);
      data = {
        type: 'list',
        path: this.generatePath(urlCopy)
      };
    }
    return data;
  }

  public getElementFromList(list: Page[], path: string): Page {
    let element;
    list.forEach((el) => {
      if (el.url === path) {
        if (!element) {
          element = el;
        }
      } else if (el.childrens.length) {
        if (!element) {
          element = this.getElementFromList(el.childrens, path);
        }
      }
    });
    return element;
  }
}
