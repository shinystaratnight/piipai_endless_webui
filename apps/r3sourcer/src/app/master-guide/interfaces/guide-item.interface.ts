interface GuideItemOption {
  active?: boolean;
  text: string;
  value: string;
}

export interface GuideItem {
  key: string;
  text: any[];
  endpoint?: string;
  completed?: boolean;
  value?: any;
  options?: GuideItemOption[];
}
