import { Injectable } from '@angular/core';

import { Page } from './navigation.service';

import { Observable } from 'rxjs/Observable';

interface PathData {
  type: string;
  path: string;
  id?: string;
  postfix?: string;
  modal?: boolean;
  title?: string;
}

export interface PageData {
  endpoint: string;
  pathData: PathData;
}

@Injectable()
export class SiteService {

  public list: Page[];

  public getDataOfPage(url: any, list) {
    return Observable.of(this.generateData(list, url));
  }

  public generateData(list: Page[], url: any[]): PageData {
    let pathData: PathData = this.getTypeOfPage(url);
    let element: Page = this.getElementFromList(list, pathData.path);
    let data: PageData = {
      endpoint: element ? element.endpoint : '',
      pathData
    };
    if (pathData.postfix) {
      data.endpoint = data.endpoint + pathData.id + `/${pathData.postfix}/`;
      pathData.id = null;
    }
    return data;
  }

  public generatePath(url: string[]): string {
    return `/${url.join('/')}/`;
  }

  public getTypeOfPage(url): PathData {
    if (!url.length) {
      return {
        type: 'list',
        path: '/'
      };
    }

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
    } else if (lastElement === 'change' || lastElement === 'submit' || lastElement === 'fillin') {
      let id = urlCopy.pop();
      data = {
        type: 'form',
        path: this.generatePath(urlCopy),
        id
      };
      if (lastElement === 'submit') {
        data.postfix = 'submit';
        data.modal = true;
        data.title = 'TimeSheet filling';
      }
      if (lastElement === 'fillin') {
        data.postfix = 'fillin';
      }
    } else if (lastElement === 'profile') {
      urlCopy.push(lastElement);
      data = {
        type: 'profile',
        path: this.generatePath(urlCopy)
      };
    } else {
      urlCopy.push(lastElement);
      if (urlCopy.indexOf('settings') > -1) {
        data = <any> {
          type: undefined,
          path: this.generatePath(urlCopy)
        };
      } else {
        data = {
          type: 'list',
          path: this.generatePath(urlCopy)
        };
      }
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
