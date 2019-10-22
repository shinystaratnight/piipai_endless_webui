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

@Component({
  selector: 'app-form-tabs',
  templateUrl: './form-tabs.component.html',
  styleUrls: ['./form-tabs.component.scss']
})
export class FormTabsComponent implements OnInit, OnDestroy {
  public config: any;

  public group: FormGroup;
  public errors: any;
  public message: any;
  public formId: number;

  public canUpdate: boolean;
  public mode: string;
  public modeSubscription: Subscription;

  public saving: boolean;
  public saveSubscription: Subscription;

  @Output() public event = new EventEmitter();
  @Output() public buttonAction = new EventEmitter();

  public isMobileDevice = isMobile() && isCandidate();

  constructor(
    private formService: FormService,
    private cd: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    const form = this.formService.getForm(this.formId);

    this.canUpdate =
      this.formService.getAllowedMethods(this.formId).indexOf('update') > -1 &&
      this.config.editForm; //tslint:disable-line

    this.config.children.forEach(tab => {
      this.checkCustomLabel(tab);
    });

    if (form) {
      this.modeSubscription = form.mode.subscribe(mode => {
        this.mode = mode;

        this.cd.markForCheck();
      });

      this.saveSubscription = form.saveProcess.subscribe(saving => {
        this.saving = saving;
      });
    }
  }

  public checkCustomLabel(field) {
    if (field.templateOptions && field.templateOptions.customLabel) {
      const target = {
        value: undefined
      };

      getValueOfData(
        field.formData.value.data,
        field.templateOptions.customLabel.field,
        target
      );
      if (target.value) {
        field.templateOptions.label =
          field.templateOptions.customLabel.values[target.value];
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

  public eventHandler(e) {
    this.event.emit(e);
  }

  public buttonActionHandler(e) {
    this.buttonAction.emit(e);
  }

  public changeMode(mode: string) {
    this.mode = mode;

    this.formService.changeModeOfForm(this.formId, mode);
  }

  public hideEditButton() {
    return (
      this.formService.getForm(this.formId).hideEditButton ||
      this.config.hideEditButton
    );
  }
}
