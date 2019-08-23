export const Group = 'group';

export class GroupElement {

  type = Group;
  label?: string;
  children: any[];

  constructor(label?: string) {
    this.label = label;
  }

  setChildren(children: any[]) {
    this.children = [ ...children ];

    return this;
  }

}
