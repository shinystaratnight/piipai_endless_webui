import { Type } from './widget';

export interface UserWidget {
  id: string;
  type: Type;
  widgetId: string;
  config: {
    coords: number[];
    size: number;
  };
  tooltip?: boolean;
}
