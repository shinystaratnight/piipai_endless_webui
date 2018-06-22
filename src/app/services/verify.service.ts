import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VerifyService {

  constructor(
    private http: Http
  ) {}

  public verifyEmail(endpoint) {
    return this.http.get(endpoint)
      .map((res: Response) => res.json && res.json())
      .catch((err: any) => Observable.throw(err));
  }
}
