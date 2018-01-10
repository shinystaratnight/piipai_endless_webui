import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserService } from './user.service';

@Injectable()
export class SettingsService {

  public endpoint: string = '/ecore/api/v2/company_settings';
  public settings: any;

  constructor(
    private http: Http,
    private userService: UserService
  ) { }

  public resolve() {
    return this.userService.getUserData().mergeMap(
      (user: any) => {
        if (user.data.contact.contact_type === 'manager') {
          return this.http.get(this.endpoint)
            .map((res: Response) => {
              let settings = res.json();
              setTimeout(() => {
                let body = document.body;
                body.parentElement.classList.add(`${settings.company_settings.color_scheme}-theme`);
                body.style.fontFamily = `${settings.company_settings.font}, sans-serif`;
              }, 700);
              return res;
            })
            .catch((err: any) => Observable.of(true));
        } else {
          return Observable.of(<any> []);
        }
      }
    );
  }

}
