import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Field } from '../../models/field.model';
import { BasicElementComponent
 } from '../basic-element/basic-element.component';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent extends BasicElementComponent implements OnInit {

  public config: Field;
  public group: any;
  public htmlText: any;

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],

        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'font': [] }],
        [{ 'align': [] }],
      ],
    },
  };

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.addControl(this.config, this.fb, this.config.templateOptions.required);
    this.createEvent();
    this.htmlText = this.config.value;
  }

  onSelectionChanged() {
    this.group.get(this.key).patchValue(this.htmlText);
  }

  onContentChanged() {
    this.group.get(this.key).patchValue(this.htmlText);
  }

}
