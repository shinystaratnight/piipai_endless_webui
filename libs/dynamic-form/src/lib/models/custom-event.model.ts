import { Field } from "@webui/metadata";

export interface CustomEvent {
  type: string;
  el: Field;
  value: any;
  additionalData?: any;
  manual?: boolean;
}
