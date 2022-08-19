import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getTranslationKey } from '@webui/utilities';
import { BasicElementComponent } from '../basic-element/basic-element.component';

@Component({
  selector: 'webui-image-list',
  templateUrl: './form-image-list.component.html',
  styleUrls: ['./form-image-list.component.scss']
})
export class FormImageListComponent
  extends BasicElementComponent
  implements OnInit
{
  override group!: FormGroup;
  override config!: any;
  override key!: string;

  label!: string;
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
      this.images = this.config.value.map((el: any) => {
        return {
          image: el.file
        };
      });
    }

    this.group.get(this.key)?.valueChanges.subscribe((value) => {
      if (Object.is(value, null)) {
        this.files = [];
      }
    });
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    this.group.get(this.key)?.patchValue(this.files);
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.group.get(this.key)?.patchValue(this.files);
  }
}
