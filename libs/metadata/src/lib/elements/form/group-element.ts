export const Group = 'group';

export class GroupElement {
  type = Group;

  children: any[];

  label?: string;
  width?: number;
  main?: boolean;
  name?: string;

  constructor(label?: string) {
    this.label = label;
  }

  mainTab(name: string) {
    this.main = true;
    this.name = name;

    return this;
  }

  setChildren(children: any[]) {
    this.children = [ ...children ];

    return this;
  }

  setWidth(width: number) {
    this.width = width;

    return this;
  }

}
