import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { getTimeByTomezone, getLocalTime } from '@webui/utilities';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit, OnDestroy {

  @Input() timezone: string;
  @Input() description: string;
  @Input() differMessage: string;

  time: string;
  differTimezone: boolean;

  private intervalId: any;
  private timeFormat = 'HH:mm DD/MM/YYYY (UTCZ)';

  ngOnInit() {
    const localTime = getLocalTime().format(this.timeFormat);

    this.intervalId = setInterval(() => {
      const momentTime = this.timezone ? getTimeByTomezone(this.timezone) : getLocalTime();
      this.time = momentTime.format(this.timeFormat);

      this.differTimezone = localTime !== this.time;
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
