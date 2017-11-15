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
  templateOptions?: {
    label?: string;
    type?: string;
    min?: number;
    max?: number;
    required?: boolean;
    readonly?: boolean;
  };
};
