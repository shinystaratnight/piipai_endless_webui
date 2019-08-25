import { BasicListElement } from './basic-list-element';

export const Static = 'static';

export class StaticElement extends BasicListElement {
  label?: string;

  constructor(field: string) {
    super(field, Static);
  }

  setLabel(label: string) {
    this.label = label;

    return this;
  }

}
