import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';

import { FormatString } from '@webui/utilities';

import { GenericFormService, FormMode } from '../../../services';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-form-list-dropdown',
  templateUrl: './form-list-dropdown.component.html',
  styleUrls: ['./form-list-dropdown.component.scss']
})
export class FormListDropdownComponent implements OnInit, OnDestroy {
  config: any;

  displayValue: string;

  // Dropdown
  list: any[];
  initList: any[];
  showDropdown = false;
  loading: boolean;
  count: number;
  limit = 10;
  offset = 0;
  searchValue = '';

  display: string;
  endpoint: string;

  _mode: FormMode;
  private viewSubscription: Subscription;

  get isViewMode() {
    return this._mode === FormMode.View;
  }

  get isEditMode() {
    return this._mode === FormMode.Edit;
  }

  constructor(
    private gfs: GenericFormService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    const formData = this.config.formData.value.data;
    this.viewSubscription = this.subscribeOnViewModeChanges(this.config);
    this.display = this.config.templateOptions.display;
    this.endpoint = FormatString.format(this.config.endpoint, formData);

    this.gfs.get(this.endpoint).subscribe(res => {
      this.count = res.count;
      this.displayValue = FormatString.format(
        this.display,
        this.getDisplayValue(res.results, this.config.field)
      );
      this.list = this.updateList(res.results);
      this.initList = [...this.list];
    });
  }

  ngOnDestroy() {
    this.viewSubscription.unsubscribe();
  }

  subscribeOnViewModeChanges(config: {
    mode: Subject<FormMode>;
  }): Subscription {
    return config.mode.subscribe(mode => {
      this._mode = mode;
    });
  }

  getDisplayValue<T>(data: Array<T>, field: string): T {
    return data.find(el => el[field]);
  }

  updateList(data: any[]): any[] {
    return data.map(el => {
      return {
        ...el,
        __str__: FormatString.format(this.display, el)
      };
    });
  }

  onShowDropdown() {
    this.list = [...this.initList];
    this.showDropdown = true;
  }

  onSearch(value: string) {
    this.loading = true;
    this.searchValue = value;
    this.gfs
      .get(this.endpoint, { search: value })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(res => {
        this.count = res.count;
        this.offset = 0;
        this.list = this.updateList(res.results);
      });
  }

  onSet(value) {
    const endpoint =
      this.endpoint +
      FormatString.format(this.config.templateOptions.param, value);

    this.gfs.updateForm(endpoint, this.config.setData).subscribe(data => {
      this.showDropdown = false;
      this.offset = 0;
      this.searchValue = '';
      this.displayValue = FormatString.format(
        this.display,
        this.getDisplayValue([data], this.config.field)
      );
    });
  }

  onUploadMore() {
    this.offset += this.limit;

    const params = {
      offset: this.offset,
      limit: this.limit,
      search: this.searchValue
    }

    this.gfs
      .get(this.endpoint, params)
      .subscribe(res => {
        this.list = [...this.list, ...this.updateList(res.results)];
      });
  }

  @HostListener('document:click', ['$event'])
  public handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    if (this.elementRef) {
      do {
        if (clickedComponent === this.elementRef.nativeElement) {
          inside = true;
        }
        clickedComponent = clickedComponent.parentNode;
      } while (clickedComponent);
      if (!inside) {
        this.showDropdown = false;
      }
    }
  }
}
