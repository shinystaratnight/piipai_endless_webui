import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'webui-select-dates-modal',
  templateUrl: './select-dates-modal.component.html',
  styleUrls: ['./select-dates-modal.component.scss']
})
export class SelectDatesModalComponent {

  config = {
    key: 'shifts',
    type: 'jobdates',
    removeDate: null,
    value: []
  };

  group = new FormGroup({});

  constructor(
    private modal: NgbActiveModal
  ) {}

  close() {
    const data = this.group.value.shifts;

    this.modal.close(data.sort() || []);
  }

  dismiss() {
    this.modal.dismiss();
  }
}
