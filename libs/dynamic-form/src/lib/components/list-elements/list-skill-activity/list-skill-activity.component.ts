import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

import { SiteSettingsService } from '@webui/core';
import { checkAndReturnTranslation } from '@webui/utilities';

@Component({
  selector: 'app-list-skill-activity',
  templateUrl: './list-skill-activity.component.html',
  styleUrls: ['./list-skill-activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListSkillActivityComponent implements OnInit {
  public config: any;
  public list: boolean;
  public dataList: any[];
  public more: boolean;

  constructor(
    private siteSetting: SiteSettingsService,
    private storage: LocalStorageService
  ) {}

  public ngOnInit() {
    const { value } = this.config;

    if (Array.isArray(value)) {
      this.list = true;

      value.forEach((el) => {
        const { name, translations } = el;
        const { country_code } = this.siteSetting.settings;
        const lang = this.storage.retrieve('lang');

        el.__str__ = checkAndReturnTranslation(
          {
            name: {
              translations,
              name
            }
          },
          country_code,
          lang
        );
      });

      if (value && value.length > 4) {
        this.dataList = value.slice(0, 4);
        this.more = true;
      } else {
        this.dataList = [...value];
      }
    }
  }

  public showMore(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    this.dataList = this.config.value;
    this.more = false;

    return false;
  }
}
