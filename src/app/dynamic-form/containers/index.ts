import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicListComponent } from './dynamic-list/dynamic-list.component';
import { FilterBlockComponent } from './filter-block/filter-block.component';
import { FormCollapseComponent } from './form-collapse/form-collapse.component';
import { FormColumnComponent } from './form-column/form-column.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { FormHiddenComponent } from './form-hidden/form-hidden.component';
import { FormRowComponent } from './form-row/form-row.component';
import { FormTabsComponent } from './form-tabs/form-tabs.component';
import { ListButtonsComponent } from './list-buttons/list-buttons.component';
import { ListColumnComponent } from './list-column/list-column.component';

export * from './dynamic-form/dynamic-form.component';
export * from './dynamic-list/dynamic-list.component';
export * from './filter-block/filter-block.component';

export const entryComponents = [
  DynamicFormComponent,
  DynamicListComponent,
  FormCollapseComponent,
  FormColumnComponent,
  FormGroupComponent,
  FormHiddenComponent,
  FormRowComponent,
  FormTabsComponent,
  ListColumnComponent
];

export const components = [
  ...entryComponents,
  FilterBlockComponent,
  ListButtonsComponent
];
