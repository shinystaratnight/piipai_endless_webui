import { ColumnElement } from './column-element';
import { MainElement } from './main-element';

import { StaticElement, Static } from './static-element';
import { TextElement, Text } from './text-element';
import { RelatedElement, Related } from './related-element';
import { ButtonElement, Button } from './button-element';
import { SelectElement, Select } from './select-element';
import { PictureElement, Picture } from './picture-element';

export const column = { element: ColumnElement };
export const main = { element: MainElement };

export const stat = { element: StaticElement, type: Static };
export const text = { element: TextElement, type: Text };
export const related = { element: RelatedElement, type: Related };
export const button = { element: ButtonElement, type: Button };
export const select = { element: SelectElement, type: Select };
export const picture = { element: PictureElement, type: Picture };
