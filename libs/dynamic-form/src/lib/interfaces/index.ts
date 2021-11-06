export * from './form-element';
export * from './form-events';

export interface FilterEvent {
  list: string;
  reset?: boolean;
  [key: string]: any;
}
