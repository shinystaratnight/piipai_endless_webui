import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '@webui/dynamic-form';
import { CollapseElement } from 'libs/metadata/src/lib/elements/form/collapse-element';
import { IFormElement } from '../../interfaces';
import { Form } from '../../models';

@Component({
  selector: 'app-form-collapse',
  templateUrl: './form-collapse.component.html',
  styleUrls: ['./form-collapse.component.scss']
})
export class FormCollapseComponent implements OnInit {
  public config: CollapseElement & IFormElement;
  public group: FormGroup;
  public errors: any;
  public message: any;

  isCollapsed: boolean;
  translationKey: string;

  @Output()
  public event: EventEmitter<any> = new EventEmitter();

  @Output()
  public buttonAction: EventEmitter<any> = new EventEmitter();

  constructor(private formService: FormService) {}

  public ngOnInit() {
    const { collapsed, isCollapsed, translateKey } = this.config;
    this.translationKey = `group.${translateKey}`;

    if (isCollapsed && this.formService) {
      const form: Form = this.formService.getForm(this.config.formId);

      if (form) {
        this.isCollapsed = isCollapsed(form.initialData);
      }
    } else {
      this.isCollapsed = collapsed;
    }
  }

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }
}
