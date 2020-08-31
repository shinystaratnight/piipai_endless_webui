import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Language } from '@webui/data';

@Injectable()
export class TranslateHelperService {
  private _lang = new BehaviorSubject('en');

  langChange$ = this._lang.asObservable();

  setLang(lang: Language): void {
    this._lang.next(lang);
  }
}
