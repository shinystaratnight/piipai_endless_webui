import {
  BasicFormElement,
  BasicElementTemplateOptions
} from './basic-form-element';

export const Datepicker = 'datepicker';

export enum DatepickerType {
  Date = 'date',
  Time = 'time',
  Datetime = 'datetime'
}

interface DatepickerElementTemplateOptions extends BasicElementTemplateOptions {
  type: DatepickerType;
  showTime?: boolean;
}

export class DatepickerElement extends BasicFormElement {
  templateOptions: DatepickerElementTemplateOptions;

  inline?: boolean;
  rightPosition: boolean;

  constructor(key: string, label: string, type: DatepickerType) {
    super(key, label, Datepicker);

    this.templateOptions.type = type;
    this.rightPosition = true;
  }

  setInline() {
    this.inline = true;

    return this;
  }

  setShowTime() {
    this.templateOptions.showTime = true;

    return this;
  }

  setDropdonLeft() {
    this.rightPosition = false;

    return this;
  }
}
