import { BasicListElement } from './basic-list-element';

export const Button = 'button';

export class ButtonElement extends BasicListElement {
  action: string;
  endpoint: string;

  customLink?: boolean;
  image?: string;
  noDelim?: boolean;

  constructor(field: string, action: string) {
    super(field, Button);

    this.action = action;
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
}
