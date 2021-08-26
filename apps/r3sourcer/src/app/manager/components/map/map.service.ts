import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';

import { ErrorsService } from '@webui/core';

export interface Marker {
  latitude: number;
  longitude: number;
  contact: {
    phone_mobile: string;
    name: string;
  };
  name: string;
  type: string;
  __str__: string;
}

const filters = [
  {
    key: 'filterby',
    label: 'By Type',
    options: [
      {
        value: 'clients',
        label: 'All Clients'
      },
      {
        value: 'only_hqs',
        label: 'Only Client HQs'
      },
      {
        value: 'jobsites',
        label: 'All Jobsites'
      }
    ],
    query: 'filter_by',
    default: null,
    type: 'select'
  },
  {
    key: 'jobsite',
    label: 'Jobsite',
    type: 'related',
    data: {
      value: '__str__',
      endpoint: '/hr/jobsites/',
      key: 'id'
    },
    query: 'jobsite'
  },
  {
    key: 'client',
    label: 'Client',
    type: 'related',
    data: {
      value: '__str__',
      endpoint: '/core/companies/',
      key: 'id'
    },
    query: 'client'
  },
  {
    key: 'primary_contact',
    label: 'Client Contact',
    type: 'related',
    data: {
      value: '__str__',
      endpoint: '/core/companycontacts/',
      key: 'id'
    },
    query: 'primary_contact'
  },
  {
    key: 'portfolio_manager',
    label: 'Portfolio Manager',
    type: 'related',
    data: {
      value: '__str__',
      endpoint: '/core/companycontacts/?master_company=current',
      key: 'id'
    },
    query: 'portfolio_manager'
  },
];

@Injectable()
export class MapService {

  public endpoint = '/hr/jobsites/jobsite_map/';

  constructor(
    private http: HttpClient,
    private errors: ErrorsService
  ) {}

  public getPositions(query: string = '') {
    return this.http
      .get(this.endpoint + query)
      .pipe(
        catchError((error: any) => this.errors.handleError(error))
      );
  }

  public getFilters() {
    return filters;
  }
}
