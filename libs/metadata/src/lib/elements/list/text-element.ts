import { BasicListElement } from './basic-list-element';

export const Text = 'text';

export class TextElement extends BasicListElement {
  label?: string;
  param?: string;
  score?: boolean;
  display?: string;

  constructor(field: string, label?: string) {
    super(field, Text);

    this.label = label;
  }

  update(config: { param: string }) {
    this.param = config.param;

    return this;
  }

  scoreField() {
    this.score = true;

    return this;
  }

  setFormatValue(format: string) {
    this.display = format;

    return this;
  }
}
