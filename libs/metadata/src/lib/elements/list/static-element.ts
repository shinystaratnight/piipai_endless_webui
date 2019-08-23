export const Static = 'static';

export class StaticElement {
  type = Static;

  field: string;

  constructor(field: string) {
    this.field = field;
  }
}
