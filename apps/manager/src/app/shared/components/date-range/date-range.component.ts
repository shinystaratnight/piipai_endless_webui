import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { Moment } from 'moment-timezone';

import { DateRangeService } from '../../services';
import { DateRange } from '../../../helpers';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit {

  @Input() type: DateRange;
  @Input() date: Moment;
  @Input() large: boolean;

  @Output() dateChange = new EventEmitter();

  rangeTitle: string;

  constructor(
    private dateRangeService: DateRangeService
  ) {}

  ngOnInit() {
    this.updateRangeTitle();
  }

  nextRange(e) {
    this.dateRangeService.nextRange(this.date, this.type);

    this.rangeChanged(e);
  }

  previousRange(e) {
    this.dateRangeService.previousRange(this.date, this.type);

    this.rangeChanged(e);
  }

  rangeChanged(e) {
    e.stopPropagation();
    e.preventDefault();

    this.dateChange.emit(this.date);
    this.updateRangeTitle();
  }

  private updateRangeTitle() {
    this.rangeTitle = this.dateRangeService.getRangeTitle(this.date, this.type);
  }
}
