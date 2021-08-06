import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getTranslationKey } from '@webui/utilities';
import { BasicElementComponent } from '../basic-element/basic-element.component';

@Component({
  selector: 'app-image-list',
  templateUrl: './form-image-list.component.html',
  styleUrls: ['./form-image-list.component.scss']
})
export class FormImageListComponent
  extends BasicElementComponent
  implements OnInit {
  group: FormGroup;
  config: any;
  key: string;

  label: string;
  files: File[] = [];
  images: Array<{ preview: boolean; image: string }> = [];

  getTranslationKey = getTranslationKey;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.label = this.config.templateOptions.label;
    this.addControl(this.config, this.fb);
    if (this.config.value) {
      this.images = this.config.value.map((el) => {
        return {
          image: el.file
        };
      });
    }
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
    this.group.get(this.key).patchValue(this.files);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.group.get(this.key).patchValue(this.files);
  }
}
