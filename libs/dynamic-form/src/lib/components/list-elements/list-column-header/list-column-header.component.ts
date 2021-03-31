import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sort } from '../../../helpers';

import { SortData, SortService } from '../../../services';

type ListColumnHeaderConfig = {
  delim: string,
  label: string,
  name: string,
  sort: boolean,
  sort_field: string;
}

@Component({
  selector: 'app-list-column-header',
  templateUrl: 'list-column-header.component.html',
  styleUrls: ['list-column-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListColumnHeaderComponent implements OnInit {
  @Input() public config: ListColumnHeaderConfig;

  get icon$(): Observable<string> {
    return this.sortService.stream$
      .pipe(map((data: SortData) => {
        const value = data[this.config.sort_field];
        console.log(value, data, this.config);

        return this.icons[value] || this.icons[Sort.DEFAULT]
      }));
  }

  private icons = {
    [Sort.DEFAULT]: 'sort',
    [Sort.ASC]: 'sort-up',
    [Sort.DESC]: 'sort-down'
  };

  constructor(private sortService: SortService) {}

  ngOnInit() {
    console.log(this);
  }

  onSort(event: MouseEvent) {
    event.preventDefault();

    console.log(event);
  }
}
