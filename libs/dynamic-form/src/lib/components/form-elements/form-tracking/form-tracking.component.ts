import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { GenericFormService } from '../../../services';
import { isMobile, getTimeInstance } from '@webui/utilities';

@Component({
  selector: 'app-form-tracking',
  templateUrl: './form-tracking.component.html',
  styleUrls: ['./form-tracking.component.scss']
})
export class FormTrackingComponent implements OnDestroy {

  public config;
  public modalInfo;
  public modalRef: NgbModalRef;

  public isMobile = isMobile;
  public timeInstance = getTimeInstance();

  @ViewChild('tracking', { static: false })
  public trakingModal;

  constructor(
    private genericFormService: GenericFormService,
    private modalService: NgbModal,
  ) {}

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public showTracking() {
    const timesheet = this.config.formData.value.data;
    const endpoint = `/candidate/location/${timesheet.job_offer.candidate_contact.id}/history/`;

    this.genericFormService.getByQuery(endpoint, `?timesheet=${timesheet.id}&limit=-1`)
      .subscribe((res) => {
        if (res.results.length) {
          const break_end = this.timeInstance(timesheet.break_ended_at);
          const break_start = this.timeInstance(timesheet.break_started_at);
          const end = this.timeInstance(timesheet.shift_ended_at);
          const start = this.timeInstance(timesheet.shift_started_at);

          const paths = res.results.map((point) => {
            return {
              lat: point.latitude,
              lng: point.longitude,
              log_at: point.log_at
            };
          });

          const breakPaths = paths.filter((el) => {
            const time = this.timeInstance(el.log_at);

            return time.isBefore(break_end) && time.isAfter(break_start);
          });

          this.modalInfo = {
            paths,
            breakPaths,
            timePoints: { start, end, break_start, break_end },
            jobsite: timesheet.jobsite.__str__,
            latitude: paths[0].lat,
            longitude: paths[0].lng,
          };

          this.trackingMarkerCoordinates(start);

          this.modalRef = this.modalService.open(this.trakingModal);
        }
      });
  }

  public trackingMarkerCoordinates(time) {
    if (this.modalInfo) {
      const item = this.modalInfo.paths.find((el) => time.format('hh:mm A') === this.timeInstance(el.log_at).format('hh:mm A'));
      if (item) {
        this.modalInfo.markerLatitude = item.lat;
        this.modalInfo.markerLongitude = item.lng;
      }
    }
  }

  public trackByTraking(data) {
    return data.log_at;
  }

}
