import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GenericFormService {

  constructor(
    private http: Http
  ) { }

  public getMetadata(endpoint) {
    return this.http.options(endpoint)
      .map((response: Response) => response.json())
      .catch((error: any) => this.errorHandler(error));
  }

  public submitForm(endpoint, data) {
    return this.http.post(endpoint, data)
      .map((response: Response) => response.json())
      .catch((error: any) => this.errorHandler(error));
  }

  public errorHandler(error) {
    return Observable.throw(error.json());
  }
}
