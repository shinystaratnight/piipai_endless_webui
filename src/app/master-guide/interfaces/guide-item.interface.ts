export interface GuideItem {
  key: string;
  text: any[];
  endpoint?: string;
  completed?: boolean;
  options?: Array<{ active: boolean, text: string, value: string }>;
}
