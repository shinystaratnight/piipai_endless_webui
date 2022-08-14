import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { FormService } from '../../services';
import { getValueOfData } from '../../helpers';
import { isMobile, isCandidate } from '@webui/utilities';
import { Form } from '../../models';

@Component({
  selector: 'webui-form-tabs',
  templateUrl: './form-tabs.component.html',
  styleUrls: ['./form-tabs.component.scss']
})
export class FormTabsComponent implements OnInit, OnDestroy {
  public config: any;

  public group!: FormGroup;
  public errors: any;
  public message: any;
  public formId!: number;

  public canUpdate!: boolean;
  public mode!: string;
  public modeSubscription!: Subscription;

  public saving!: boolean;
  public saveSubscription!: Subscription;
  public form!: Form;

  @Output() public event = new EventEmitter();
  @Output() public buttonAction = new EventEmitter();

  public isMobileDevice = isMobile() && isCandidate();

  constructor(
    private formService: FormService,
    private cd: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.form = this.formService.getForm(this.formId);

    this.canUpdate =
      this.formService.getAllowedMethods(this.formId).indexOf('update') > -1 &&
      this.config.editForm; //tslint:disable-line

    this.config.children.forEach((tab: any) => {
      this.checkCustomLabel(tab);
    });

    if (this.form) {
      this.modeSubscription = this.form.mode.subscribe((mode) => {
        this.mode = mode;

        this.cd.markForCheck();
      });

      this.saveSubscription = this.form.saveProcess.subscribe((saving) => {
        this.saving = saving;
      });
    }
  }

  public checkCustomLabel(field: any): void {
    const { templateOptions, formData } = field;

    if (templateOptions && templateOptions.customLabel) {
      const target = {
        value: undefined
      };

      getValueOfData(
        formData.value.data,
        templateOptions.customLabel.field,
        target
      );
      if (target.value) {
        templateOptions.label =
          templateOptions.customLabel.values[target.value];
      }
    }
  }

  public ngOnDestroy() {
    if (this.modeSubscription) {
      this.modeSubscription.unsubscribe();
    }

    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  public eventHandler(e: any) {
    this.event.emit(e);
  }

  public buttonActionHandler(e: any): void {
    this.buttonAction.emit(e);
  }

  public changeMode(mode: string): void {
    this.mode = mode;

    this.formService.changeModeOfForm(this.formId, mode);
  }

  public hideEditButton() {
    return (
      this.formService.getForm(this.formId).hideEditButton ||
      this.config.hideEditButton
    );
  }

  public getTranslateKey(key: string, type: string) {
    return `tabs.${key}.${type}`;
  }
}
