export enum Type {
  Calendar = 'shift',
  Buttons = 'contact',
  Candidates = 'candidatecontact'
}

export interface Widget {
  id: string;
  type: Type;
  name?: string;
  img?: string;
}
