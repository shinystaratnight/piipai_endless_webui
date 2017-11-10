import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SettingsService {

  public endpoint: string = '/ecore/api/v2/company_settings';

  constructor(private http: Http) { }

  public resolve() {
    this.http.get(this.endpoint).subscribe(
      (res: Response) => {
        let settings = res.json();
        document.body.classList.add(`${settings.company_settings.color_scheme}-theme`);
        document.body.style.fontFamily = `${settings.company_settings.font}, sans-serif`;
      }
    );
  }

}
