import { Field } from '@webui/data';

export interface CustomEvent {
  type: string;
  el: Field;
  value: any;
  additionalData?: any;
  manual?: boolean;
}
