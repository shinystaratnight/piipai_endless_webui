export class BasicListElement {
  field: string;
  type: string;

  text?: string;
  styles?: string[];
  showIf?: Array<string | { [key: string]: any }>;

  constructor(field: string, type: string) {
    this.field = field;
    this.type = type;
  }

  setStyles(classes: string[]) {
    this.styles = [ ...classes ];

    return this;
  }

  setShowIfRule(showIf: Array<string | { [key: string]: any }>) {
    this.showIf = showIf;

    return this;
  }

  setDisplay(display: string) {
    this.text = display;

    return this;
  }

}
