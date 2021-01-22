import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Language } from '@webui/data';

import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class TranslateHelperService {
  private _lang = new BehaviorSubject('en');

  langChange$ = this._lang.asObservable();

  get currentLang() {
    return this._lang.value;
  }

  constructor(private storage: LocalStorageService) {}

  setLang(lang: Language, update?: boolean): void {
    if (update) {
      this.storage.store('lang', lang);
    }

    console.log(lang);
    this._lang.next(lang);
  }
}
