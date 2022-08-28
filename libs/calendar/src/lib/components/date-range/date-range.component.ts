import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { DateRangeService } from '../../services';
import { DateRange } from '@webui/utilities';
import { Moment } from '@webui/time';

@Component({
  selector: 'webui-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
})
export class DateRangeComponent implements OnInit {
  @Input() type!: DateRange;
  @Input() date!: Moment;
  @Input() large!: boolean;

  @Output() dateChange = new EventEmitter();

  rangeTitle!: string;

  constructor(private dateRangeService: DateRangeService) {}

  ngOnInit() {
    this.updateRangeTitle();
  }

  nextRange(e: MouseEvent) {
    this.dateRangeService.nextRange(this.date, this.type);

    this.rangeChanged(e);
  }

  previousRange(e: MouseEvent) {
    this.dateRangeService.previousRange(this.date, this.type);

    this.rangeChanged(e);
  }

  rangeChanged(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    this.dateChange.emit(this.date);
    this.updateRangeTitle();
  }

  private updateRangeTitle() {
    this.rangeTitle = this.dateRangeService.getRangeTitle(this.date, this.type);
  }
}
