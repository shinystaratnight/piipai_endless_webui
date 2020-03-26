import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Sort } from '../../helpers';

@Component({
  selector: 'app-sort-icon',
  templateUrl: './sort-icon.component.html',
  styleUrls: ['./sort-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortIconComponent {

  @Input() exist: boolean;
  @Input()
  set sort(value: Sort) {
    this.active = value != undefined;

    this.icon = this.icons[value] || this.icons[Sort.DEFAULT];
  }

  active: boolean;
  icon: string;

  icons = {
    [Sort.DEFAULT]: 'sort',
    [Sort.ASC]: 'sort-up',
    [Sort.DESC]: 'sort-down'
  };
}
