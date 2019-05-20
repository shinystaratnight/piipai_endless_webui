import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

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
  formId?: number;
  errorMessage?: {
    field: string;
    message: string;
    visible?: boolean;
  };
  checkObject?: any;
  values?: any;
  related?: any;
  readonly?: any;
  update?: any;
  updateFormData?: boolean;
  isPrefilled?: boolean;
  reset?: string[];
  attributes?: { [key: string]: string };
  editEndpoint?: string;
  useValue?: boolean;
  if_master?: any;
  relatedObjects?: any;
  candidateTabs?: boolean;
  unique?: boolean;
  visibleMode?: boolean;
  disableButtons?: boolean;
  disableActions?: boolean;
  normal?: boolean;
  hideIfNull?: boolean;
  updated?: string[];
  formBuilder?: boolean;
  hideEditButton?: boolean;
  inline?: boolean;
  hideOnMobile?: boolean;
  showOnMobile?: boolean;
  disabled?: {
    keys: string[],
    values: any[],
    messages: string[]
  };
  strField?: string;
  templateOptions?: {
    hideLabel?: boolean;
    dontSendFields?: boolean;
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
    description?: string;
    editLabel?: string;
    editDescription?: string;
    info?: any;
    bottom?: boolean;
    inlineFilters?: boolean;
    addon?: string;
    placeholder?: string;
    danger?: string;
    step?: number;
    icon?: string;
    noneValue?: string;
    full?: boolean;
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    hidePreviewError?: boolean;
    customLabel?: {
      field: string;
      values: { [key: string]: any };
    }
  };
}

interface BasicFormElement {
  key: string;
  type: string;

  mode?: BehaviorSubject<string>;
  hidden?: BehaviorSubject<boolean>;

  default?: any;
  read_only?: boolean;
  value?: any;
  hide?: boolean;

  templateOptions: {
    label: string;
    placeholder?: string;
    description?: string;
  };
}

interface FormCheckboxField extends BasicFormElement {
  templateOptions: {
    label: string;
    color: string;
    values: { [key: string]: string };
  };
}

interface FormInputField extends BasicFormElement {
  templateOptions: {
    label: string;
    max: number;
    min: number;
    type: string;
    required?: string;
  };
}

// export type Field = FormInputField | FormCheckboxField;
