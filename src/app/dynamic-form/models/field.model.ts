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
  formData?: BehaviorSubject<any>;
  data?: any;
  metadata?: Field[];
  options?: any[];
  dateTable?: boolean;
  prefilled?: any;
  send?: boolean;
  view?: boolean;
  mode?: BehaviorSubject<string>;
  saveField?: boolean;
  endpoint?: string;
  custom?: any;
  collapsed?: boolean;
  editForm?: boolean;
  metadata_query?: string | any;
  add_metadata_query?: string | any;
  customValue?: any;
  default?: any;
  autocompleteData?: Subject<any>;
  timelineSubject?: Subject<any>;
  autocomplete?: any[];
  query?: any;
  currentQuery?: string;
  useOptions?: boolean;
  doNotChoice?: boolean;
  defaultData?: any;
  delay?: any;
  delayData?: any;
  formId: number;
  errorMessage?: {
    field: string,
    message: string,
    visible?: boolean
  };
  checkObject?: any;
  values?: any;
  related?: any;
  readonly?: any;
  update?: any;
  updateFormData?: boolean;
  templateOptions?: {
    label?: string;
    type?: string;
    min?: number;
    max?: number;
    required?: boolean;
    readonly?: boolean;
    display?: string;
    param?: string;
    values?: string[];
    text?: string;
  };
};
