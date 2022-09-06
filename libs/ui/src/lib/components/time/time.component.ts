import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

import { Time } from '@webui/time';

@Component({
  selector: 'webui-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeComponent implements OnInit, OnDestroy {
  @Input() timezone!: string;
  @Input() description!: string;
  @Input() differMessage = '';
  @Input() translateKey = '';

  @Output() init: EventEmitter<boolean> = new EventEmitter();

  time!: string;
  differTimezone!: boolean;

  private intervalId!: number;
  private timeFormat = 'HH:mm DD/MM/YYYY (UTCZ)';

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.intervalId = setInterval(() => {
      if (!this.time) {
        this.init.emit(true);
      }

      const localTime = Time.now().format(this.timeFormat);
      this.time = Time.now(this.timezone).format(this.timeFormat);

      this.differTimezone = localTime !== this.time;
      this.cd.detectChanges();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
