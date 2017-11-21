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
  hidden?: any;
  data?: any;
  metadata?: Field[];
  options?: any[];
  dateTable?: boolean;
  templateOptions?: {
    label?: string;
    type?: string;
    min?: number;
    max?: number;
    required?: boolean;
    readonly?: boolean;
  };
};
