import { Field } from './field.model';

export interface CustomEvent {
  type: string;
  el: Field;
  value: any;
}
