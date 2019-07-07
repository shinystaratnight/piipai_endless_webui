export interface GuideItem {
  completed: boolean;
  text: any[];
  options?: Array<{ active: boolean, text: string }>;
}
