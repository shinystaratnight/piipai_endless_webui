import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormService } from '../../services';

@Component({
  selector: 'form-tabs',
  templateUrl: './form-tabs.component.html',
  styleUrls: ['./form-tabs.component.scss']
})

export class FormTabsComponent implements OnInit {

  public config: any;

  public group: FormGroup;
  public errors: any;
  public message: any;
  public formId: number;

  public canUpdate: boolean;
  public mode: string;

  @Output() public event = new EventEmitter();
  @Output() public buttonAction = new EventEmitter();

  constructor(
    private formService: FormService
  ) {}

  public ngOnInit() {
    this.canUpdate = this.formService.getAllowedMethods(this.formId).indexOf('update') > -1;

    this.formService.getForm(this.formId).hasTabs = true;
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }

  public changeMode() {
    this.mode = 'edit';
    this.formService.changeModeOfForm(this.formId, 'edit');
  }

}
