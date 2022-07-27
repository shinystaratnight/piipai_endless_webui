import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Language } from '@webui/data';
import { TranslateHelperService } from '@webui/core';

@Component({
  selector: 'webui-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {

  control: FormControl = new FormControl();
  controlSubscription!: Subscription;
  Language = Language;

  constructor(private translateHelperService: TranslateHelperService) {}

  ngOnInit() {
    this.control.patchValue(this.translateHelperService.currentLang);
    this.controlSubscription = this.control.valueChanges.subscribe((language) => {
      this.translateHelperService.setLang(language, true);
    })
  }

  ngOnDestroy() {
    this.controlSubscription.unsubscribe();
  }
}
