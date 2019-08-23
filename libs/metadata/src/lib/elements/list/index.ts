import { ColumnElement } from './column-element';
import { MainElement } from './main-element';

import { StaticElement, Static } from './static-element';
import { TextElement, Text } from './text-element';

export const column = { element: ColumnElement };
export const main = { element: MainElement };

export const stat = { element: StaticElement, type: Static };
export const text = { element: TextElement, type: Text };
