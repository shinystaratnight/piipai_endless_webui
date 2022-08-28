import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: 'webui-form-element-view',
  templateUrl: './form-element-view.components.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormElementViewComponent {

  @Input() key!: string;
  @Input() label!: string;
  @Input() many!: boolean;
  @Input() errors!: {[key: string]: string};
  @Input() messages!: {[key: string]: string};

  get error() {
    return this.errors && this.errors[this.key];
  }

  get message() {
    return this.errors && this.errors[this.key];
  }

}
