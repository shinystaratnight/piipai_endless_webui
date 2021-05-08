export const Collapse = 'collapse';

export class CollapseElement {
  type = Collapse;
  children: any[];
  name?: string;
  translateKey?: string;
  collapsed: boolean;

  constructor(name?: string, translateKey?: string, collapsed: boolean = false) {
    this.name = name;
    this.translateKey = translateKey;
    this.collapsed = collapsed;
  }

  setChildren(children: any[]) {
    this.children = [...children];

    return this;
  }
}
