import { SelectElement, Select } from './select-element';
import { TextareaElement, Textarea } from './textarea-element';
import { CheckboxElement, Checkbox } from './checkbox-element';
import { DatepickerElement, Datepicker } from './datepicker-element';
import { InputElement, Input } from './input-element';
import { RelatedElement, Related } from './related-element';

import { GroupElement, Group } from './group-element';
import { RowElement, Row } from './row-element';


export const select = { element: SelectElement, type: Select };
export const textarea = { element: TextareaElement, type: Textarea };
export const checkbox = { element: CheckboxElement, type: Checkbox };
export const datepicker = { element: DatepickerElement, type: Datepicker };
export const input = { element: InputElement, type: Input };
export const related = { element: RelatedElement, type: Related };

export const group = { element: GroupElement, type: Group };
export const row = { element: RowElement, type: Row };

