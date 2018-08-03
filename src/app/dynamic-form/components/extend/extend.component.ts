import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Field } from '../../models/field.model';

@Component({
  selector: 'extend',
  templateUrl: './extend.component.html',
  styleUrls: ['./extend.component.scss']
})
export class ExtendComponent implements OnInit {

  public config: Field;
  public viewData: FormGroup;
  public viewConfig: { [key: string]: Field };

  constructor(
    private fb: FormBuilder
  ) {}

  public ngOnInit() {
    this.viewData = this.fb.group({});

    this.viewConfig = {
      shiftsDates: {
        key: 'shifts',
        type: 'jobdates',
        value: this.config.value || []
      },
      extendDates: {
        key: 'extendDates',
        type: 'checkbox',
        templateOptions: {
          label: 'Dates'
        }
      },
      extendCandidates: {
        key: 'extendCandidates',
        type: 'checkbox',
        templateOptions: {
          label: 'Candidates',
          description: 'Some help text'
        }
      }
    };

  }

  public eventHandler(e) {
    console.log(e);
  }

}
