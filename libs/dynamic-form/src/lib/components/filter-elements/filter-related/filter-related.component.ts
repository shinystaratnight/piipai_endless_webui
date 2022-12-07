import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ElementRef,
  ChangeDetectorRef,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GenericFormService, FilterService } from '../../../services';
import { SiteSettingsService, UserService } from '@webui/core';

import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  merge,
} from 'rxjs';
import {
  debounceTime,
  filter,
  takeUntil,
  distinctUntilChanged,
  switchMap,
  map,
  scan,
  finalize,
  skip,
  tap,
} from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

const listLimit = 10;

type FilterValue = {
  label: string;
  key: string;
};
type FilterOption = {
  value: FilterValue;
  control: FormControl;
  key: string;
};

@Component({
  selector: 'webui-filter-related',
  templateUrl: 'filter-related.component.html',
  styleUrls: ['./filter-related.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterRelatedComponent implements OnInit, OnDestroy {
  private _destroy = new Subject<void>();
  private _value = new BehaviorSubject<FilterValue[] | null>(null);
  private _options = new BehaviorSubject<FilterOption[]>([]);
  private _offset = new BehaviorSubject<number>(0);
  private _loading = new BehaviorSubject<boolean>(false);
  private _active = new BehaviorSubject<boolean>(false);

  @Input() public config!: any;

  @ViewChild('content') content?: ElementRef<HTMLDivElement>;
  // public data: any;
  // public item: any;
  // public query!: string;
  // public isCollapsed = false;

  // public searchValue!: string | null;

  public modalScrollDistance = 2;
  public modalScrollThrottle = 50;
  // public skipScroll = false;

  // public list!: any[];
  // public previewList: any[] = [];
  // public topHeight!: number;

  // public settingValue = true;

  // public defaultValue: any;
  // public theme!: string;
  // public selected: any[] = [];
  // public selectedValues!: any[];

  // public cacheValue!: any[];

  // public cashResults!: any[];

  // public limit = listLimit;
  // public multiple = false;

  // @ViewChild('search')
  // public search!: FormControl;

  limit = listLimit;

  value$ = this._value.asObservable();
  options$ = this._options.asObservable();
  loading$ = this._loading.asObservable();
  active$ = this._active.asObservable();

  searchControl = new FormControl(null);
  valueGroup = new FormGroup({});

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    private fs: FilterService,
    private route: ActivatedRoute,
    private genericFormService: GenericFormService,
    private elementRef: ElementRef,
    private siteSettingsService: SiteSettingsService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  get selectedElement(): FilterOption | undefined {
    const filterValue = this.valueGroup.value;
    let selectedControl = '';

    for (const prop in filterValue) {
      if (filterValue[prop]) {
        selectedControl = prop;
      }
    }

    console.log(selectedControl);

    return this._options.value.find((option) => option.key === selectedControl);
  }

  public ngOnInit() {
    console.log(this);

    if (this.config.multiple) {
      this.limit = -1;
    }

    this.active$.pipe(takeUntil(this._destroy)).subscribe((value) => {
      if (value === false) {
        this._options.next([]);
        this.cleanValueForm();
      }
    });

    this.valueGroup.valueChanges.pipe(takeUntil(this._destroy)).subscribe((value) => {
      if (!this.config.multiple && this.selectedElement) {
        this._active.next(false);
      }

      console.log(value, this.selectedElement);
    })
    // const { multiple = false } = this.config;
    // this.multiple = multiple;
    // this.limit = multiple ? -1 : listLimit;

    // this.route.queryParams.pipe(takeUntil(this._destroy)).subscribe(() => {
    //   setTimeout(() => {
    //     if (!(this.cd as any).destroyed) {
    //       this.updateFilter();
    //     }
    //   }, 200);
    // });
    // this.fs.reset
    //   .pipe(takeUntil(this._destroy))
    //   .subscribe(() => this.updateFilter());
    // this.defaultValue = {
    //   [this.config.data.key]: '',
    //   [this.config.data.value]: this.multiple
    //     ? `Select ${this.config.label}`
    //     : 'All',
    // };
  }

  // public ngAfterViewInit() {
  //   // this.search?.valueChanges
  //   //   .pipe(
  //   //     filter((value) => value !== null),
  //   //     debounceTime(400),
  //   //     takeUntil(this._destroy)
  //   //   )
  //   //   .subscribe(() => {
  //   //     // this.filter();
  //   //   });
  // }

  public ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  // public generateList(concat = false): void {
  //   if (this.multiple) {
  //     if (!this.cacheValue) {
  //       this.skipScroll = true;
  //       this.cd.detectChanges();
  //       this.getOptions(this.searchValue, concat);
  //     }
  //   } else {
  //     this.skipScroll = true;
  //     this.cd.detectChanges();
  //     this.getOptions(this.searchValue, concat);
  //   }
  // }

  // public generatePreviewList(list: any[]) {
  //   this.item.lastElement += this.limit;
  //   this.previewList = list.slice(0, this.item.lastElement);
  // }

  // public openAutocomplete($event: any) {
  //   if (this.multiple && this.item && !this.item.hideAutocomplete) {
  //     this.item.hideAutocomplete = true;
  //     return;
  //   }
  //   let autocomplete: any;
  //   const target = $event.target;

  //   this.searchValue = null;
  //   this.item.hideAutocomplete = false;
  //   this.generateList();

  //   if (target.classList.contains('autocomplete-value')) {
  //     this.topHeight = target.offsetHeight + 1;
  //     autocomplete = target.nextElementSibling;
  //   } else {
  //     this.topHeight = target.parentElement.offsetHeight + 1;
  //     autocomplete = target.parentElement.nextElementSibling;
  //   }
  //   setTimeout(() => {
  //     if (!this.multiple && autocomplete) {
  //       autocomplete.children[1]?.scrollTo({ top: 0 });
  //       autocomplete.children[0]?.focus();
  //     }
  //   }, 150);
  // }

  // public resetList() {
  //   setTimeout(() => {
  //     if (this.previewList && this.item) {
  //       this.previewList.length = 0;
  //       this.item.lastElement = 0;
  //       this.item.count = null;
  //       this.item.hideAutocomplete = true;
  //     }
  //   }, 150);
  // }

  // public filter() {
  //   if (!this.multiple) {
  //     this.item.lastElement = 0;
  //     this.item.count = null;
  //     this.previewList = [];
  //     this.generateList();
  //   } else {
  //     let filteredList;
  //     if (this.searchValue && this.cacheValue) {
  //       filteredList = this.cacheValue.filter((el) => {
  //         const val = el[this.config.data.value];
  //         if (val) {
  //           return (
  //             val.toLowerCase().indexOf(this.searchValue?.toLowerCase()) > -1
  //           );
  //         }

  //         return false;
  //       });
  //       this.previewList = filteredList;
  //     } else {
  //       this.previewList = this.cacheValue;
  //     }
  //   }
  // }

  // public onModalScrollDown() {
  //   if (!this.multiple) {
  //     console.log(this.skipScroll);
  //     if (!this.skipScroll) {
  //       this.skipScroll = true;
  //       this.generateList(true);
  //     }
  //   }
  // }

  // public setValue(value: any, list: any[]) {
  //   if (this.multiple) {
  //     this.selected = list?.filter((item) => item.checked);
  //     this.item.data = this.selected.map((el) =>
  //       this.getValue(el, this.config.data.key)
  //     );
  //     this.item.displayValue = this.selected.length
  //       ? `Selected ${this.selected.length} ${this.config.label}`
  //       : `Select ${this.config.label}`;
  //     this.onChange();
  //   } else {
  //     this.item.data = this.getValue(value, this.config.data.key);
  //     this.item.displayValue = this.getValue(value, this.config.data.value);
  //     this.item.count = null;
  //     this.item.hideAutocomplete = true;
  //     this.searchValue = null;
  //     this.previewList.length = 0;
  //     this.onChange();
  //   }
  // }

  // public deleteValue() {
  //   if (this.multiple) {
  //     this.resetAll(this.previewList || []);
  //     return;
  //   } else {
  //     this.item.data = '';
  //     this.item.displayValue = 'All';
  //   }
  // }

  // public createElement(data?: any) {
  //   const element = {
  //     data,
  //     lastElement: 0,
  //     hideAutocomplete: true,
  //   };
  //   return element;
  // }

  // public onChange() {
  //   this.fs.generateQuery(
  //     this.genericQuery(this.config.query),
  //     this.config.key,
  //     this.config.listName,
  //     this.item
  //   );
  //   this.changeQuery();
  // }

  // public genericQuery(query: string) {
  //   let result = '';
  //   if (Array.isArray(this.item.data)) {
  //     this.item.data.forEach((el: any) => {
  //       result += `${query}=${el}&`;
  //     });
  //   } else {
  //     result = `${query}=${this.item.data}&`;
  //   }
  //   this.query = result;
  //   return result.substring(0, result.length - 1);
  // }

  // public changeQuery() {
  //   this.event.emit({
  //     list: this.config.listName,
  //     key: this.config.query,
  //     value: this.item,
  //   });
  // }

  // public parseQuery(query: string) {
  //   this.query = query;
  //   const queries = query.split('&');
  //   let data: any[] | string = [];
  //   queries.forEach((el, i) => {
  //     if (queries.length) {
  //       (data as any[]).push(el.split('=')[1]);
  //     } else {
  //       data = el.split('=')[1];
  //     }
  //   });
  //   if (!this.item) {
  //     this.item = this.createElement(data);
  //     this.item['displayValue'] = data ? this.getOption(data) : 'All';
  //   }
  // }

  // public updateFilter() {
  //   const data = this.fs.getQueries(this.config.listName, this.config.key);

  //   if (data) {
  //     if (data.byQuery) {
  //       if (this.settingValue) {
  //         this.settingValue = false;
  //         this.parseQuery(data.query);
  //       }
  //     } else {
  //       if (this.settingValue) {
  //         this.settingValue = false;
  //         this.item = data;
  //         this.genericQuery(this.config.query);
  //       }
  //     }
  //   } else {
  //     this.query = '';
  //     if (!this.item) {
  //       this.item = this.createElement();
  //       if (this.multiple) {
  //         this.item.displayValue = `Select ${this.config.label}`;
  //       } else {
  //         this.item.displayValue = data ? this.getOption(data) : 'All';
  //       }
  //     }

  //     if (this.item && !this.multiple) {
  //       this.item.data = '';
  //       this.item.displayValue = 'All';
  //     } else if (this.previewList) {
  //       this.previewList.forEach((el) => {
  //         el.checked = false;
  //       });
  //       this.selected = this.previewList.filter((item) => item.checked);
  //       this.item.data = this.selected.map((el) =>
  //         this.getValue(el, this.config.data.key)
  //       );
  //       this.item.displayValue =
  //         this.selected && this.selected.length
  //           ? `Selected ${this.selected.length} ${this.config.label}`
  //           : `Select ${this.config.label}`;
  //     }
  //   }

  //   this.cd.detectChanges();
  // }

  // public resetFilter() {
  //   this.query = '';
  //   this.deleteValue();
  //   this.fs.generateQuery('', this.config.key, this.config.listName, this.item);
  //   this.changeQuery();
  // }

  // public getOption(value: any) {
  //   if (this.multiple) {
  //     this.selected = value;
  //     this.getOptions(this.searchValue);
  //     return `Selected ${value.length} ${this.config.label}`;
  //   }
  //   let endpoint;

  //   if (this.config.data.endpoint.includes('{')) {
  //     const formatString = new FormatString();
  //     const data = {
  //       ...this.siteSettingsService.settings,
  //       filter_value: value,
  //       session: this.userService.user,
  //     };
  //     endpoint = formatString.format(this.config.data.endpoint, data);
  //     this.genericFormService.getAll(endpoint).subscribe((res: any) => {
  //       if (res.results) {
  //         this.item.displayValue = this.getValue(
  //           res.results[0],
  //           this.config.data.value
  //         );
  //       }
  //     });
  //   } else {
  //     const index = this.config.data.endpoint.indexOf('?');
  //     if (index !== -1) {
  //       endpoint =
  //         this.config.data.endpoint.slice(0, index) +
  //         `${value}/` +
  //         this.config.data.endpoint.slice(index);
  //     } else {
  //       endpoint = `${this.config.data.endpoint}${value}/`;
  //     }
  //     const display = this.config.data.value;
  //     this.genericFormService.getAll(endpoint).subscribe((res: any) => {
  //       this.item.displayValue = res[display];
  //     });
  //   }

  //   return;
  // }

  // public getOptions(value: any, concat = false) {
  //   const formatString = new FormatString();
  //   const endpoint = this.config.data.endpoint.includes('{')
  //     ? formatString.format(this.config.data.endpoint, {
  //         ...this.siteSettingsService.settings,
  //         session: this.userService.user,
  //       })
  //     : this.config.data.endpoint;
  //   const offset = this.item.lastElement;
  //   let query = '';

  //   if (value) {
  //     query +=
  //       endpoint.indexOf('?') === -1 ? `?search=${value}` : `&search=${value}`;
  //   }
  //   query += !query && endpoint.indexOf('?') === -1 ? '?' : '&';
  //   query += `&limit=${this.limit}&offset=${offset}`;
  //   query += this.generateFields(this.config.data);
  //   if (
  //     !this.item.count ||
  //     (this.item.count && offset < this.item.count && concat)
  //   ) {
  //     this.item.lastElement += this.limit;
  //     this.genericFormService
  //       .getByQuery(endpoint, query)
  //       .pipe(takeUntil(this.search.valueChanges))
  //       .subscribe((res: any) => {
  //         this.skipScroll = false;
  //         this.item.count = res.count;
  //         if (res.results) {
  //           if (concat) {
  //             if (this.previewList) {
  //               res.results.forEach((el: any) => {
  //                 if (el) {
  //                   el.__str__ = this.getValue(el, this.config.data.value);
  //                 }
  //               });

  //               this.previewList.push(...res.results);
  //             }
  //           } else {
  //             if (!this.cacheValue && this.multiple) {
  //               if (this.selected) {
  //                 res.results.forEach((el: any) => {
  //                   if (this.selected.indexOf(el[this.config.data.key]) > -1) {
  //                     el.checked = true;
  //                   }
  //                 });
  //               }
  //               this.cacheValue = res.results;
  //               this.previewList = this.cacheValue;
  //               this.selected = this.filterSelectedValues(this.previewList);
  //               return;
  //             }
  //             res.results.forEach((el: any) => {
  //               if (el) {
  //                 el.__str__ = this.getValue(el, this.config.data.value);
  //               }
  //             });

  //             this.previewList = res.results;
  //             this.cd.detectChanges();
  //           }
  //         } else if (this.config.property) {
  //           const list = res[this.config.property].map((el: string) => ({
  //             [this.config.data.value]: this.translateService.instant(el, {
  //               defaultKey: el,
  //             }),
  //             [this.config.data.key]: el,
  //           }));

  //           this.item.count = list.length;
  //           this.previewList = list;
  //           this.skipScroll = true;
  //         }
  //       });
  //   } else {
  //     this.skipScroll = false;
  //   }
  // }

  // public getValue(data: any, value: any) {
  //   let result: any;

  //   if (Array.isArray(value)) {
  //     value.forEach((el) => {
  //       result = result ? result : data[el];
  //     });
  //   } else {
  //     if (value.includes('{')) {
  //       result = FormatString.format(value, data);
  //     } else {
  //       result = data[value];
  //     }
  //   }

  //   return result;
  // }

  // public generateFields(data: any): string {
  //   let query = '&';
  //   query += `fields=${data.key}&`;

  //   if (Array.isArray(data.value)) {
  //     data.value.forEach((el: any) => {
  //       query += `fields=${el}&`;
  //     });
  //   } else {
  //     query += `fields=${data.value}&`;
  //   }

  //   return query;
  // }

  // public selectAll(list: any[]) {
  //   list.forEach((el) => {
  //     el.checked = true;
  //   });
  //   this.setValue(null, list);
  // }

  // public resetAll(list: any[]) {
  //   list.forEach((el) => {
  //     el.checked = false;
  //   });
  //   this.setValue(null, list);
  // }

  // public filterSelectedValues(list: any[]) {
  //   return list.filter(
  //     (el) => this.selected && this.selected.indexOf(el.id) > -1
  //   );
  // }

  // public removeItem(item: any) {
  //   item.checked = false;
  //   this.setValue(item, this.previewList);
  // }

  // public getTranslateKey() {
  //   return `filter.${this.config.key}.label`;
  // }

  // @HostListener('document:click', ['$event'])
  // public handleClick(event: MouseEvent) {
  //   let clickedComponent = event.target;
  //   let inside = false;
  //   do {
  //     if (clickedComponent === this.elementRef.nativeElement) {
  //       inside = true;
  //     }
  //     clickedComponent = (clickedComponent as HTMLElement).parentNode;
  //   } while (clickedComponent);
  //   if (!inside) {
  //     if (this.item && !this.item.hideAutocomplete) {
  //       this.item.hideAutocomplete = true;
  //       this.searchValue = '';
  //       setTimeout(() => {
  //         if (!(this.cd as any).destroyed) {
  //           this.cd.detectChanges();
  //         }
  //       }, 200);
  //       return;
  //     }
  //   }
  // }

  getStyle() {
    const offsetHeight = this.content?.nativeElement.offsetHeight || 0;

    return {
      top: `${offsetHeight}px`,
    };
  }

  selectAll() {
    this.patchOptions(true);
  }

  resetAll() {
    this.patchOptions(false);
  }

  onScrollDown() {
    const currentOffset = this._offset.value;

    if (!this.config.multiple && !this.config.property) {
      this._offset.next(this.limit + currentOffset);
    }
  }

  onSelect(option: FilterOption) {
    console.log(option);
  }

  onShowOptions() {
    this.options$ = combineLatest({
      search: this.searchControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ),
      offset: this._offset.asObservable(),
    }).pipe(
      switchMap(({ search, offset }) => this.getOptions({ search, offset })),
      scan(
        (acc, curr) => {
          if (acc.search !== curr.search) {
            return curr;
          } else {
            return {
              search: acc.search,
              options: [...acc.options, ...curr.options],
            };
          }
        },
        { search: '', options: <FilterOption[]>[] }
      ),
      map((response) => response.options),
      tap((options) => this._options.next(options)),
      takeUntil(
        merge(
          this._destroy,
          this.active$.pipe(
            skip(1),
            filter((value) => !value)
          )
        )
      )
    );

    this._active.next(true);

    setTimeout(() => {
      this._loading.next(true);
      this.searchControl.patchValue('');
      this._offset.next(0);
    });
    // setTimeout(() => {
    //   this._options.next([]);
    //   this.searchControl.patchValue('');
    //   this._offset.next(0);
    // });
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = (clickedComponent as HTMLElement).parentNode;
    } while (clickedComponent);
    if (!inside) {
      this._active.next(false);
    }
  }

  private patchOptions(value: boolean) {
    const options = this._options.value;

    this._options.next(
      options.map((el) => {
        el.control?.patchValue(value);

        return el;
      })
    );
  }

  private getOptions(config: { search: string; offset: number }) {
    this._loading.next(true);

    return this.genericFormService
      .get(this.config.data.endpoint, {
        search: config.search,
        offset: config.offset,
        limit: this.limit,
      })
      .pipe(
        takeUntil(this.active$.pipe(filter((el) => !el))),
        map((response) => {
          console.log(response);
          const responseProperty = this.config.property;

          if (responseProperty && response[responseProperty]) {
            const options: FilterOption[] = (
              response[responseProperty] as string[]
            ).map((el) => ({
              value: {
                label: el,
                key: el,
              },
              key: el,
              control: new FormControl(false)
            }));
            options.forEach((el) => this.addValueControl(el));

            return { search: config.search, options };
          }

          if (response.results) {
            const options: FilterOption[] = response.results.map((el: any) => ({
              value: {
                label: el[this.config.data.value],
                key: el[this.config.data.key],
              },
              key: el[this.config.data.key],
              control: new FormControl(false)
            }));

            options.forEach((el) => this.addValueControl(el));

            return { search: config.search, options };
          }

          return { search: config.search, options: [] };
        }),
        finalize(() => this._loading.next(false))
      );
  }

  private addValueControl(el: FilterOption) {
    if (!this.valueGroup.get(el.key)) {
      this.valueGroup.addControl(el.key, el.control);
    }
  }

  private cleanValueForm() {
    const unSelectedControls: string[] = [];

    for (const prop in this.valueGroup.value) {
      if (!this.valueGroup.value[prop]) {
        unSelectedControls.push(prop);
      }
    }

    unSelectedControls.forEach((key) => this.valueGroup.removeControl(key));
  }
}
