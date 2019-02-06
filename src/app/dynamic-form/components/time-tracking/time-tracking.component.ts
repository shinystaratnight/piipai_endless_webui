import { Component, Input, OnInit } from '@angular/core';

import { Moment } from 'moment-timezone';

@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  styleUrls: ['./time-tracking.component.scss']
})
export class TimeTrackingComponent implements OnInit {
  @Input()
  public timePoints: {
    start: Moment,
    end: Moment,
    break_start: Moment,
    break_end: Moment
  };

  public breakStyles: any;

  public ngOnInit() {
    this.setBreakStyles();
  }

  public setBreakStyles() {
    const startValueOf = this.timePoints.start.valueOf();
    const endValueOf = this.timePoints.end.valueOf();
    const breakStartValueOf = this.timePoints.break_start.valueOf();
    const breakEndValueOf = this.timePoints.break_end.valueOf();

    const width = endValueOf - startValueOf;
    const left = ((breakStartValueOf - startValueOf) / width) * 100;
    const breakWidth = ((breakEndValueOf - breakStartValueOf) / width) * 100;

    this.breakStyles = {
      left: left + '%',
      width: breakWidth + '%',
      position: 'absolute'
    };
  }
}
