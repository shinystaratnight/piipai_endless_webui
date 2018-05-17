import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-row',
  templateUrl: 'form-row.component.html',
  styleUrls: ['./form-row.component.scss']
})

export class FormRowComponent implements OnInit {
  public config: any;
  public group: FormGroup;
  public errors: any;
  public message: any;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  public ngOnInit() {
    if (!this.config.editForm && this.config.label) {
      this.config.label = this.config.label.indexOf('{') === -1 ? this.config.label : '';
    }
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }
}
