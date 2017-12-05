import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SettingsService {

  public endpoint: string = '/ecore/api/v2/company_settings';
  public settings: any;

  constructor(private http: Http) { }

  public resolve() {
    if (!this.settings) {
      this.http.get(this.endpoint)
        .map((res: Response) => {
          let settings = res.json();
          this.settings = settings;
          let body = document.body;
          body.parentElement.classList.add(`${settings.company_settings.color_scheme}-theme`);
          body.style.fontFamily = `${settings.company_settings.font}, sans-serif`;
          return res;
        })
        .catch((err: any) => Observable.of(true));
    }
  }

}
