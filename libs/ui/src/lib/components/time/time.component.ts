import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { getTimeByTomezone, getLocalTime } from '@webui/utilities';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeComponent implements OnInit, OnDestroy {
  @Input() timezone: string;
  @Input() description: string;
  @Input() differMessage: string;
  @Input() translateKey: string;

  @Output() init: EventEmitter<boolean> = new EventEmitter();

  time: string;
  differTimezone: boolean;

  private intervalId: any;
  private timeFormat = 'HH:mm DD/MM/YYYY (UTCZ)';

  ngOnInit() {
    this.intervalId = setInterval(() => {
      if (!this.time) {
        this.init.emit(true);
      }

      const localTime = getLocalTime().format(this.timeFormat);
      const momentTime = this.timezone
        ? getTimeByTomezone(this.timezone)
        : getLocalTime();
      this.time = momentTime.format(this.timeFormat);

      this.differTimezone = localTime !== this.time;
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
