export const Text = 'text';

export class TextElement {
  type = Text;

  field: string;
  label?: string;
  param?: string;

  constructor(field: string, label?: string) {
    this.field = field;
    this.label = label;
  }

  update(config: { param: string }) {
    this.param = config.param;

    return this;
  }
}
