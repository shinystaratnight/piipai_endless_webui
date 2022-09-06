import { Component, Input, ElementRef, ViewChild, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'webui-dropdown',
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent implements OnInit, OnDestroy {
  @ViewChild('autocomplete') elementRef!: ElementRef;

  @Input() data!: any[];
  @Input() count!: number;
  @Input() loading!: boolean;

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() set: EventEmitter<any> = new EventEmitter();
  @Output() upload: EventEmitter<void> = new EventEmitter();

  modalScrollDistance = 2;
  modalScrollThrottle = 50;

  searchInput!: FormControl;

  get isCanUploadMore() {
    return this.count > this.data.length;
  }

  private searchSubscription!: Subscription;

  ngOnInit() {
    this.searchInput = new FormControl('');
    this.searchSubscription = this.searchInput.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.onSearch(value);
      });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  onModalScrollDown() {
    if (this.isCanUploadMore) {
      this.upload.next();
    }
  }

  setValue(value: any) {
    this.set.next(value);
  }

  onSearch(text: string) {
    this.search.next(text);
  }

  trackByFn(value: any) {
    return value.id;
  }
}
