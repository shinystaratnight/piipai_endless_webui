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
  delay,
} from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { checkAndReturnTranslation, FormatString } from '@webui/utilities';
import { Language } from '@webui/models';

const listLimit = 10;

type FilterValue = {
  label: string;
  key: string;
};

@Component({
  selector: 'webui-filter-related',
  templateUrl: 'filter-related.component.html',
  styleUrls: ['./filter-related.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterRelatedComponent implements OnInit, OnDestroy {
  private _destroy = new Subject<void>();
  private _value = new BehaviorSubject<FilterValue[] | null>(null);
  private _options = new BehaviorSubject<FilterOption[] | null>(null);
  private _offset = new BehaviorSubject<number>(0);
  private _loading = new BehaviorSubject<boolean>(false);
  private _active = new BehaviorSubject<boolean>(false);
  private _selectedOptions = new BehaviorSubject<FilterOption[]>([]);

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

  value = new Set<FilterOption | undefined>();

  limit = listLimit;

  value$ = this._value.asObservable();
  options$ = this._options.asObservable();
  loading$ = this._loading.asObservable();
  active$ = this._active.asObservable();
  selectedOptions$ = this._selectedOptions.asObservable();
  hasQuery$ = combineLatest({
    active: this.active$,
    value: this.value$,
  }).pipe(map((value) => Boolean(!value.active && value.value)));

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

  get selectedElement(): (FilterOption | undefined)[] {
    return Array.from(this.value.values());
  }

  public ngOnInit() {
    if (this.config.multiple) {
      this.limit = -1;
    }

    this.active$
      .pipe(takeUntil(this._destroy), distinctUntilChanged(), skip(1))
      .subscribe((active) => {
        if (!active) {
          if (this.config.multiple) {
            // TODO: implement start filter
          } else {
            this._options.next([]);
            this.cleanValueForm();
          }

          this.onChange(this._value.value);
        }
      });

    if (this.config.multiple) {
      this.valueGroup.valueChanges
        .pipe(takeUntil(this._destroy))
        .subscribe((value) => {
          this.value.clear();
          console.log(value);
          console.log(this);

          for (const id in value) {
            value[id] &&
              this.value.add(this._options.value?.find((el) => el.key === id));
          }

          this._selectedOptions.next(
            this._options.value?.filter((el) => this.value.has(el)) || []
          );
        });
    }

    this.selectedOptions$
      .pipe(takeUntil(this._destroy))
      .subscribe((options) => {
        if (options.length) {
          this._value.next(options.map((option) => option.value));
        } else {
          this._value.next(null);
        }

        if (!this.config.multiple) {
          this._active.next(false);
        }
      });

    // const { multiple = false } = this.config;
    // this.multiple = multiple;
    // this.limit = multiple ? -1 : listLimit;

    this.route.queryParams
      .pipe(delay(200), takeUntil(this._destroy))
      .subscribe(() => {
        this.updateFilter();
      });
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
    console.log('destroy');
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

  public onChange(value: FilterValue[] | null) {
    this.fs.generateQuery(
      value ? this.genericQuery(this.config.query, value) : '',
      this.config.key,
      this.config.listName,
      this.value
    );
    this.changeQuery(value);
  }

  public genericQuery(query: string, value: FilterValue[]) {
    const result = value.reduce(
      (acc, curr) => (acc += `${query}=${curr?.key}&`),
      ''
    );

    return result.substring(0, result.length - 1);
  }

  public changeQuery(value: FilterValue[] | null) {
    this.event.emit({
      list: this.config.listName,
      key: this.config.query,
      value,
    });
  }

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

  public updateFilter() {
    const data = this.fs.getQueries(this.config.listName, this.config.key);

    if (data) {
      const { byQuery, query = '' } = data;

      if (byQuery) {
        const keys: string[] = [];
        query.split('&').forEach((el: string) => keys.push(el.split('=')[1]));

        if (this.config.multiple) {
          const options$ = this._options.value
            ? this._options.asObservable()
            : this.getOptions(
                {
                  search: '',
                  offset: 0,
                  initialize: true,
                },
                keys
              ).pipe(map((response) => response.options));

          options$.subscribe((options) => {
            if (!this._options.value) {
              this._options.next(options);
            }
            this._selectedOptions.next(
              options?.filter((option) => keys.includes(option.key)) || []
            );
          });
        } else {
          this.genericFormService
            .getByQuery(this.config.data.endpoint, `/${keys[0]}/`)
            .subscribe((response) => {
              if (response) {
                const { property } = this.config;

                const config = {
                  ...this.config,
                  countryCode: this.siteSettingsService.settings.country_code,
                  lang: this.translateService.currentLang,
                };
                const option = new FilterOption(response, config, keys);
                this._selectedOptions.next([option]);
              }
            });
        }
      }
    }

    // if (data) {
    //   if (data.byQuery) {
    //     if (this.settingValue) {
    //       this.settingValue = false;
    //       this.parseQuery(data.query);
    //     }
    //   } else {
    //     if (this.settingValue) {
    //       this.settingValue = false;
    //       this.item = data;
    //       this.genericQuery(this.config.query);
    //     }
    //   }
    // } else {
    //   this.query = '';
    //   if (!this.item) {
    //     this.item = this.createElement();
    //     if (this.multiple) {
    //       this.item.displayValue = `Select ${this.config.label}`;
    //     } else {
    //       this.item.displayValue = data ? this.getOption(data) : 'All';
    //     }
    //   }

    //   if (this.item && !this.multiple) {
    //     this.item.data = '';
    //     this.item.displayValue = 'All';
    //   } else if (this.previewList) {
    //     this.previewList.forEach((el) => {
    //       el.checked = false;
    //     });
    //     this.selected = this.previewList.filter((item) => item.checked);
    //     this.item.data = this.selected.map((el) =>
    //       this.getValue(el, this.config.data.key)
    //     );
    //     this.item.displayValue =
    //       this.selected && this.selected.length
    //         ? `Selected ${this.selected.length} ${this.config.label}`
    //         : `Select ${this.config.label}`;
    //   }
    // }

    // this.cd.detectChanges();
  }

  public resetFilter() {
    this._active.next(false);
    this._selectedOptions.next([]);
    this._options.value?.forEach((option) =>
      option.control.patchValue(false, { emitEvent: true })
    );
    this._value.next(null);
    this.fs.generateQuery('', this.config.key, this.config.listName, null);
    this.changeQuery(null);
  }

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

  onShowOptions() {
    if (this._options.value?.length && this.config.multiple) {
      this._active.next(true);
      this.options$ = this._options.asObservable();
      return;
    }

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
  }

  onRemoveOption(option: FilterOption) {
    option.control.patchValue(false);
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
      if (this._active.value) {
        this._active.next(false);
      }
    }
  }

  private patchOptions(value: boolean) {
    this._options.value?.forEach((option) => option?.control.patchValue(value));
  }

  private getOptions(
    params: {
      search: string;
      offset: number;
      initialize?: boolean;
    },
    selectedValues?: string[]
  ) {
    this._loading.next(true);

    return this.genericFormService
      .get(this.config.data.endpoint, {
        search: params.search,
        offset: params.offset,
        limit: this.config.multiple ? -1 : this.limit,
        fields: Array.isArray(this.config.data.value)
          ? this.config.data.value
          : [],
      })
      .pipe(
        takeUntil(
          this.active$.pipe(filter((el) => (!params.initialize ? !el : false)))
        ),
        map((response) => {
          const { property } = this.config;

          const config = {
            ...this.config,
            countryCode: this.siteSettingsService.settings.country_code,
            lang: this.translateService.currentLang,
          };

          if (this.config.property && response[this.config.property]) {
            const options: FilterOption[] = (
              response[property] as string[]
            ).map((el) => new FilterOption(el, config, selectedValues));
            options.forEach((el) => this.addValueControl(el));

            return { search: params.search, options };
          }

          if (response.results) {
            const options: FilterOption[] = response.results.map(
              (el: any) => new FilterOption(el, config, selectedValues)
            );

            options.forEach((el) => this.addValueControl(el));

            return { search: params.search, options };
          }

          return { search: params.search, options: [] };
        }),
        finalize(() => this._loading.next(false))
      );
  }

  private addValueControl(el: FilterOption) {
    if (!this.valueGroup.get(el.key)) {
      this.valueGroup.addControl(el.key, el.control, { emitEvent: false });

      if (!this.config.multiple) {
        this.subscribeOnChange(el.key, el.control);
      }
    }
  }

  private cleanValueForm() {
    const controls: string[] = [];

    for (const prop in this.valueGroup.value) {
      controls.push(prop);
    }

    controls.forEach((key) => this.valueGroup.removeControl(key));
  }

  private subscribeOnChange(id: string, control: FormControl) {
    control.valueChanges.subscribe(() => {
      const option = this._options.value?.find((el) => el.key == id);

      if (option) {
        option.control.patchValue(false, { emitEvent: false });
        this._selectedOptions.next([option]);
      }
    });
  }
}

class FilterOption {
  value: FilterValue;
  control: FormControl;
  key: string;

  constructor(payload: any, config: any, value?: string[]) {
    const { data, property, countryCode, lang } = config;
    const useProperty = Boolean(property);

    this.value = useProperty
      ? {
          label: payload,
          key: payload,
        }
      : {
          label: this.hasFormatBraces(data.value)
            ? FormatString.format(data.value, payload)
            : checkAndReturnTranslation(
                payload,
                countryCode,
                lang as Language
              ) || payload[data.value],
          key: payload[data.key],
        };
    this.key = useProperty ? payload : payload[data.key];
    this.control = new FormControl(!!value && value.includes(this.key));
  }

  private hasFormatBraces(value: string) {
    return value.includes('{') && value.includes('}');
  }
}
