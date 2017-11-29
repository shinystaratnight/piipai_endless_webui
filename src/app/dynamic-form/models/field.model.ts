import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface Field {
  type?: string;
  key?: string;
  read_only?: boolean;
  hide?: boolean;
  many?: boolean;
  list?: boolean;
  children?: Field[];
  showIf?: any[];
  value?: any;
  activeMetadata?: Field[];
  hidden?: BehaviorSubject<boolean>;
  data?: any;
  metadata?: Field[];
  options?: any[];
  dateTable?: boolean;
  prefilled?: any;
  send?: boolean;
  view?: boolean;
  mode?: BehaviorSubject<string>;
  templateOptions?: {
    label?: string;
    type?: string;
    min?: number;
    max?: number;
    required?: boolean;
    readonly?: boolean;
  };
};
