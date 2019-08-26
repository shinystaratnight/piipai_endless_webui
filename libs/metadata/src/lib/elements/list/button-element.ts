import { BasicListElement } from './basic-list-element';

export const Button = 'button';

export class ButtonElement extends BasicListElement {
  action: string;
  endpoint: string;

  customLink?: boolean;
  image?: string;
  noDelim?: boolean;
  title?: string;
  fields?: any[];
  icon?: string;
  text_color?: string;
  hidden?: string;

  constructor(field: string, action: string, title?: string) {
    super(field, Button);

    this.action = action;
    this.title = title;
  }

  setCustomLink(image?: string) {
    this.customLink = true;

    if (image) {
      this.image = image;
    }

    return this;
  }

  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;

    return this;
  }

  withoutDelim() {
    this.noDelim = true;

    return this;
  }

  setFields(fields: any[]) {
    this.fields = fields;

    return this;
  }

  setIcon(icon: string) {
    this.icon = `fa-${icon}`;

    return this;
  }

  setTextColor(color: string) {
    this.text_color = color;

    return this;
  }

  setHidden(value: string) {
    this.hidden = value;

    return this;
  }
}
