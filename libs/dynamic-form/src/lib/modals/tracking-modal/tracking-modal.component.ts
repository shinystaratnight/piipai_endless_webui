import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { isMobile } from '@webui/utilities';
import { Moment, Time } from '@webui/time';

@Component({
  selector: 'webui-tracking-modal',
  templateUrl: './tracking-modal.component.html',
  styleUrls: ['./tracking-modal.component.scss'],
})
export class TrackingModalComponent implements OnInit {
  timesheet: any;
  data!: any[];

  jobsite!: string;
  path!: Array<{ lat: number; lng: number; log_at: string }>;
  breakPath!: Array<{ lat: number; lng: number; log_at: string }>;
  timePoints!: { start: any; end: any; break_start: any; break_end: any };
  latitude!: number;
  longitude!: number;

  markerPosition?: { lat: number; lng: number }

  markerLatitude?: number;
  markerLongitude?: number;

  timezone!: string;

  timeInstance: any;
  isMobile = isMobile;

  constructor(private modal: NgbActiveModal) {}

  ngOnInit() {
    this.timezone = this.timesheet.time_zone || this.timesheet.timezone;
    const break_end = Time.parse(this.timesheet.break_ended_at, { timezone: this.timezone });
    const break_start = Time.parse(this.timesheet.break_started_at, {
      timezone: this.timezone,
    });
    const end = Time.parse(this.timesheet.shift_ended_at, { timezone: this.timezone });
    const start = Time.parse(this.timesheet.shift_started_at, { timezone: this.timezone });

    this.timePoints = { start, end, break_start, break_end };
    this.jobsite = this.timesheet.jobsite.__str__;

    this.path = this.data.map((point) => {
      return {
        lat: point.latitude,
        lng: point.longitude,
        log_at: point.log_at,
      };
    });

    this.latitude = this.path[0].lat;
    this.longitude = this.path[0].lng;

    this.breakPath = this.path.filter((el) => {
      const time = Time.parse(el.log_at, { timezone: this.timezone });

      return time.isBefore(break_end) && time.isAfter(break_start);
    });

    this.trackingMarkerCoordinates(start);
  }

  dismiss() {
    this.modal.dismiss();
  }

  public trackingMarkerCoordinates(time: Moment) {
    const item = this.path.find(
      (el) =>
        time.format('hh:mm A') ===
        Time.parse(el.log_at, { timezone: this.timezone }).format('hh:mm A')
    );

    if (item) {
      this.markerPosition = {
        lat: item.lat,
        lng: item.lng
      }
    }
  }

  public trackByTracking(data: any) {
    return data.log_at;
  }
}
