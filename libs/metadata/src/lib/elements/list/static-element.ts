import { BasicListElement } from './basic-list-element';

export const Static = 'static';

export class StaticElement extends BasicListElement {
  label?: string;
  hideValue?: any;
  color?: string;
  setColor?: string;
  info?: string;
  description?: string;

  constructor(field: string) {
    super(field, Static);
  }

  setLabel(label: string) {
    this.label = label;

    return this;
  }

  setHideValue(value: any) {
    this.hideValue = value;

    return this;
  }

  changeColor(color: string, setColorIf?: string) {
    this.color = color;
    this.setColor = setColorIf;

    return this;
  }

  setInfoText(text: string) {
    this.info = text;

    return this;
  }

  setDescriptionStyle() {
    this.description = ' ';

    return this;
  }
}
