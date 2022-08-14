import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sort } from '../../../helpers';

import { SortData, SortService } from '../../../services';

import { getTranslationKey } from '@webui/utilities';

type ListColumnHeaderConfig = {
  delim: string;
  label: string;
  name: string;
  sort: boolean;
  sort_field: string;
  sortMap: Array<{
    name: string;
    param: string;
    sorted: Sort;
  }>
}

type Name = {
  sorted?: Sort;
  param?: string;
  label: string;
  name: string;
  sort: boolean;
  icon$?: Observable<string>;
}

@Component({
  selector: 'webui-list-column-header',
  templateUrl: 'list-column-header.component.html',
  styleUrls: ['list-column-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListColumnHeaderComponent implements OnInit {
  @Input() public config!: ListColumnHeaderConfig;

  hasMultipleNames!: boolean;
  multipleNamesData!: Name[];
  icon$!: Observable<string>;
  translationKey!: string;

  @Output() public sortChange: EventEmitter<void> = new EventEmitter();

  private icons = {
    [Sort.DEFAULT]: 'sort',
    [Sort.ASC]: 'sort-up',
    [Sort.DESC]: 'sort-down'
  };

  constructor(private sortService: SortService) {}

  ngOnInit() {
    this.translationKey = getTranslationKey(this.config.name, 'label');

    if (this.config.sortMap) {
      this.hasMultipleNames = true;
      this.generateMultipleNames();
    } else if (this.config.sort) {
      this.icon$ = this.sortService.stream$
        .pipe(map((data: SortData) => this.icons[data[this.config.sort_field]] || this.icons[Sort.DEFAULT]));
    }
  }

  onSort(event: PointerEvent, name?: string) {
    event.preventDefault();

    if (this.hasMultipleNames) {
      const item = this.multipleNamesData.find(el => el.name === name);

      this.sortService.updateWith(item?.param as string);
    } else {
      this.sortService.updateWith(this.config.sort_field);
    }

    this.sortChange.emit();
  }

  private generateMultipleNames() {
    const names = this.config.name.split('/').map(el => el.replace(/_/g, ''));
    const labels = this.config.label.split('/').map(el => el.trim());

    this.multipleNamesData = names.map((name: string, index: number) => {
      let sorted;
      let param: any;

      const sortData = this.config.sortMap.find(el => el.name === name);
      const iconStream$ = this.sortService.stream$
        .pipe(map((data: SortData) => this.icons[data[param]] || this.icons[Sort.DEFAULT]));

      if (sortData) {
        sorted = sortData.sorted;
        param = sortData.param;
      }

      return {
        name,
        label: labels[index],
        sorted,
        param,
        sort: !!sortData,
        icon$: iconStream$
      };
    })
  }
}
