export * from './form-element';

export interface FilterEvent {
  list: string;
  reset?: boolean;
  [key: string]: any;
}
