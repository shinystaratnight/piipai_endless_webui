import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';

import { ErrorsService } from '../../shared/services/errors.service';

export interface Marker {
  latitude: number;
  longitude: number;
  contact: {
    phone_mobile: string;
    name: string;
  };
  name: string;
  type: string;
}

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
        catchError((error: any) => this.errors.parseErrors(error))
      );
  }
}
