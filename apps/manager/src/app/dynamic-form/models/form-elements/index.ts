import { SelectElement, Select } from './select-element';

export type FormElement = SelectElement;

export enum Type { Select }

export function createFormElement(type: Type, key: string, label: string): FormElement {
  switch (type) {
    case Type.Select:
      return new SelectElement(key, label);

    default:
      break;
  }
}
