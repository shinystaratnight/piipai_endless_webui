import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

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
  formData?: Subject<any>;
  data?: any;
  metadata?: Field[];
  options?: any[];
  dateTable?: boolean;
  prefilled?: any;
  send?: boolean;
  view?: boolean;
  mode?: BehaviorSubject<string>;
  saveField?: boolean;
  templateOptions?: {
    label?: string;
    type?: string;
    min?: number;
    max?: number;
    required?: boolean;
    readonly?: boolean;
  };
};
