import { SelectElement, Select } from './select-element';
import { TextareaElement, Textarea } from './textarea-element';
import { CheckboxElement, Checkbox } from './checkbox-element';
import { DatepickerElement, Datepicker } from './datepicker-element';
import { InputElement, Input } from './input-element';
import { RelatedElement, Related } from './related-element';
import { StaticElement, Static } from './static-element';
import { ListElement, List } from './list-element';
import { InfoElement, Info } from './info-element';

import { GroupElement, Group } from './group-element';
import { RowElement, Row } from './row-element';
import { TabsElement, Tabs } from './tabs-element';


export const select = { element: SelectElement, type: Select };
export const textarea = { element: TextareaElement, type: Textarea };
export const checkbox = { element: CheckboxElement, type: Checkbox };
export const datepicker = { element: DatepickerElement, type: Datepicker };
export const input = { element: InputElement, type: Input };
export const related = { element: RelatedElement, type: Related };
export const stat = { element: StaticElement, type: Static };
export const list = { element: ListElement, type: List };
export const info = { element: InfoElement, type: Info };

export const group = { element: GroupElement, type: Group };
export const row = { element: RowElement, type: Row };
export const tabs = { element: TabsElement, type: Tabs };
