import { Type } from './widget';

export interface UserWidget {
  id: string;
  type: Type;
  widgetId: string;
  config: {
    coords: string;
    size: number;
  };
  tooltip?: boolean;
  move?: boolean;
}
