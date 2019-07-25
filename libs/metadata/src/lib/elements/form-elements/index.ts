import { SelectElement, Select } from './select-element';

export type FormElement = SelectElement;

export enum FormElementType { Select }

export function createFormElement(type: FormElementType, key: string, label: string): FormElement {
  switch (type) {
    case FormElementType.Select:
      return new SelectElement(key, label);

    default:
      break;
  }
}
