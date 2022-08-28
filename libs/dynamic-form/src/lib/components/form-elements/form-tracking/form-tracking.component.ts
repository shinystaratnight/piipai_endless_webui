import { Component, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { GenericFormService } from '../../../services';

import { TrackingModalComponent } from '../../../modals';

@Component({
  selector: 'webui-form-tracking',
  templateUrl: './form-tracking.component.html',
  styleUrls: ['./form-tracking.component.scss'],
})
export class FormTrackingComponent implements OnDestroy {
  public config: any;
  public modalRef!: NgbModalRef;

  constructor(
    private genericFormService: GenericFormService,
    private modalService: NgbModal
  ) {}

  public ngOnDestroy() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  public showTracking() {
    const timesheet = this.config.formData.value.data;
    const endpoint = `/candidate/location/${timesheet.job_offer.candidate_contact.id}/history/`;

    this.genericFormService
      .getByQuery(endpoint, `?timesheet=${timesheet.id}&limit=-1`)
      .subscribe((res) => {
        if (res.results.length) {
          this.modalRef = this.modalService.open(TrackingModalComponent, {
            backdrop: 'static',
          });
          this.modalRef.componentInstance.timesheet = timesheet;
          this.modalRef.componentInstance.data = res.results;
        }
      });
  }
}
