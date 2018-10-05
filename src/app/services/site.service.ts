import { Injectable } from '@angular/core';

import { Page } from './navigation.service';

import { of } from 'rxjs';

interface PathData {
  type: string;
  path: string;
  id?: string;
  postfix?: string;
}

export interface PageData {
  endpoint: string;
  pathData: PathData;
}

@Injectable()
export class SiteService {

  public list: Page[];

  public getDataOfPage(url: any, list) {
    return of(this.generateData(list, url));
  }

  public generateData(list: Page[], url: any[]): PageData {
    const pathData: PathData = this.getTypeOfPage(url);
    const element: Page = this.getElementFromList(list, pathData.path);
    const data: PageData = {
      endpoint: element ? element.endpoint : '/',
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
    const urlCopy = url.map((el) => {
      return el.path;
    });
    const lastElement = urlCopy.pop();
    if (lastElement === 'add') {
      data = {
        type: 'form',
        path: this.generatePath(urlCopy)
      };
    } else if (lastElement === 'change' || lastElement === 'submit' || lastElement === 'fillin') {
      const id = urlCopy.pop();
      data = {
        type: 'form',
        path: this.generatePath(urlCopy),
        id
      };
      if (lastElement === 'submit') {
        data.postfix = 'submit';
      }
      if (lastElement === 'fillin') {
        data.postfix = 'fillin';
        data.type = 'list';
      }
    } else if (lastElement === 'profile') {
      urlCopy.push(lastElement);
      data = {
        type: 'profile',
        path: this.generatePath(urlCopy)
      };
    } else if (lastElement === 'map') {
      urlCopy.push(lastElement);
      data = {
        type: 'map',
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
