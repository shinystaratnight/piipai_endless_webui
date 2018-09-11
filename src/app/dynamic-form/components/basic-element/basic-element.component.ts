import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/forms/src/facade/async';

export class BasicElementComponent {

  public group: FormGroup;
  public key: any;
  public config: any;
  public event: EventEmitter<any> = new EventEmitter();

  public addControl(config, fb: FormBuilder, required?: boolean) {
    if (config.key) {
      const keys = config.key.split('.');
      if (keys.length > 1) {
        this.addControls(this.group, keys, fb);
      } else {
        if (config.type === 'related' && !config.many) {
          keys.push('id');
          this.addControls(this.group, keys, fb, required);
        } else if (config.type !== 'static' || (config.type === 'static' && !config.read_only)) {
          this.group.addControl(config.key, fb.control(undefined, required ? Validators.required : undefined)); //tslint:disable-line
          this.key = config.key;
        }
      }
    }
  }

  public addFlags(element, config) {
    if (config.templateOptions.type === 'number') {
      element.nativeElement.step = 'any';
    }
    element.nativeElement.required =
      config.type !== 'datepicker' && config.templateOptions.required;
    if (config.templateOptions.max) {
      element.nativeElement.maxLength = config.templateOptions.max;
    }
    if (config.templateOptions.min) {
      let min = (config.templateOptions.min < 0) ? 0 : config.templateOptions.min;
      element.nativeElement.minLength = min;
    }
    if (config.templateOptions.max
      && (config.templateOptions.type === 'number' || config.templateOptions.type === 'score')) {
      element.nativeElement.max = config.templateOptions.max;
    }
    if ((config.templateOptions.min || config.templateOptions.min === 0)
      && (config.templateOptions.type === 'number' || config.templateOptions.type === 'score')) {
      element.nativeElement.min = config.templateOptions.min;
    }
    if (config.templateOptions.cols) {
      element.nativeElement.cols = config.templateOptions.cols;
    }
    if (config.templateOptions.disabled) {
      element.nativeElement.disabled = config.templateOptions.disabled;
    }
    if (config.templateOptions.rows) {
      element.nativeElement.rows = config.templateOptions.rows;
    }
  }

  public createEvent() {
    this.event.emit({
      type: 'create',
      el: this.config,
      value: this.config.key === 'id'
        ? { id: this.group.get(this.key).value }
        : this.group.get(this.key).value
    });
  }

  private addElement(group, el, fb, required?: boolean) {
    group.addControl(el, fb.control('', required ? Validators.required : undefined));
  }

  private addGroup(group, el, fb) {
    group.addControl(el, fb.group({}));
  }

  private addControls(group, keys: string[], fb, required?: boolean) {
    const el = keys.shift();
    if (keys.length === 0) {
      if (!group.get(el)) {
        this.addElement(group, el, fb, required);
      }
      this.key = el;
      this.group = group;
    } else if (!group.get(el)) {
      this.addGroup(group, el, fb);
      this.addControls(group.get(el), keys, fb, required);
    } else {
      this.addControls(group.get(el), keys, fb, required);
    }
  };
}
