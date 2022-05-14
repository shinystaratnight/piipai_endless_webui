import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { isMobile } from '@webui/utilities';
import { Time } from '@webui/time';

@Component({
  selector: 'app-tracking-modal',
  templateUrl: './tracking-modal.component.html',
  styleUrls: ['./tracking-modal.component.scss'],
})
export class TrackingModalComponent implements OnInit {
  timesheet: any;
  data: any[];

  jobsite: string;
  path: Array<{ lat: number; lng: number; log_at: string }>;
  breakPath: Array<{ lat: number; lng: number; log_at: string }>;
  timePoints: { start: any; end: any; break_start: any; break_end: any };
  latitude: number;
  longitude: number;

  markerLatitude: number;
  markerLongitude: number;

  timeInstance: any;
  isMobile = isMobile;

  constructor(private modal: NgbActiveModal) {}

  ngOnInit() {
    const timezone = this.timesheet.time_zone || this.timesheet.timezone;
    const break_end = Time.parse(this.timesheet.break_ended_at, { timezone });
    const break_start = Time.parse(this.timesheet.break_started_at, {
      timezone,
    });
    const end = Time.parse(this.timesheet.shift_ended_at, { timezone });
    const start = Time.parse(this.timesheet.shift_started_at, { timezone });

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
      const time = this.timeInstance(el.log_at);

      return time.isBefore(break_end) && time.isAfter(break_start);
    });

    this.trackingMarkerCoordinates(start);
  }

  dismiss() {
    this.modal.dismiss();
  }

  public trackingMarkerCoordinates(time) {
    const item = this.path.find(
      (el) =>
        time.format('hh:mm A') ===
        this.timeInstance(el.log_at).format('hh:mm A')
    );

    if (item) {
      this.markerLatitude = item.lat;
      this.markerLongitude = item.lng;
    }
  }

  public trackByTracking(data) {
    return data.log_at;
  }
}
